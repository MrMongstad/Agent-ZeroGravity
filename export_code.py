import os

root_dir = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\projects\norcast-planner"
output_file = r"c:\Users\steph\Desktop\Antigravity and Agent 0\kimi_code_submission.txt"

ignore_dirs = {'.git', 'node_modules', 'dist', 'build', '.next', 'out', '.vscode'}
valid_exts = {'.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md'}

with open(output_file, 'w', encoding='utf-8') as outfile:
    outfile.write("Project: Norcast Planner\n")
    outfile.write("Context: Please analyze this codebase to find pain points, debug issues, and improve the app.\n\n")
    for root, dirs, files in os.walk(root_dir):
        # modify dirs in-place to ignore specified directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in valid_exts:
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, root_dir)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    outfile.write(f"--- File: {rel_path} ---\n")
                    outfile.write(content)
                    outfile.write("\n\n")
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
print(f"Codebase exported successfully to {output_file}")
