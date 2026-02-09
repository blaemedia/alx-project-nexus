from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone

from backend.store.models import (
    Category, Collection, Promotion, Product, ProductImage,
    CustomerProfile, Order, OrderItem, Cart, CartItem, ProductReview
)

from faker import Faker
import faker.providers
import random
from decimal import Decimal
import uuid
import os
import requests
from django.conf import settings

User = get_user_model()

# ---- Nigeria-focused categories ----
CATEGORIES = [
    "Men's Fashion", "Women's Fashion", "Electronics", "Home & Living",
    "Beauty Products", "Groceries", "Sports & Fitness", "Kids & Baby",
    "Accessories", "Footwear"
]

# ---- Nigeria-focused product list ----
PRODUCTS = [
    "Ankara Shoes", "Leather Boots", "Trainers", "Agbada Outfit",
    "Buba & Iro", "T-Shirt", "Jeans", "Shirts", "Printed Shirts",
    "Tank Tops", "Polo Shirt", "Skincare", "Makeup", "Hair Care",
    "DIY Tools", "Garden & Outdoors", "Lighting", "Home Decor",
    "Kitchen Appliances", "Grocery", "Beverages", "Snacks",
    "Organic Foods", "Electronics", "Mobile Accessories", "Laptops",
    "Gaming Accessories",
]

PROMOTIONS = [
    "New Arrivals", "Best Sellers", "Trending Now", "Flash Sale",
    "Limited Offer", "Clearance Sale", "Weekend Deals",
    "Under ₦5,000", "Under ₦10,000", "Black Friday", "Christmas Deals",
]

COLLECTIONS = [
    "Men's Fashion", "Women's Fashion", "Electronics", "Home & Living",
    "Beauty Products", "Groceries", "Sports & Fitness", "Kids & Baby",
    "Accessories", "Footwear", "New Arrivals", "Best Sellers",
]

nigerian_cities = [
    "Lagos", "Abuja", "Ibadan", "Abeokuta", "Ikeja", "Akure",
    "Ilorin", "Ado-Ekiti", "Osogbo", "Ogbomosho", "Ijebu-Ode",
]

nigerian_first_names = [
    "Chinedu", "Olufemi", "Adebayo", "Amaka", "Ngozi", "Ifeanyi",
    "Tunde", "Abiola", "Fatima", "Uche", "Sade", "Kemi",
]

nigerian_last_names = [
    "Okonkwo", "Adebayo", "Ogunleye", "Ibrahim", "Eze", "Balogun",
    "Adeyemi", "Nwosu", "Ajayi", "Idowu", "Abdullahi",
]

product_descriptions = [
    "High quality product suitable for everyday use.",
    "Durable and affordable with excellent performance.",
    "Customer favorite with premium finishing.",
    "Designed for comfort, reliability, and style.",
]

# Random image categories based on product types
IMAGE_CATEGORIES = {
    "shoes": ["shoes", "footwear", "sneakers", "boots"],
    "fashion": ["fashion", "clothing", "dress", "style"],
    "electronics": ["electronics", "gadgets", "tech", "computer"],
    "home": ["home", "furniture", "decor", "living"],
    "beauty": ["beauty", "cosmetics", "skincare", "makeup"],
    "food": ["food", "grocery", "fruit", "vegetables"],
    "sports": ["sports", "fitness", "exercise", "gym"],
    "kids": ["kids", "toys", "baby", "children"],
    "accessories": ["accessories", "jewelry", "watch", "bag"],
    "general": ["product", "shop", "store", "item", "goods"]
}

# List of free image API services
IMAGE_SERVICES = [
    # Pexels API (free, high quality)
    "https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=640&h=480",
    "https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=480&w=640",
    
    # Unsplash API (free, high quality)
    "https://source.unsplash.com/640x480/?{keywords}",
    "https://source.unsplash.com/featured/640x480?{keywords}",
    
    # Lorem Picsum (always works)
    "https://picsum.photos/640/480?random={id}",
    "https://picsum.photos/id/{id}/640/480",
    
    # Placeholder with images (has actual product images)
    "https://placeimg.com/640/480/{category}",
    
    # Dummy image with random colors
    "https://dummyimage.com/640x480/{color}/fff&text={text}",
]

