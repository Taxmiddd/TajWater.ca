import os

def fix_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content.replace('react-hooks/set-state-in-effect', 'react-hooks/exhaustive-deps')
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed: {path}")
    except Exception as e:
        print(f"Error fixing {path}: {e}")

for root, dirs, files in os.walk('f:/tajwater-square/app'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))

for root, dirs, files in os.walk('f:/tajwater-square/components'):
    for file in files:
        if file.endswith('.tsx'):
            fix_file(os.path.join(root, file))
