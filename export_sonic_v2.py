import os

root_dir = r"c:\Users\steph\Desktop\Antigravity and Agent 0\workspace\projects\Sonic_Reader_V2"
export_dir = r"c:\Users\steph\Desktop\Antigravity and Agent 0\kimi_sonic_export"

if not os.path.exists(export_dir):
    os.makedirs(export_dir)

ignore_dirs = {'.git', 'node_modules', 'dist', 'build', '.next', 'out', '.vscode', '__pycache__', 'venv', 'env'}
valid_exts = {'.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.html', '.md', '.py'}
MAX_CHUNK_SIZE = 50 * 1024  # 50 KB per chunk to keep it very digestible for Kimi

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

# Write 00_index.txt
index_path = os.path.join(export_dir, "00_index.txt")
with open(index_path, 'w', encoding='utf-8') as f:
    f.write("=== SONIC READER V2 : CODEBASE INDEX ===\n")
    f.write("This index contains the directory structure of the Sonic Reader V2 project.\n")
    f.write("The actual code is divided into subsequent chunk files.\n\n")
    for rel_path, _ in sorted(files_to_export):
        f.write(f"- {rel_path}\n")

# Write chunks
chunk_index = 1
current_chunk_size = 0
current_chunk_file = None

for rel_path, filepath in sorted(files_to_export):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath} due to read error: {e}")
        continue
    
    file_block = f"--- File: {rel_path} ---\n{content}\n\n"
    block_size = len(file_block.encode('utf-8'))
    
    if current_chunk_file is None or current_chunk_size + block_size > MAX_CHUNK_SIZE:
        if current_chunk_file:
            current_chunk_file.close()
        
        chunk_filename = os.path.join(export_dir, f"{chunk_index:02d}_chunk.txt")
        current_chunk_file = open(chunk_filename, 'w', encoding='utf-8')
        current_chunk_file.write(f"=== SONIC READER V2 : CODE CHUNK {chunk_index} ===\n\n")
        current_chunk_size = 0
        chunk_index += 1
        
    current_chunk_file.write(file_block)
    current_chunk_size += block_size

if current_chunk_file:
    current_chunk_file.close()

print(f"Export completed! Files saved in: {export_dir}")