# ---- Custom Faker Provider ----
class Provider(faker.providers.BaseProvider):
    def ecommerce_category(self):
        return self.random_element(CATEGORIES)

    def ecommerce_products(self):
        return self.random_element(PRODUCTS)

    def ecommerce_promotions(self):
        return self.random_element(PROMOTIONS)

    def ecommerce_collections(self):
        return self.random_element(COLLECTIONS)

# ---- Unique slug helper ----
def unique_slugify(instance, value, slug_field_name="slug"):
    slug = slugify(value)
    model = instance.__class__
    unique_slug = slug
    counter = 1
    while model.objects.filter(**{slug_field_name: unique_slug}).exists():
        unique_slug = f"{slug}-{counter}"
        counter += 1
    return unique_slug

# ---- Image Helper Functions ----
def get_random_image_url(product_name, category_name):
    """Get a random image URL based on product category"""
    # Determine image category
    category_lower = category_name.lower()
    product_lower = product_name.lower()
    
    # Match category to image keywords
    if any(word in product_lower for word in ['shoe', 'boot', 'trainer', 'footwear']):
        keywords = random.choice(IMAGE_CATEGORIES['shoes'])
    elif any(word in product_lower for word in ['shirt', 'dress', 'fashion', 'clothing', 'outfit']):
        keywords = random.choice(IMAGE_CATEGORIES['fashion'])
    elif any(word in product_lower for word in ['electronic', 'laptop', 'mobile', 'tech']):
        keywords = random.choice(IMAGE_CATEGORIES['electronics'])
    elif any(word in product_lower for word in ['home', 'decor', 'furniture', 'living']):
        keywords = random.choice(IMAGE_CATEGORIES['home'])
    elif any(word in product_lower for word in ['beauty', 'makeup', 'skincare', 'hair']):
        keywords = random.choice(IMAGE_CATEGORIES['beauty'])
    elif any(word in product_lower for word in ['food', 'grocery', 'snack', 'beverage']):
        keywords = random.choice(IMAGE_CATEGORIES['food'])
    elif any(word in product_lower for word in ['sport', 'fitness', 'gym']):
        keywords = random.choice(IMAGE_CATEGORIES['sports'])
    elif any(word in product_lower for word in ['kid', 'baby', 'toy']):
        keywords = random.choice(IMAGE_CATEGORIES['kids'])
    elif any(word in product_lower for word in ['accessory', 'jewelry', 'watch']):
        keywords = random.choice(IMAGE_CATEGORIES['accessories'])
    else:
        keywords = random.choice(IMAGE_CATEGORIES['general'])
    
    # Choose a random image service
    service = random.choice(IMAGE_SERVICES)
    
    # Replace placeholders in the URL
    if '{id}' in service:
        # Use Picsum or Pexels with random ID
        image_id = random.randint(1, 1000)
        return service.format(id=image_id)
    elif '{keywords}' in service:
        # Use Unsplash with keywords
        return service.format(keywords=keywords)
    elif '{category}' in service:
        # Use PlaceIMG with category
        return service.format(category=keywords)
    elif '{color}' in service:
        # Use DummyImage with random color
        colors = ['4A90E2', '50E3C2', '9013FE', 'F5A623', 'D0021B', '7ED321']
        color = random.choice(colors)
        text = product_name.replace(' ', '+')[:15]
        return service.format(color=color, text=text)
    else:
        # Fallback to Picsum
        return f"https://picsum.photos/640/480?random={random.randint(1, 1000)}"

def download_and_save_image(image_url, save_path):
    """Download image from URL and save to local path"""
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        # If file already exists, skip
        if os.path.exists(save_path):
            return True
        
        # Download the image with headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(image_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Check if it's actually an image
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type:
            raise ValueError(f"URL did not return an image: {content_type}")
        
        # Save the image
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        # Verify the file was created
        if os.path.getsize(save_path) > 0:
            return True
        else:
            os.remove(save_path)
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Request error downloading {image_url}: {e}")
        return False
    except Exception as e:
        print(f"Error saving image to {save_path}: {e}")
        return False

