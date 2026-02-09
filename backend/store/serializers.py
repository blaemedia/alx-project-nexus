from rest_framework import serializers
from .models import (
    Product,ProductImage,OrderItem,
    Order,CartItem,Cart,ProductReview,
    Collection,Promotion
                                        )
from backend.store.models import CustomerProfile

from rest_framework import serializers
from .models import Category




class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id','name','discount_percent',
                  'start_date','end_date','is_active',]
        read_only_fields = ['id']

    def validate_discount_percent(self, value):
        if value <= 0 or value > 100:
            raise serializers.ValidationError(
                "Discount percent must be between 1 and 100."
            )
        return value

    def validate(self, attrs):
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if start_date and end_date and start_date >= end_date:
            raise serializers.ValidationError(
                "End date must be later than start date."
            )

        return attrs
class CategoryCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'description', 'is_active','cat_thumbnail']

class CategorySerializer(serializers.ModelSerializer):
    # Add a computed field for the full image URL
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'is_active', 'cat_thumbnail', 'image_url']
    
    def get_image_url(self, obj):
        if obj.cat_thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cat_thumbnail.url)
            # Fallback for development
            return f"http://127.0.0.1:8000{obj.cat_thumbnail.url}"
        return None
    

class CategoryDetailSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'  # This includes all fields
    
    def get_image_url(self, obj):
        if obj.cat_thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cat_thumbnail.url)
            return f"http://127.0.0.1:8000{obj.cat_thumbnail.url}"
        return None


# -----------------------------------
    # Collection Serializers
# -----------------------------------

class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id','title','slug','description',
                  'is_active','created_at',]
        read_only_fields = ['id', 'slug', 'created_at']



class CollectionCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['title','description','is_active',]



# -----------------------------------
    # Products Serializers
# -----------------------------------

class AdminProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id","name","slug","description","price","inventory",
                  "sku","category","collections","promotion","last_update",]
        
class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"


class ProductListSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    in_stock = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id","name","slug","price","image","in_stock",]

    def get_image(self, obj):
        image = obj.images.filter(is_primary=True).first()
        return image.image.url if image else None

    def get_in_stock(self, obj):
        return obj.inventory > 0
    
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image","alt_text","is_primary",]

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    in_stock = serializers.SerializerMethodField()
    category = serializers.StringRelatedField()
    promotion = serializers.StringRelatedField()

    class Meta:
        model = Product
        fields = ["id","name","slug","description","price","category",
            "promotion","images","in_stock",]

    def get_in_stock(self, obj):
        return obj.inventory > 0
    
class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product

        fields = [
            'name','slug','description','price','inventory',
            'sku','category','collections','promotion']
        


class ProductReviewSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = ProductReview
        fields = [
            'id','product','product_name','user',
            'user_username','rating','title','body',
            'is_approved','created_at',]
        read_only_fields = ['user', 'is_approved', 'created_at']

    def create(self, validated_data):
        # Automatically assign the logged-in user as the reviewer
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)
# -----------------------------------
    # Customers Serializers
# -----------------------------------

class CustomerProfileUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_orders = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CustomerProfile
        fields = [
            'username','user_email','profile_image','wants_newsletter',
            'membership_level','shipping_address','billing_address',
            'phone_number','total_orders','total_spent',]
        read_only_fields = ['username', 'user_email', 'total_orders', 'total_spent', 'membership_level']



class CustomerProfilePublicSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    total_orders = serializers.IntegerField(read_only=True)

    class Meta:
        model = CustomerProfile
        fields = ['username','profile_image','membership_level','total_orders',]
        read_only_fields = ['username', 'profile_image', 'membership_level', 'total_orders']



class CustomerProfileAdminSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    total_orders = serializers.IntegerField(read_only=True)
    total_spent = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CustomerProfile
        fields = ['id','username','user_email','phone_number','email',
            'shipping_address','billing_address','points','membership_level',
            'wants_newsletter','profile_image','created_at','updated_at',
            'total_orders','total_spent',]
        read_only_fields = ['id', 'created_at', 'updated_at', 'username', 'user_email', 'total_orders', 'total_spent']




# -----------------------------------
    # Order & OrderItem Serializers
# -----------------------------------
class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id','customer','customer_username','created_at','updated_at',
            'status','total_amount','shipping_address','payment_status','items',]


# -----------------------------------
    # Cart & CartItem Serializers
# -----------------------------------
class CartItemSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='cart.user.id')  # show user ID

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'quantity', 'added_at']
        
class CartSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')
    items = CartItemSerializer(many=True, source='cart_items', read_only=True)
    total_items = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'user_username', 'created_at', 'updated_at', 
                  'items', 'total_items', 'total_price']