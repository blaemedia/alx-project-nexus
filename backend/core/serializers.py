# serializers.py - UPDATED VERSION
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from djoser.serializers import UserSerializer as BaseUserSerializer
from djoser.serializers import TokenCreateSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from .models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializers import EmailTokenObtainPairSerializer

class UserCreateSerializer(BaseUserCreateSerializer):
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "password",
            "is_vendor",
            "is_customer",
            "is_delivery",
        )
        # Add ref_name to avoid conflict with Djoser's serializer
        ref_name = "CustomUserCreateSerializer"


class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = (
            "id",
            "email",
            "is_vendor",
            "is_customer",
            "is_delivery",
        )
        # Add unique ref_name - THIS IS THE FIX FOR YOUR ERROR
        ref_name = "CustomUserSerializer"


class CustomTokenCreateSerializer(TokenCreateSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        
        if not email or not password:
            raise serializers.ValidationError(
                _("Must include 'email' and 'password'."),
                code='authorization',
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                _("No user found with this email"),
                code='authorization',
            )
        
        if not user.check_password(password):
            raise serializers.ValidationError(
                _("Invalid password"),
                code='authorization',
            )
        
        if not user.is_active:
            raise serializers.ValidationError(
                _("User account is inactive"),
                code='authorization',
            )
        
        user = authenticate(username=email, password=password)
        
        if not user:
            raise serializers.ValidationError(
                _("Unable to authenticate"),
                code='authorization',
            )
        
        return super().validate(attrs)
    
    def get_cleaned_data(self):
        return {
            'email': self.validated_data.get('email', ''),
            'password': self.validated_data.get('password', ''),
        }
    



class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
