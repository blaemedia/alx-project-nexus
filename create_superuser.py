import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.BlaeMart.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Check if superuser already exists
if not User.objects.filter(email='admin@example.com').exists():
    User.objects.create_superuser(
        email='blaemedia26@gmail.com',
        password='6116'
    )
    print('✅ Superuser created: admin@example.com / admin123')
else:
    print('✅ Superuser already exists')