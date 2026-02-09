import os
import sys

print("=== DIAGNOSTIC REPORT ===")
print(f"Current directory: {os.getcwd()}")
print(f"Python executable: {sys.executable}")
print(f"Python path: {sys.path}")
print()

# Check directory structure
print("Directory listing:")
for item in os.listdir('.'):
    print(f"  {item}/" if os.path.isdir(item) else f"  {item}")
print()

# Check backend directory
if os.path.exists('backend'):
    print("backend/ contents:")
    for item in os.listdir('backend'):
        print(f"  {item}/" if os.path.isdir(os.path.join('backend', item)) else f"  {item}")
    
    # Check BlaeMart directory
    if os.path.exists('backend/BlaeMart'):
        print("\nbackend/BlaeMart/ contents:")
        for item in os.listdir('backend/BlaeMart'):
            print(f"  {item}")
        
        # Check for __init__.py
        print("\nChecking __init__.py files:")
        init_files = ['backend/__init__.py', 'backend/BlaeMart/__init__.py']
        for init_file in init_files:
            if os.path.exists(init_file):
                print(f"  ✓ {init_file} exists")
            else:
                print(f"  ✗ {init_file} MISSING!")
else:
    print("✗ backend/ directory not found!")
print()

# Test the import
print("Testing import of backend.BlaeMart.settings...")
try:
    # Add current directory to path
    sys.path.insert(0, os.getcwd())
    
    # Try to import
    import backend
    print("✓ Imported 'backend'")
    
    import backend.BlaeMart
    print("✓ Imported 'backend.BlaeMart'")
    
    import backend.BlaeMart.settings
    print("✓ Imported 'backend.BlaeMart.settings'")
    
    # Try Django setup
    import django
    os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.BlaeMart.settings'
    django.setup()
    print("✓ Django setup successful!")
    
except Exception as e:
    print(f"✗ Import failed: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()