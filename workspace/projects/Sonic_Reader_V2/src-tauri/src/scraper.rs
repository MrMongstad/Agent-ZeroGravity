use uiautomation::UIAutomation;
use uiautomation::types::Point;
use uiautomation::patterns::UITextPattern;

/**
 * Native Scraper Logic: Chrome Legacy Window Fix
 * ──────────────────────────────────────────────
 * The 'fail point' in V1 was treating 'Chrome Legacy Window' as a content node.
 * V2 Protocol: If a reserved dummy class is hit, recursively search upwards 
 * until the Root Browser element is found, then dive into the Accessibility tree.
 */
pub fn find_content_container(automation: &UIAutomation, start_point: Point) -> Result<uiautomation::UIElement, String> {
    let element = automation.element_from_point(start_point)
        .map_err(|e| format!("UIA point error: {:?}", e))?;

    if let Ok(name) = element.get_name() {
        if name == "Chrome Legacy Window" || name.is_empty() {
             // Protocol: Trigger Recursive Vault
             return recursive_vault_search(automation, element);
        }
    }
    
    Ok(element)
}

fn recursive_vault_search(automation: &UIAutomation, start_node: uiautomation::UIElement) -> Result<uiautomation::UIElement, String> {
    let walker = automation.create_tree_walker()
        .map_err(|e| format!("Walker error: {:?}", e))?;
    
    let mut current = start_node;
    // Walk up to 10 levels to find the true browser frame
    for _ in 0..10 {
        if let Ok(parent) = walker.get_parent(&current) {
            if let Ok(class) = parent.get_classname() {
                if class.contains("Chrome_WidgetWin") {
                    // We found the container. Now search for the first valid TextPattern descendant.
                    return find_first_text_node(&walker, &parent);
                }
            }
            current = parent;
        } else { break; }
    }
    
    Err("Could not escape Legacy Window facade.".to_string())
}

fn find_first_text_node(walker: &uiautomation::UITreeWalker, root: &uiautomation::UIElement) -> Result<uiautomation::UIElement, String> {
    // DFS for the first element supporting TextPattern
    let mut stack = vec![root.clone()];
    while let Some(node) = stack.pop() {
        if node.get_pattern::<UITextPattern>().is_ok() {
            return Ok(node);
        }
        if let Ok(child) = walker.get_first_child(&node) {
            stack.push(child);
            // Siblings would be added here for full breadth, but we want the deepest content first
        }
    }
    Err("No text content found in browser tree.".to_string())
}
