// components/Footer/SimpleFooter.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Blae|Mart</h2>
            <p className="text-gray-400">Quality products at your doorstep</p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/categories" className="hover:text-white">All Categories</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-white">New Arrivals</Link></li>
              <li><Link href="/best-sellers" className="hover:text-white">Best Sellers</Link></li>
              <li><Link href="/sale" className="hover:text-white">On Sale</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <p className="text-gray-400 mb-4">Follow us on social media</p>
            <div className="flex space-x-4">
              {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Blae|Mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}