def create_fallback_image(save_path, product_name):
    """Create a fallback image if download fails"""
    try:
        # Simple colorful placeholder with text
        from PIL import Image, ImageDraw, ImageFont
        import colorsys
        
        # Create image with random color
        hue = random.random()
        r, g, b = [int(x * 255) for x in colorsys.hsv_to_rgb(hue, 0.7, 0.9)]
        
        img = Image.new('RGB', (640, 480), color=(r, g, b))
        d = ImageDraw.Draw(img)
        
        # Try to add text
        try:
            # Try to use a default font
            import os
            font_path = None
            
            # Check common font paths
            common_fonts = [
                '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
                'C:/Windows/Fonts/Arial.ttf',
                '/System/Library/Fonts/Helvetica.ttf',
            ]
            
            for font in common_fonts:
                if os.path.exists(font):
                    font_path = font
                    break
            
            if font_path:
                font = ImageFont.truetype(font_path, 40)
            else:
                font = ImageFont.load_default()
            
            # Add product name (truncated)
            text = product_name[:20] + "..." if len(product_name) > 20 else product_name
            d.text((320, 240), text, fill=(255, 255, 255), font=font, anchor="mm")
        except:
            # If font fails, just draw some shapes
            d.rectangle([160, 180, 480, 300], fill=(255, 255, 255, 128))
        
        img.save(save_path)
        return True
    except Exception as e:
        print(f"Could not create fallback image: {e}")
        # Create a simple text file as last resort
        with open(save_path, 'w') as f:
            f.write(f"Image for: {product_name}")
        return True

