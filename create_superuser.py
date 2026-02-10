import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.BlaeMart.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Use environment variables for security
SUPERUSER_EMAIL = os.getenv('SUPERUSER_EMAIL', 'blaemedia26@gmail.com')
SUPERUSER_PASSWORD = os.getenv('SUPERUSER_PASSWORD', '6116')

# Check if THIS superuser already exists
if not User.objects.filter(email=SUPERUSER_EMAIL).exists():
    try:
        User.objects.create_superuser(
            email=SUPERUSER_EMAIL,
            password=SUPERUSER_PASSWORD
        )
        print(f'✅ Superuser created: {SUPERUSER_EMAIL}')
    except Exception as e:
        print(f'⚠️ Failed to create superuser: {e}')
        print('Continuing deployment...')
else:
    print(f'✅ Superuser {SUPERUSER_EMAIL} already exists')