from django.db import models
from django.core.validators import MinValueValidator
from django.conf import settings


# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    cat_thumbnail = models.ImageField(
        'default.png',
        blank=True
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name



class Collection(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['title']
        verbose_name = 'Collection'
        verbose_name_plural = 'Collections'

    def __str__(self):
        return self.title
    

class Promotion(models.Model):
    name = models.CharField(max_length=255)
    discount_percent = models.PositiveIntegerField(
        help_text="Percentage discount (e.g. 10 for 10%)"
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-start_date']
        verbose_name = 'Promotion'
        verbose_name_plural = 'Promotions'

    def __str__(self):
        return f"{self.name} ({self.discount_percent}%)"
    

# product model
class Product(models.Model):
    
        name = models.CharField(max_length=255)
        slug = models.SlugField(max_length=255, unique=True)
        description = models.TextField(null=True,blank=True)

        price = models.DecimalField(max_digits=12,decimal_places=2,
                                 validators=[MinValueValidator(1)])
        
        last_update = models.DateTimeField(auto_now=True)
        inventory = models.IntegerField()
        sku = models.CharField(max_length=100, unique=True)
        category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products'
    )
        
        collections = models.ManyToManyField(Collection,blank=True,
        related_name='products'
    )
        promotion = models.ForeignKey(
        Promotion,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='products'
    )
        
        def __str__(self):
            return self.name
        
    
class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(upload_to='store/images')
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'id']
        verbose_name = 'Product Image'
        verbose_name_plural = 'Product Images'

    def __str__(self):
        return f"Image for {self.product.name}"
    
    
    
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    is_customer = models.BooleanField(default=True)
    is_vendor = models.BooleanField(default=False)
    is_delivery = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s profile"
    


class ProductReview(models.Model):
    product = models.ForeignKey(
        'Product',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField(
        default=5,
        choices=[(i, i) for i in range(1, 6)],
        help_text="1 (worst) – 5 (best)"
    )
    title = models.CharField(max_length=255, blank=True)
    body = models.TextField(blank=True)
    is_approved = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product Review'
        verbose_name_plural = 'Product Reviews'

    def __str__(self):
        return f"{self.user.username} review for {self.product.name}"
    




class CustomerProfile(models.Model):
    # Membership tiers
    MEMBERSHIP_CHOICES = [
        ('bronze', 'Bronze'),
        ('silver', 'Silver'),
        ('gold', 'Gold'),
        ('platinum', 'Platinum'),
    ]

    # Basic linkage
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='profile'
    )

    # Contact info
    phone_number = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)  # optional, often same as User.email
    shipping_address = models.TextField(blank=True)
    billing_address = models.TextField(blank=True)

    # Loyalty / membership
    points = models.PositiveIntegerField(default=0)
    membership_level = models.CharField(
        max_length=10,
        choices=MEMBERSHIP_CHOICES,
        default='bronze'
    )

    # Preferences
    wants_newsletter = models.BooleanField(default=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Optional profile image
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)

    class Meta:
        verbose_name = 'Customer Profile'
        verbose_name_plural = 'Customer Profiles'

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def total_orders(self):
        return self.user.orders.count()  # Assuming Order model has FK to User

    @property
    def total_spent(self):
        return sum(order.total_amount for order in self.user.orders.all())


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('canceled', 'Canceled'),
    ]

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    payment_status = models.BooleanField(default=False)  

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} by {self.customer.username}"
    


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price at time of order

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"
    

User = settings.AUTH_USER_MODEL
class Cart(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="cart",
        help_text="Each user has one cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        """Calculate total amount of all items in the cart"""
        items = self.items.all()
        total = sum([item.subtotal for item in items])
        return total


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items",
        help_text="The cart this item belongs to",
        null=True
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="cart_items"
    )
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('cart', 'product')  # Prevent duplicate entries

    @property
    def subtotal(self):
        """Return price * quantity"""
        return self.quantity * self.product.price
