import os

root_dir = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\projects\Sonic_Reader_V2"
export_dir = r"c:\Users\steph\Desktop\Antigravity and Agent 0\google_ai_studio_sonic_export"

if not os.path.exists(export_dir):
    os.makedirs(export_dir)

ignore_dirs = {'.git', 'node_modules', 'dist', 'build', '.next', 'out', '.vscode', '__pycache__', 'venv', 'env'}
valid_exts = {'.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md', '.py'}

files_to_export = []

# Gather files
for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in ignore_dirs]
    for file in files:
        ext = os.path.splitext(file)[1]
        if ext in valid_exts:
            filepath = os.path.join(root, file)
            rel_path = os.path.relpath(filepath, root_dir)
            files_to_export.append((rel_path, filepath))

# Write everything to a single file
export_file_path = os.path.join(export_dir, "sonic_reader_v2_full_codebase.txt")
with open(export_file_path, 'w', encoding='utf-8') as f:
    f.write("=== SONIC READER V2 : FULL CODEBASE ===\n")
    f.write("This file contains the entire directory structure and source code of the Sonic Reader V2 project.\n\n")
    
    f.write("--- DIRECTORY INDEX ---\n")
    for rel_path, _ in sorted(files_to_export):
        f.write(f"- {rel_path}\n")
    f.write("\n\n")
    
    f.write("--- SOURCE CODE ---\n\n")
    for rel_path, filepath in sorted(files_to_export):
        try:
            with open(filepath, 'r', encoding='utf-8') as src_f:
                content = src_f.read()
        except Exception as e:
            print(f"Skipping {filepath} due to read error: {e}")
            continue
        
        f.write(f"// ==========================================\n")
        f.write(f"// File: {rel_path}\n")
        f.write(f"// ==========================================\n\n")
        f.write(content)
        f.write("\n\n")

print(f"Export completed! Full codebase saved to: {export_file_path}")

# Generate the Google AI Studio Prompt
prompt_path = os.path.join(export_dir, "ai_studio_prompt.txt")
with open(prompt_path, 'w', encoding='utf-8') as f:
    f.write("""Here is the prompt you can use in Google AI Studio:

I have uploaded a single text file (`sonic_reader_v2_full_codebase.txt`) containing the entire source code and directory structure for my project, **Sonic Reader V2**.

**Your Objective:**
Please perform a comprehensive debugging, UX, and optimization audit of this codebase. 

**Areas of Focus:**
1. **Logic Bugs & Edge Cases:** Identify any potential bugs, race conditions, or unhandled errors.
2. **UX Friction:** Point out areas where the user experience could be improved (e.g., status indicators, transitions, intuitive controls).
3. **Performance Optimization:** Look for rendering bottlenecks, inefficient data fetching, or heavy computations that could be optimized.
4. **Code Quality:** Suggest structural improvements, better separation of concerns, or modern best practices.

**Output Format:**
Please provide a structured report categorizing your findings by the areas above. For any issues you find, provide the specific file name, the lines of code involved, and a clear, actionable recommendation or code snippet to fix it.
""")

print(f"Prompt template saved to: {prompt_path}")
