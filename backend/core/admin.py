from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm

User = get_user_model()

# Create custom forms without username
class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email",)  # Only email for creation
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove username field from the form
        self.fields.pop('username', None)

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = '__all__'
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove username field from the form
        self.fields.pop('username', None)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Use custom forms
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    # Fields to display in the admin list view
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'is_staff', 'is_active',
        'is_vendor', 'is_customer', 'is_delivery'
    )
    
    # Make is_active editable directly in list view
    list_editable = ('is_active', 'is_vendor', 'is_customer', 'is_delivery')
    
    list_filter = (
        'is_staff', 'is_active', 'is_vendor', 'is_customer', 'is_delivery'
    )

    # Add actions to bulk activate/deactivate users
    actions = ['activate_users', 'deactivate_users']
    
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} users activated successfully.")
    activate_users.short_description = "Activate selected users"
    
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} users deactivated.")
    deactivate_users.short_description = "Deactivate selected users"

    fieldsets = (
        (None, {'fields': ('email', 'password')}),  # Remove username
        (_('Personal info'), {'fields': ('first_name', 'last_name')}),  # Add personal info section
        (_('Permissions'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser',
                'is_vendor', 'is_customer', 'is_delivery',
                'groups', 'user_permissions'
            ),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'password1', 'password2',
                'first_name', 'last_name',  # Add first/last name if needed
                'is_active',
                'is_vendor', 'is_customer', 'is_delivery'
            ),
        }),
    )

    # Search by email only (remove 'username' from search_fields)
    search_fields = ('email', 'first_name', 'last_name')
    
    # Order by email (or id)
    ordering = ('email',)
    
    filter_horizontal = ('groups', 'user_permissions',)