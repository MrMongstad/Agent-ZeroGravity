import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
// ES Module compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths based on your workspace structure
const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const MEMORY_DIR = path.resolve(WORKSPACE_ROOT, 'memory/prompt_library');
const OUTPUT_FILE = path.resolve(WORKSPACE_ROOT, 'projects/_active/Prompt Magic/src/data/library.json');

const FILES_TO_PARSE = [
  { filename: 'DEV_PROMPTS.md', category: 'Developer' },
  { filename: 'CREATIVE_PROMPTS.md', category: 'Creative' }
];

/**
 * Robust CSV Parser that handles commas and newlines inside quotes.
 */
function parseCSV(text) {
  // Strip markdown code block syntax if present
  const cleanText = text.replace(/^```(markdown)?/im, '').replace(/```$/m, '').trim();

  const results = [];
  let current = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        value += '"'; // Handle escaped quotes ("")
        i++;
      } else {
        inQuotes = !inQuotes; // Toggle quote state
      }
    } else if (char === ',' && !inQuotes) {
      current.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++; // Skip Windows \n inside \r\n
      current.push(value);
      if (current.some(c => c.trim() !== '')) {
        results.push(current);
      }
      current = [];
      value = '';
    } else {
      value += char;
    }
  }

  // Push the final row if the file doesn't end with a newline
  if (current.length > 0 || value !== '') {
    current.push(value);
    if (current.some(c => c.trim() !== '')) results.push(current);
  }

  return results;
}

function buildLibrary() {
  const finalLibrary = [];

  for (const { filename, category } of FILES_TO_PARSE) {
    const filePath = path.join(MEMORY_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.warn(`[WARN] File not found: ${filePath}`);
      continue;
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const parsedRows = parseCSV(rawData);

    parsedRows.forEach(row => {
      if (row.length >= 2 && row[0] && row[1]) {
        finalLibrary.push({
          title: row[0].trim(),
          prompt: row[1].trim(),
          category: category,
          author: row[4] ? row[4].trim() : 'Unknown'
        });
      }
    });
  }

  // Ensure the output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write to the src/data directory
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalLibrary, null, 2), 'utf-8');
  console.log(`✅ Successfully built prompt library! Parsed ${finalLibrary.length} prompts.`);
  console.log(`📂 Output saved to: ${OUTPUT_FILE}`);
}

buildLibrary();
