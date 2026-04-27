/// Text Sanitizer: Pre-TTS Processing Pipeline
/// ─────────────────────────────────────────────
/// Strips symbols, normalizes whitespace, expands abbreviations,
/// and cleans raw DOM text BEFORE it reaches the voice engine.
/// This prevents Piper crashes on unsupported glyphs and ensures
/// natural-sounding speech output.

/// Primary sanitization pass. Takes raw scraped text and returns
/// a phonetically safe string for TTS consumption.
pub fn sanitize_for_tts(raw: &str) -> String {
    let mut result = raw.to_string();

    // 1. Strip code fences and inline code markers
    result = strip_code_blocks(&result);

    // 2. Replace common programming symbols with spoken equivalents
    result = expand_symbols(&result);

    // 3. Normalize unicode and strip unsupported glyphs
    result = strip_unsupported_glyphs(&result);

    // 4. Collapse whitespace
    result = collapse_whitespace(&result);

    // 5. Final trim
    result.trim().to_string()
}

/// Strip markdown code fences (``` blocks) and inline backticks
fn strip_code_blocks(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    let mut in_fence = false;
    
    for line in text.lines() {
        let trimmed = line.trim();
        if trimmed.starts_with("```") {
            in_fence = !in_fence;
            continue;
        }
        if !in_fence {
            // Strip inline backticks but keep content
            let cleaned = trimmed.replace('`', "");
            result.push_str(&cleaned);
            result.push(' ');
        }
    }
    result
}

/// Replace programming symbols with spoken-word equivalents
fn expand_symbols(text: &str) -> String {
    text.replace("->", " arrow ")
        .replace("=>", " fat arrow ")
        .replace("!=", " not equal ")
        .replace("==", " equals ")
        .replace(">=", " greater or equal ")
        .replace("<=", " less or equal ")
        .replace("&&", " and ")
        .replace("||", " or ")
        .replace("::", " scope ")
        .replace("//", ", ")  // comments become pauses
        .replace("/*", "")
        .replace("*/", "")
        .replace('#', "")
        .replace('_', " ")
        .replace('{', "")
        .replace('}', "")
        .replace('[', "")
        .replace(']', "")
        .replace('(', "")
        .replace(')', "")
        .replace(';', ".")
        .replace('|', " ")
        .replace('\\', " ")
        .replace('/', " ")
        .replace('*', "")
        .replace('&', " and ")
        .replace('<', " less than ")
        .replace('>', " greater than ")
        .replace('@', " at ")
}

/// Strip any character that isn't ASCII alphanumeric, basic punctuation, or whitespace.
/// This is the final safety net before TTS.
fn strip_unsupported_glyphs(text: &str) -> String {
    text.chars()
        .filter(|c| {
            c.is_ascii_alphanumeric()
                || c.is_whitespace()
                || matches!(c, '.' | ',' | '!' | '?' | '\'' | '"' | '-' | ':')
        })
        .collect()
}

/// Collapse multiple whitespace characters into a single space
fn collapse_whitespace(text: &str) -> String {
    let mut result = String::with_capacity(text.len());
    let mut prev_space = false;
    for ch in text.chars() {
        if ch.is_whitespace() {
            if !prev_space {
                result.push(' ');
                prev_space = true;
            }
        } else {
            result.push(ch);
            prev_space = false;
        }
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_sanitization() {
        let input = "fn main() { println!(\"Hello, World!\"); }";
        let output = sanitize_for_tts(input);
        assert!(!output.contains('{'));
        assert!(!output.contains('}'));
        assert!(!output.contains('('));
        assert!(output.contains("Hello"));
    }

    #[test]
    fn test_code_fence_stripping() {
        let input = "Here is code:\n```rust\nlet x = 5;\n```\nEnd of code.";
        let output = sanitize_for_tts(input);
        assert!(!output.contains("let x"));
        assert!(output.contains("Here is code"));
        assert!(output.contains("End of code"));
    }

    #[test]
    fn test_symbol_expansion() {
        let input = "x != y && z == w";
        let output = sanitize_for_tts(input);
        assert!(output.contains("not equal"));
        assert!(output.contains("and"));
        assert!(output.contains("equals"));
    }

    #[test]
    fn test_empty_input() {
        assert_eq!(sanitize_for_tts(""), "");
    }

    #[test]
    fn test_pure_symbols() {
        let input = "{}[]():::///***";
        let output = sanitize_for_tts(input);
        // Should reduce to near-empty after stripping
        assert!(output.trim().len() < input.len());
    }
}