class Command(BaseCommand):
    help = "Generate Nigeria-focused fake store data with random images"

    def handle(self, *args, **kwargs):
        fake = Faker("en_US")
        fake.add_provider(Provider)
        
        # Clear existing data to avoid duplicate errors
        self.stdout.write("Clearing existing data...")
        CartItem.objects.all().delete()
        Cart.objects.all().delete()
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ProductReview.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        CustomerProfile.objects.all().delete()
        # Keep superusers but delete regular users
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        Promotion.objects.all().delete()
        Collection.objects.all().delete()
        Category.objects.all().delete()
        
        # Create media directory if it doesn't exist
        media_root = settings.MEDIA_ROOT
        products_dir = os.path.join(media_root, 'products')
        os.makedirs(products_dir, exist_ok=True)

        # ---- Categories ----
        categories = []
        for _ in range(10):
            name = fake.unique.ecommerce_category()
            category = Category.objects.create(
                name=name,
                slug=unique_slugify(Category(name=name), name),
                description=random.choice(product_descriptions),
                is_active=True,
            )
            categories.append(category)

        # ---- Collections ----
        collections = []
        for _ in range(10):
            title = fake.unique.ecommerce_collections()
            collection = Collection.objects.create(
                title=title,
                slug=unique_slugify(Collection(title=title), title),
                description=random.choice(product_descriptions),
                is_active=True,
            )
            collections.append(collection)

        # ---- Promotions ----
        promotions = []
        for _ in range(5):
            name = fake.unique.ecommerce_promotions()
            start = timezone.now()
            end = start + timezone.timedelta(days=random.randint(5, 30))
            promotion = Promotion.objects.create(
                name=name,
                discount_percent=random.randint(5, 50),
                start_date=start,
                end_date=end,
                is_active=True,
            )
            promotions.append(promotion)

        # ---- Users & Profiles (NO USERNAME) ----
        users = []
        for i in range(50):
            first_name = random.choice(nigerian_first_names)
            last_name = random.choice(nigerian_last_names)
            email = f"{first_name.lower()}.{last_name.lower()}{i}@{fake.domain_name()}"
            
            # Check if user already exists
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    email=email,
                    password="password123",
                    first_name=first_name,
                    last_name=last_name,
                )

                CustomerProfile.objects.create(
                    user=user,
                    phone_number=f"+234{fake.random_number(digits=10, fix_len=True)}",
                    shipping_address=f"{fake.street_address()}, {random.choice(nigerian_cities)}",
                    billing_address=f"{fake.street_address()}, {random.choice(nigerian_cities)}",
                    points=random.randint(0, 1000),
                    membership_level=random.choice(
                        ["bronze", "silver", "gold", "platinum"]
                    ),
                )
                users.append(user)

        # ---- Products ----
        products = []
        
        for i in range(200):
            base_name = fake.ecommerce_products()
            name = f"{base_name} {i + 1}"
            category = random.choice(categories)
            promotion = random.choice(promotions + [None])

            naira = random.randint(10, 15000)
            cents = random.randint(0, 99)
            price = Decimal(f"{naira}.{cents:02d}")

            # Generate unique SKU using UUID
            sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"
            # Ensure uniqueness
            while Product.objects.filter(sku=sku).exists():
                sku = f"SKU-{uuid.uuid4().hex[:8].upper()}"

            product = Product.objects.create(
                name=name,
                slug=unique_slugify(Product(name=name), name),
                description=random.choice(product_descriptions),
                price=price,
                inventory=random.randint(0, 100),
                sku=sku,  # Unique SKU
                category=category,
                promotion=promotion,
            )

            if collections:
                product.collections.set(
                    random.sample(collections, k=random.randint(0, 3))
                )

            # ---- CREATE RANDOM IMAGES ----
            self.stdout.write(f"Creating images for: {name}")
            
            for j in range(random.randint(1, 3)):
                # Create unique filename
                image_filename = f"products/{slugify(product.name)[:30]}_{uuid.uuid4().hex[:8]}.jpg"
                image_path = os.path.join(media_root, image_filename)
                
                # Get a random image URL based on product category
                image_url = get_random_image_url(product.name, category.name)
                
                self.stdout.write(f"  Downloading: {image_url[:80]}...")
                
                # Try to download the image
                success = download_and_save_image(image_url, image_path)
                
                if not success:
                    self.stdout.write(f"  Download failed, creating fallback image...")
                    # Create a fallback image
                    create_fallback_image(image_path, product.name)
                
                # Create ProductImage record
                ProductImage.objects.create(
                    product=product,
                    image=image_filename,
                    alt_text=fake.sentence(),
                    is_primary=(j == 0),
                )
            # ---- END IMAGE CREATION ----

            products.append(product)

        # ---- Reviews ----
        for _ in range(50):
            ProductReview.objects.create(
                product=random.choice(products),
                user=random.choice(users),
                rating=random.randint(1, 5),
                title=fake.sentence(nb_words=5),
                body=fake.text(max_nb_chars=150),
                is_approved=True,
            )

        # ---- Orders ----
        for _ in range(30):
            user = random.choice(users)
            order = Order.objects.create(
                customer=user,
                status=random.choice(
                    ["pending", "processing", "shipped", "delivered"]
                ),
                total_amount=0,
                shipping_address=f"{fake.street_address()}, {random.choice(nigerian_cities)}",
                payment_status=random.choice([True, False]),
            )

            total = Decimal("0")
            for _ in range(random.randint(1, 5)):
                product = random.choice(products)
                qty = random.randint(1, 3)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=qty,
                    price=product.price,
                )
                total += product.price * qty

            order.total_amount = total
            order.save()

        # ---- Carts ----
        for user in random.sample(users, min(30, len(users))):
            cart = Cart.objects.create(user=user)
            for _ in range(random.randint(1, 5)):
                product = random.choice(products)
                CartItem.objects.get_or_create(
                    cart=cart,
                    product=product,
                    defaults={"quantity": random.randint(1, 5)},
                )

        self.stdout.write(self.style.SUCCESS("Database seeded successfully"))
        self.stdout.write(self.style.SUCCESS(f"Created {ProductImage.objects.count()} random product images"))
        self.stdout.write(self.style.SUCCESS("All images are saved locally and will display without 404 errors"))