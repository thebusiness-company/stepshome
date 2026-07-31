import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#1f2a44] text-[#ffffff] pt-16 pb-12 border-t border-[#e1e1e1]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3" aria-label="STEPS Home">
              <Image
                src="/steps_logo.png"
                alt="STEPS Logo"
                width={48}
                height={48}
                className="rounded-full"
                priority
              />
              <span className="font-serif font-bold text-2xl tracking-tight uppercase not-italic text-white">STEPS Home</span>
            </Link>
            <p className="text-[#e5e5e5] text-sm leading-relaxed max-w-sm">
              Finding, fostering, and freeing abandoned girls — one life, one future at a time.
            </p>
          </div>
          
          {/* Column 2: Navigation Links */}
          <div className="md:col-span-3 space-y-5">
            <h3 className="font-serif font-bold uppercase tracking-[1px] text-xs text-brand-primary">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-[#e5e5e5] hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/mission" className="text-[#e5e5e5] hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/girls" className="text-[#e5e5e5] hover:text-white transition-colors">
                  The Girls
                </Link>
              </li> */}
              <li>
                <Link href="/join" className="text-[#e5e5e5] hover:text-white transition-colors">
                  Get Involved
                </Link>
              </li>
              <li>
                <Link href="/donate" className="text-[#e5e5e5] hover:text-white transition-colors">
                  Donate Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="md:col-span-4 space-y-5">
            <h3 className="font-serif font-bold uppercase tracking-[1px] text-xs text-brand-primary">Contact Us</h3>
            <address className="not-italic text-sm">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-[#e5e5e5] leading-relaxed">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-brand-primary" />
                  <span>
                    6, TVS Nagar East, Kandigai st, north,<br />
                    Korattur, Chennai, Tamil Nadu 600076, India
                  </span>
                </li>
                <li className="flex items-center gap-3 text-[#e5e5e5]">
                  <Phone size={18} className="shrink-0 text-brand-primary" />
                  <a href="tel:+919884026250" className="hover:text-white transition-colors">
                    +91 9884026250
                  </a>
                </li>
                <li className="flex items-center gap-3 text-[#e5e5e5]">
                  <Mail size={18} className="shrink-0 text-brand-primary" />
                  <a href="mailto:forstepshome@gmail.com" className="hover:text-white transition-colors">
                    forstepshome@gmail.com
                  </a>
                </li>
              </ul>
            </address>
          </div>

        </div>
        
        {/* Divider & Legal */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#b5b5b5]">
          <div className="max-w-xl text-center md:text-left leading-relaxed">
            <p>
              Steps Home is registered under [REGISTRATION DETAILS — to be provided]. 
              80G certified under the Income Tax Act, 1961.
            </p>
          </div>
          <p className="shrink-0">
            &copy; {new Date().getFullYear()} STEPS Home. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
