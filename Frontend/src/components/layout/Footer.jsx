import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/image.png'
import { FaArrowRight } from 'react-icons/fa'

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    {
      name: 'disciplines',
      href: '#',
      hasDropdown: true,
      subItems: [
        'Canoe Sprint',
        'Canoe Slalom & Kayak Cross',
        'Paracanoe',
        'Dragon Boat',
        'Canoe Marathon',
        'Canoe Polo',
        'Stand Up Paddling',
        'Wildwater Canoeing',
        'Canoe Ocean Racing',
        'Canoe Freestyle'
      ]
    },
    { name: 'events', href: '#' },
    { name: 'gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <footer className="bg-[#131b23] text-white font-sans border-t border-white/5">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-start text-center lg:text-left">

          {/* Column 1: Logo */}
          <div className="lg:col-span-1 flex justify-center lg:justify-start">
            <div className="bg-white p-4 rounded-xl shadow-2xl w-[140px] sm:w-[160px] h-[140px] sm:h-[160px] flex items-center justify-center ring-1 ring-white/10 group hover:scale-105 transition-transform duration-500">
              <img
                src={logo}
                alt="HKCA Logo"
                className="w-full h-auto object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Column 2: Reach Us */}
          <div className="flex flex-col items-center lg:items-start gap-8">
            {/* Registered Office */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl lg:text-2xl font-black tracking-wider uppercase border-b-2 border-blue-600 w-fit pb-1 text-white text-center lg:text-left mx-auto lg:mx-0">
                REGD. OFFICE
              </h3>
              <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-[240px] text-center lg:text-left">
                #1161, Sector 14, <br className="hidden lg:block" />
                Sonepat, Haryana
              </p>
            </div>

            {/* Headquarters */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl lg:text-2xl font-black tracking-wider uppercase border-b-2 border-blue-600 w-fit pb-1 text-white text-center lg:text-left mx-auto lg:mx-0">
                HEAD OFFICE
              </h3>
              <p className="text-gray-400 text-sm md:text-[15px] leading-relaxed max-w-[240px] text-center lg:text-left">
                SCO 19, Sector 11, <br className="hidden lg:block" />
                Panchkula, Haryana 134109
              </p>
            </div>
          </div>

          {/* Column 3: Working Hours */}
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <h3 className="font-heading text-xl lg:text-2xl font-black tracking-wider uppercase border-b-2 border-blue-600 w-fit pb-1 text-white">
              WORKING HOURS
            </h3>
            <div className="space-y-4 text-gray-400 text-sm md:text-[15px]">
              <div>
                <p className="text-blue-400 font-bold uppercase tracking-widest text-[11px] mb-1">Monday – Friday</p>
                <p className="font-medium text-white">09:00 am – 09:00 pm</p>
              </div>
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[11px] mb-1">Saturday – Sunday</p>
                <p className="font-bold text-red-500/80">Closed</p>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Links */}
          <div className="hidden sm:flex flex-col items-center lg:items-start space-y-6">
            <h3 className="font-heading text-xl lg:text-2xl font-black tracking-wider uppercase border-b-2 border-blue-600 w-fit pb-1 text-white">
              QUICK LINKS
            </h3>
            <ul className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-3 w-full max-w-[280px] lg:max-w-none">
              {quickLinks.map((link, idx) => (
                <li key={idx} className="relative group">
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-blue-500 transition-all duration-300 text-sm md:text-[15px] flex items-center justify-center lg:justify-start gap-2 capitalize font-medium group-hover:translate-x-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600/40 group-hover:bg-blue-500 transition-colors" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="flex flex-col items-center lg:items-start space-y-6">
            <h3 className="font-heading text-xl lg:text-2xl font-black tracking-wider uppercase border-b-2 border-blue-600 w-fit pb-1 text-white">
              NEWSLETTER
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">
              Stay up to date with our latest news and upcoming events in Haryana.
            </p>
            <div className="w-full max-w-[300px] lg:max-w-none pt-2 space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  className="w-full bg-transparent border-b border-gray-800 py-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors duration-300 placeholder:text-gray-500 text-center lg:text-left"
                />
              </div>
              <button className="flex items-center justify-center lg:justify-start gap-4 text-[12px] font-black tracking-[0.25em] uppercase text-white hover:text-blue-500 transition-all duration-300 group w-full lg:w-auto">
                SUBSCRIBE
                <FaArrowRight className="text-blue-600 group-hover:translate-x-2 transition-transform duration-300" size={14} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Sub Footer Bar */}
      <div className="bg-[#0b1118] py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left text-[11px] md:text-[12px] tracking-[0.2em] text-gray-500 uppercase font-black">
            © {new Date().getFullYear()} ALL RIGHTS RESERVED. <br className="sm:hidden" />
            Powered By <Link to="https://www.digitalorra.com" target="_blank" className="text-blue-600 cursor-pointer hover:text-blue-400 transition-colors">Digital ORRA</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] tracking-wider text-gray-500 uppercase font-bold">
            <a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <span className="hidden sm:inline opacity-50">|</span>
            <a href="/terms-conditions" className="hover:text-blue-400 transition-colors">Terms & Conditions</a>
            <span className="hidden sm:inline opacity-50">|</span>
            <a href="/refund-policy" className="hover:text-blue-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
