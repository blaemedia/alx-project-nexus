"""
Production-ready Django settings for BlaeMart on Render
"""

from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv
import dj_database_url

# BASE DIR
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env
dotenv_path = BASE_DIR / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
    print(f"✓ Loaded environment from {dotenv_path}")
else:
    print(f"⚠️  .env file not found. Create one at: {BASE_DIR / '.env'}")

# SECURITY
SECRET_KEY = os.getenv("SECRET_KEY", "unsafe-secret-key-for-dev")
DEBUG = os.getenv("DEBUG", "False") == "True"

# Render URL — replace with your service URL
ALLOWED_HOSTS = [
    os.getenv("RENDER_EXTERNAL_HOSTNAME", "localhost"),
    '127.0.0.1',
]

# Custom User
AUTH_USER_MODEL = 'core.User'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Apps
INSTALLED_APPS = [
    'corsheaders',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'backend.store',
    'backend.core',

    'rest_framework',
    'rest_framework.authtoken',
    'drf_yasg',
    'djoser',
    'rest_framework_simplejwt',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Serve static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URLs
ROOT_URLCONF = 'backend.BlaeMart.urls'
WSGI_APPLICATION = 'backend.BlaeMart.wsgi.application'

# Templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Add template dirs if any
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# Database (MySQL on Render or external)
DATABASES = {
    'default': dj_database_url.config(
        default=f"mysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST','localhost')}:{os.getenv('DB_PORT','3306')}/{os.getenv('DB_NAME')}"
    )
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Celery
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/1')

# CORS
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept','accept-encoding','authorization','content-type',
    'dnt','origin','user-agent','x-csrftoken','x-requested-with'
]
CORS_ALLOW_METHODS = ['DELETE','GET','OPTIONS','PATCH','POST','PUT']
CORS_EXPOSE_HEADERS = ['Content-Type','X-CSRFToken']
CORS_PREFLIGHT_MAX_AGE = 86400

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.AllowAny'],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

AUTHENTICATION_BACKENDS = ['django.contrib.auth.backends.ModelBackend']

# Email (production-ready)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True

# Djoser
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SERIALIZERS': {
        'user_create': 'core.serializers.UserCreateSerializer',
        'user': 'backend.core.serializers.UserSerializer',
    },
    'PERMISSIONS': {
        'user_create': ['rest_framework.permissions.AllowAny'],
        'user': ['rest_framework.permissions.IsAuthenticated'],
    },
}


# EMAIL_HOST_USER=laembat26@gmail.com
# EMAIL_HOST_PASSWORD=cngrdwtvymggyhtk
# SECRET_KEY=bv52dmcz5oe*1oxe^c-b3fczafhmj0++aewr+ujxfq73qub18q
# DEBUG=False
# DATABASE_URL=postgres://<POSTGRES_USER>:<POSTGRES_PASSWORD>@<POSTGRES_HOST>:5432/<POSTGRES_DB>

# CELERY_BROKER_URL=redis://:ASFPAAImcDJhYmFhOTk5YzUyYjI0ZTc0OTY2MDEyMzY2OTgzYTcyMXAyODUyNw@composed-jaybird-8527.upstash.io:6379/0

# DB_NAME=BlaeMart
# DB_USER=blaemart
# DB_PASSWORD=StrongPass123!
# DB_HOST=localhost
# DB_PORT=3306


# worker: celery -A backend.BlaeMart worker -l info