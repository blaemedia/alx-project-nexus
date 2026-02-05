// components/Footer/ResponsiveFooter.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  companyName?: string;
  tagline?: string;
  sections?: FooterSection[];
  showNewsletter?: boolean;
  showSocial?: boolean;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "Blae|Mart",
  tagline = "Your trusted shopping destination",
  sections = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "Categories", href: "/categories" },
        { name: "New Arrivals", href: "/new" },
        { name: "Best Sellers", href: "/bestsellers" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Press", href: "/press" },
      ]
    }
  ],
  showNewsletter = true,
  showSocial = true
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">


        {/* Newsletter Section */}
        {showNewsletter && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-semibold mb-4">Stay in the loop</h3>
              <p className="text-gray-400 mb-6">
                Subscribe to receive product updates and special offers.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
                />
                <button
                  type="submit"
                  className="bg-[#FF383C] hover:bg-gray-400 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-3">{companyName}</h2>
            <p className="text-gray-400 mb-6">{tagline}</p>
            
            {showSocial && (
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="bg-gray-800 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              <p>© {currentYear} {companyName}. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;