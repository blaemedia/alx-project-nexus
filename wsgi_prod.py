import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.BlaeMart.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()