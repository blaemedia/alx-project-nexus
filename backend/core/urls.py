# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .jwt_views import EmailTokenObtainPairView  # Import the new view

urlpatterns = [
    path('auth/jwt/create/', EmailTokenObtainPairView.as_view(), name='jwt-create'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    # ... your other URLs
]