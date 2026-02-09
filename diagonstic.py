import os
import sys

print("=== RENDER DEPLOYMENT DIAGNOSTIC ===")
print(f"Current directory: {os.getcwd()}")
print(f"Python executable: {sys.executable}")
print()

# Show Python path
print("Python path (sys.path):")
for i, path in enumerate(sys.path[:10]):  # Show first 10
    print(f"  {i}: {path}")
print()

# List current directory
print("Files in current directory:")
try:
    for item in sorted(os.listdir('.')):
        full_path = os.path.join('.', item)
        if os.path.isdir(full_path):
            print(f"  📁 {item}/")
        else:
            print(f"  📄 {item}")
except Exception as e:
    print(f"  Error: {e}")
print()

# Check backend structure
print("Checking backend structure:")
if os.path.exists('backend'):
    print("  ✓ backend/ exists")
    print("  Contents of backend/:")
    try:
        for item in sorted(os.listdir('backend')):
            backend_path = os.path.join('backend', item)
            if os.path.isdir(backend_path):
                print(f"    📁 {item}/")
                # Check BlaeMart
                if item == 'BlaeMart':
                    print(f"    Contents of backend/BlaeMart/:")
                    try:
                        for subitem in sorted(os.listdir(backend_path)):
                            print(f"      {'📁' if os.path.isdir(os.path.join(backend_path, subitem)) else '📄'} {subitem}")
                    except Exception as e:
                        print(f"      Error listing: {e}")
            else:
                print(f"    📄 {item}")
    except Exception as e:
        print(f"    Error: {e}")
else:
    print("  ✗ backend/ does NOT exist")
print()

# Test the critical import
print("Testing import of backend.BlaeMart.wsgi...")
try:
    # Add current directory to path just in case
    if os.getcwd() not in sys.path:
        sys.path.insert(0, os.getcwd())
    
    import backend
    print("  ✓ Imported 'backend'")
    
    import backend.BlaeMart
    print("  ✓ Imported 'backend.BlaeMart'")
    
    from backend.BlaeMart.wsgi import application
    print("  ✓ Imported 'backend.BlaeMart.wsgi.application'")
    
    print("\n✅ SUCCESS: All imports work!")
    
except ImportError as e:
    print(f"  ✗ Import failed: {e}")
    print(f"\n❌ FAILED: Check the structure above")
    
    # Extra debug
    print("\nExtra debug info:")
    print(f"  Looking for backend/__init__.py: {'Exists' if os.path.exists('backend/__init__.py') else 'MISSING'}")
    print(f"  Looking for backend/BlaeMart/__init__.py: {'Exists' if os.path.exists('backend/BlaeMart/__init__.py') else 'MISSING'}")
    print(f"  Looking for backend/BlaeMart/wsgi.py: {'Exists' if os.path.exists('backend/BlaeMart/wsgi.py') else 'MISSING'}")
    
    # Check if files are actually there
    if os.path.exists('backend/BlaeMart/wsgi.py'):
        print(f"  wsgi.py content preview (first 5 lines):")
        try:
            with open('backend/BlaeMart/wsgi.py', 'r') as f:
                for i, line in enumerate(f):
                    if i < 5:
                        print(f"    {line.rstrip()}")
        except:
            print("    Could not read wsgi.py")