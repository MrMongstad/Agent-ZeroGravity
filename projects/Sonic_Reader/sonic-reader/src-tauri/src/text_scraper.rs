use uiautomation::patterns::UITextPattern;
use uiautomation::types::{Point, TextPatternRangeEndpoint, TextUnit, ControlType};
use uiautomation::UIAutomation;
use crate::tts::{Rect, TextChunk};
use tauri::{AppHandle, Manager};

pub async fn scrape_text_around_cursor(app: AppHandle) -> Result<Vec<TextChunk>, String> {
    // 1. Get the current mouse position
    let mut pt = windows::Win32::Foundation::POINT { x: 0, y: 0 };
    unsafe {
        windows::Win32::UI::WindowsAndMessaging::GetCursorPos(&mut pt)
            .map_err(|e| format!("Failed to get cursor pos: {:?}", e))?;
    }
    let search_point = Point::new(pt.x, pt.y);

    // Get monitor scale factor AND physical offset for coordinate conversion
    let mut scale_factor: f64 = 1.0;
    let mut monitor_x_offset: f64 = 0.0;
    let mut monitor_y_offset: f64 = 0.0;
    
    if let Ok(monitors) = app.get_webview_window("main").unwrap().available_monitors() {
        for monitor in monitors {
            let pos = monitor.position();
            let size = monitor.size();
            let l = pos.x;
            let t = pos.y;
            let r = l + size.width as i32;
            let b = t + size.height as i32;
            
            if pt.x >= l && pt.x <= r && pt.y >= t && pt.y <= b {
                scale_factor = monitor.scale_factor();
                monitor_x_offset = pos.x as f64;
                monitor_y_offset = pos.y as f64;
                break;
            }
        }
    }


    let _uia = UIAutomation::new().map_err(|e| format!("UIA error: {:?}", e))?;

    // 2. Find the window handle at the point first (FAST & THREAD-SAFE)
    let hwnd = unsafe {
        windows::Win32::UI::WindowsAndMessaging::WindowFromPoint(pt)
    };

    if hwnd.is_invalid() {
        return Err("No window found at cursor.".to_string());
    }

    // --- SELF-PRESERVATION: Don't read our own app or the highlighter ---
    let mut process_id: u32 = 0;
    unsafe {
        windows::Win32::UI::WindowsAndMessaging::GetWindowThreadProcessId(hwnd, Some(&mut process_id));
    }
    
    let my_pid = std::process::id();
    if process_id == my_pid {
        return Err("Cannot scrape SonicReader itself. Hover over target content!".to_string());
    }

    // 3. Initialize UIAutomation (COM)
    let automation = UIAutomation::new()
        .map_err(|e| format!("Failed to initialize UIAutomation: {:?}", e))?;

    // 4. Find the element at the point
    let mut element = automation.element_from_point(search_point)
        .map_err(|e| format!("Could not find element at cursor: {:?}", e))?;

    // --- PDF / CHROME / ACROBAT FIX: Sometimes element_from_point hits the Desktop pane
    let mut hit_desktop = false;
    if let Ok(name) = element.get_name() {
        let name_lower = name.to_lowercase();
        println!("[Scraper] Hit element name: '{}'", name);
        
        // If it's the desktop, a folder, or a generic placeholder...
        if name.is_empty() || 
           name.contains("Desktop") || 
           name == "FolderView" || 
           name_lower.contains("pdf scroll") || 
           name_lower.contains("page indicator") ||
           (name.contains('/') && name.chars().all(|c| c.is_ascii_digit() || c == '/' || c == ' ')) {
             hit_desktop = true;
             println!("[Scraper] Non-content element detected ('{}'), resolving to window...", name);
             
             if let Ok(hwnd_element) = automation.element_from_handle(uiautomation::types::Handle::from(hwnd.0 as isize)) {
                 element = hwnd_element;
             }
        }
    }

    // 5. Find best TextPattern (Hierarchy Search)
    let mut best_pattern = element.get_pattern::<UITextPattern>().ok();
    
    if best_pattern.is_none() {
        println!("[Scraper] No direct TextPattern. Searching descendants...");
        
        let current_element = element.clone();
        if let Ok(walker) = automation.create_tree_walker() {
            let mut queue = std::collections::VecDeque::new();
            queue.push_back((current_element.clone(), 0));
            let mut visited = 0;

            'search: while let Some((node, depth)) = queue.pop_front() {
                if depth > 10 || visited > 200 { break; }
                visited += 1;

                if let Ok(pattern) = node.get_pattern::<UITextPattern>() {
                    println!("[Scraper] Found TextPattern at depth {}", depth);
                    best_pattern = Some(pattern);
                    // Explicitly update the element to the one that has the pattern
                    element = node.clone();
                    break 'search;
                }

                if let Ok(mut child) = walker.get_first_child(&node) {
                    loop {
                        let mut check_child = true;
                        if let Ok(rect) = child.get_bounding_rectangle() {
                            let (l, t, w, h) = (rect.get_left(), rect.get_top(), rect.get_width(), rect.get_height());
                            if pt.x < l || pt.x > l + w || pt.y < t || pt.y > t + h {
                                check_child = false;
                            }
                        }

                        if check_child {
                            queue.push_back((child.clone(), depth + 1));
                        }

                        if let Ok(next) = walker.get_next_sibling(&child) {
                            child = next;
                        } else {
                            break;
                        }
                    }
                }
            }
        }
    }

    // Fallback: Upward search 
    if best_pattern.is_none() && !hit_desktop {
        println!("[Scraper] Still no pattern. Searching parents...");
        let mut current_node = element.clone();
        if let Ok(walker) = automation.create_tree_walker() {
            for depth in 0..15 {
                if let Ok(parent) = walker.get_parent(&current_node) {
                    if let Ok(pattern) = parent.get_pattern::<UITextPattern>() {
                        println!("[Scraper] Found TextPattern at parent level {}", depth + 1);
                        best_pattern = Some(pattern);
                        element = parent.clone();
                        break;
                    }
                    current_node = parent;
                } else { break; }
            }
        }
    }

    // Try the TextPattern Range strategy first (Happy Path)
    if let Some(text_pattern) = &best_pattern {
        if let Ok(cursor_range) = text_pattern.get_range_from_point(search_point.into()) {
            if let Ok(doc_range) = text_pattern.get_document_range() {
                let _ = doc_range.move_endpoint_by_range(TextPatternRangeEndpoint::Start, &cursor_range, TextPatternRangeEndpoint::Start);

                let mut chunks = Vec::new();
                let iter_range = doc_range.clone();
                let mut last_bottom = -1.0;
                let mut last_left = -1.0;

                for _ in 0..15 {
                    let sentence_range = iter_range.clone();
                    let _ = sentence_range.expand_to_enclosing_unit(TextUnit::Line);
                    
                    let text = sentence_range.get_text(-1).unwrap_or_default();
                    if !text.trim().is_empty() {
                        if let Ok(element) = sentence_range.get_enclosing_element() {
                                // Control Type strict break removed. Inline IDE badges and code links are often classified as buttons, causing premature stream termination.

                            if let Ok(r) = element.get_bounding_rectangle() {
                                // Normalize from absolute physical coordinates into screen-local logical coordinates
                                let current_left = (r.get_left() as f64 - monitor_x_offset) / scale_factor;
                                let current_top = (r.get_top() as f64 - monitor_y_offset) / scale_factor;
                                let current_bottom = ((r.get_top() + r.get_height()) as f64 - monitor_y_offset) / scale_factor;

                                // 2. Geographic Jump Logic - Stop if we jump sections
                                if last_bottom > 0.0 {
                                    let delta_y = current_top - last_bottom;
                                    let delta_x = (current_left - last_left).abs();
                                    
                                    // If we jumped > 120px down or > 300px horizontally, it's a new UI region
                                    if delta_y > 120.0 || delta_x > 300.0 {
                                        println!("[Scraper] Geometric jump detected (dy: {}, dx: {}), stopping.", delta_y, delta_x);
                                        break;
                                    }
                                }

                                last_bottom = current_bottom;
                                last_left = current_left;

                                let mut rects = Vec::new();
                                rects.push(Rect {
                                    x: current_left,
                                    y: current_top,
                                    width: r.get_width() as f64 / scale_factor,
                                    height: r.get_height() as f64 / scale_factor,
                                });
                                chunks.push(TextChunk { text, rects });
                            }
                        }
                    }

                    if iter_range.move_text(TextUnit::Line, 1).unwrap_or(0) == 0 {
                        // Nudge strategy: If moving by line is blocked by an inline element (like an image/icon),
                        // try to forcibly nudge the cursor forward by character to skip the anomaly.
                        if iter_range.move_text(TextUnit::Character, 1).unwrap_or(0) == 0 {
                            break;
                        }
                    }
                    
                    if let Ok(end_cmp) = iter_range.compare_endpoints(TextPatternRangeEndpoint::Start, &doc_range, TextPatternRangeEndpoint::End) {
                       if end_cmp >= 0 { break; }
                    }
                }

                if !chunks.is_empty() {
                    return Ok(chunks);
                }
            }
        }
    }

    // --- FALLBACK STRATEGY ---
    // If we're here, either UIAutomation didn't provide a TextPattern, 
    // OR getting the range failed (Error -2147467259 on PDFs)
    
    let mut fallback_text = String::new();

    // 1. If TextPattern exists but get_range_from_point failed,
    //    we can just try getting text of the entire document range
    if let Some(pattern) = &best_pattern {
        if let Ok(doc_range) = pattern.get_document_range() {
            if let Ok(s) = doc_range.get_text(-1) {
                if !s.trim().is_empty() {
                    fallback_text = s;
                }
            }
        }
    }

    // 2. Try Value Pattern (input fields)
    if fallback_text.is_empty() {
        if let Ok(value_pattern) = element.get_pattern::<uiautomation::patterns::UIValuePattern>() {
            if let Ok(s) = value_pattern.get_value() {
                let s: String = s;
                if !s.trim().is_empty() {
                    fallback_text = s;
                }
            }
        }
    }

    // 3. Try Name Property (labels) - BUT SKIP DATES/PAGE NUMBERS!
    if fallback_text.is_empty() {
        if let Ok(name) = element.get_name() {
             let name: String = name;
             let is_page_indicator = name.contains('/') && name.chars().all(|c| c.is_ascii_digit() || c == '/' || c == ' ');
             
             if !name.trim().is_empty() && !is_page_indicator {
                 fallback_text = name;
             } else if is_page_indicator {
                 println!("[Scraper] Skipping page indicator name: '{}'", name);
             }
        }
    }

    // 4. Try to concatenate Names from immediate children (for split PDFs)
    if fallback_text.is_empty() {
         if let Ok(walker) = automation.create_tree_walker() {
             let mut child_texts = Vec::new();
             if let Ok(mut child) = walker.get_first_child(&element) {
                 for _ in 0..100 { // Limit to 100 children
                     if let Ok(name) = child.get_name() {
                         if !name.trim().is_empty() {
                             child_texts.push(name.trim().to_string());
                         }
                     }
                     if let Ok(next) = walker.get_next_sibling(&child) {
                         child = next;
                     } else {
                         break;
                     }
                 }
             }
             if !child_texts.is_empty() {
                 fallback_text = child_texts.join(" ");
             }
         }
    }

    if !fallback_text.is_empty() {
         // Create a dummy rect if we can get bounds, otherwise default to cursor
         let mut rects = Vec::new();
         if let Ok(r) = element.get_bounding_rectangle() {
             rects.push(Rect {
                 x: (r.get_left() as f64 - monitor_x_offset) / scale_factor,
                 y: (r.get_top() as f64 - monitor_y_offset) / scale_factor,
                 width: r.get_width() as f64 / scale_factor,
                 height: r.get_height() as f64 / scale_factor,
             });
         } else {
             rects.push(Rect { 
                 x: (pt.x as f64 - monitor_x_offset) / scale_factor, 
                 y: (pt.y as f64 - monitor_y_offset) / scale_factor, 
                 width: 10.0, 
                 height: 10.0 
             });
         }
         
         // For fallbacks, we return the entire chunk as one piece
         return Ok(vec![TextChunk { text: fallback_text, rects }]);
    }

    Err("No readable text or properties found at point.".to_string())
}

