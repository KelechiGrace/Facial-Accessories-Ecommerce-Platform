import React from "react";
import { Mail, Phone, MapPin, X} from "lucide-react";
import { FaPinterest } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: '#6A0DAD', minHeight: '140px' }}>
      <div className="mx-auto px-8 py-10" style={{ maxWidth: '1440px' }}>
        <div className="grid grid-cols-3 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>support@assistmart.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>+234 900 000 1234</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>123 Fashion Avenue, Ikoyi, Lagos, Nigeria.</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:underline transition-all">Shop</a>
              <a href="#" className="hover:underline transition-all">Categories</a>
              <a href="#" className="hover:underline transition-all">About Us</a>
              <a href="#" className="hover:underline transition-all">Privacy Policy</a>
              <a href="#" className="hover:underline transition-all">Terms of Service</a>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl mb-4">Follow Us </h3>
           <div className="flex gap-4">
             <a href="#" className="hover:opacity-80 transition-opacity">
                <FaPinterest size={24} />
            </a>
             <a href="#" className="hover:opacity-80 transition-opacity">
                <FaFacebook size={24} />
            </a>
             <a href="#" className="hover:opacity-80 transition-opacity">
                <FaInstagram size={24} />
            </a>
            <a href="#" className="hover:opacity-80 transition-opacity">
                <X size={24} />
            </a>

           </div>
            <p className="mt-6 text-sm opacity-90">
              &copy; 2026 AssistMart. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
