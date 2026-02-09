from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    instead of username.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        
        # ADD THIS ONE LINE - Makes all new users active automatically
        extra_fields.setdefault('is_active', True)  # ← ADD THIS LINE
        
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model for BlaeMart
    - Email-based authentication
    - Supports vendor, customer, and delivery roles
    """

    
    username = None

    # EMAIL AS LOGIN FIELD
    email = models.EmailField(unique=True)

    # ROLE FLAGS
    is_vendor = models.BooleanField(default=False)
    is_customer = models.BooleanField(default=True)
    is_delivery = models.BooleanField(default=False)

    # AUTH CONFIG
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

  
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="core_users",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="core_user_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def __str__(self):
        return self.email