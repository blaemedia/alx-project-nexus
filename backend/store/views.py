from django.shortcuts import render
from django.http import HttpResponse

from rest_framework import viewsets, permissions
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import (IsAdminUser, AllowAny,
IsAuthenticatedOrReadOnly)

from backend.store.models import (Product,ProductImage,CustomerProfile,Order,
    OrderItem, Cart, CartItem,ProductReview,Category,Collection,
    Promotion)

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework import filters




from .serializers import (
    ProductListSerializer,ProductDetailSerializer,
    ProductImageSerializer,ProductReviewSerializer,
    AdminProductSerializer, AdminProductImageSerializer,
    CustomerProfileAdminSerializer,CustomerProfileUserSerializer,
    CustomerProfilePublicSerializer,
    OrderSerializer, OrderItemSerializer, 
    CartSerializer, CartItemSerializer,

    CategoryCreateUpdateSerializer,
    CategoryDetailSerializer,
    CategorySerializer,
    
    CollectionSerializer,
    CollectionCreateUpdateSerializer,
    PromotionSerializer
    
)



class CollectionViewSet(ModelViewSet):
    queryset = Collection.objects.filter(is_active=True)
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CollectionCreateUpdateSerializer
        return CollectionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
    

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CategoryCreateUpdateSerializer
        return CategorySerializer  # Change from CategoryDetailSerializer to CategorySerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context





class PromotionViewSet(ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]
    


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.select_related(
        "category", "promotion"
    ).prefetch_related(
        "images", "collections"
    )

    # 🔥 ENABLE SEARCH
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "description",
        "category__name",
        "sku",
    ]

    def get_serializer_class(self):
        # Public endpoints
        if self.action == "list":
            return ProductListSerializer

        if self.action == "retrieve":
            return ProductDetailSerializer

        # Admin endpoints
        if self.request.user.is_staff:
            return AdminProductSerializer

        return ProductDetailSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [AllowAny()]



class ProductImageViewSet(ModelViewSet):
    queryset = ProductImage.objects.select_related("product")
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method in ["POST", "PUT", "PATCH"]:
            return AdminProductImageSerializer
        return ProductImageSerializer


def storefront(request):
    return HttpResponse("welcome")




# -----------------------------------
    # Customer Profile ViewSets
# -----------------------------------

class CustomerProfileAdminViewSet(ModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfileAdminSerializer
    permission_classes = [IsAdminUser]  # only admin/staff




class CustomerProfilePublicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CustomerProfile.objects.all()
    serializer_class = CustomerProfilePublicSerializer
    permission_classes = [AllowAny]  # public access



class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class CustomerProfileUserViewSet(ModelViewSet):
    serializer_class = CustomerProfileUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return CustomerProfile.objects.filter(user=self.request.user)






# -----------------------
# Order ViewSet
# -----------------------
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see only their orders unless admin
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=user)


# -----------------------
# Order & OrderItem ViewSet
# -----------------------
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users see only their orders unless admin
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(customer=user)
    


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]

# -----------------------
# Cart ViewSet
# -----------------------
class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Cart.objects.filter(user=user)

# -----------------------
# CartItem ViewSet
# -----------------------
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Fix Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return Cart.objects.none()
        
        user = self.request.user
        
        # Admin users see all carts
        if user.is_staff:
            return Cart.objects.all()
        
        # Regular users only see their own cart
        return Cart.objects.filter(user=user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Fix Swagger schema generation
        if getattr(self, 'swagger_fake_view', False):
            return CartItem.objects.none()
        
        user = self.request.user
        
        # Admin users see all cart items
        if user.is_staff:
            return CartItem.objects.all()
        
        # Regular users only see items in their own cart
        return CartItem.objects.filter(cart__user=user)
    

class ProductReviewViewSet(viewsets.ModelViewSet):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        - Admin sees all reviews
        - Regular users see only their own reviews
        - Optionally, filter by product if query param `?product_id=1` is provided
        """
        user = self.request.user
        queryset = ProductReview.objects.all()

        if not user.is_staff:
            queryset = queryset.filter(user=user)

        product_id = self.request.query_params.get('product_id')
        if product_id:
            queryset = queryset.filter(product_id=product_id)

        return queryset