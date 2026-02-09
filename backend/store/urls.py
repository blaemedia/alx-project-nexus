from django.conf import settings

from django.conf.urls import static
from django.urls import path,include
from .views import (storefront,ProductViewSet,ProductImageViewSet,
                    CustomerProfileAdminViewSet,CustomerProfileUserViewSet,
                    CustomerProfilePublicViewSet,OrderViewSet, OrderItemViewSet, 
                    CartViewSet, CartItemViewSet,ProductReviewViewSet,
                    CategoryViewSet,CollectionViewSet,PromotionViewSet)

from rest_framework_nested import routers
from rest_framework.schemas import get_schema_view
from rest_framework.documentation import include_docs_urls
from rest_framework import permissions

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view




router = routers.DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("product-images", ProductImageViewSet, basename="product-image")
router.register(r'product-reviews', ProductReviewViewSet, basename='productreview')

router.register(r'admin/profiles', CustomerProfileAdminViewSet, basename='admin-profiles')
router.register(r'me/profile', CustomerProfileUserViewSet, basename='user-profile')
router.register(r'profiles', CustomerProfilePublicViewSet, basename='public-profiles')


router.register(r'orders', OrderViewSet, basename='order')
router.register(r'order-items', OrderItemViewSet, basename='orderitem')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'collections', CollectionViewSet, basename='collection')
router.register(r'promotions', PromotionViewSet, basename='promotion')

products_router = routers.NestedDefaultRouter(router, "products", lookup="product")
products_router.register(
    "images",ProductImageViewSet,basename="product-images")


urlpatterns = router.urls + products_router.urls


schema=swagger_get_schema_view(
    openapi.Info(
        title="BlaeMart Store API",
        description="API for BlaeMart Store",
        default_version='v1', 
        version = "version 1.0",
    ), 
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("", include(router.urls)),
    path("", include(products_router.urls)),
    path ("schema",get_schema_view(
        title="Ecommerce API",
        description="API for BlaeMart Store",
        version = "version 1.0",
        
    ),name = 'BlaeMart Store API'),

    path('apidoc/',schema.with_ui('swagger',cache_timeout=0),
         name="swagger-schema"),
]


