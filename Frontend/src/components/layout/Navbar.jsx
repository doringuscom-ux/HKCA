import logo from '../../assets/image.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { IoChevronDown } from 'react-icons/io5'
import { FaArrowRight, FaUserCircle } from 'react-icons/fa'
import { RiMenu3Line, RiCloseLine, RiLogoutBoxLine, RiDashboardLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { HoverScale } from '../common/Animations'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Disciplines',
      href: '/disciplines',
      hasDropdown: true,
      subItems: [
        'Canoe Sprint',
        'Canoe Slalom & Kayak Cross',
        'Paracanoe',
        'Dragon Boat',
        'Canoe Marathon',
        'Canoe Polo',
        'Stand Up Paddling',
        'Wildwater Canoeing'
      ]
    },
    { name: 'Events', href: '/events' },
    { name: 'Results', href: '/results' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Verification', href: '/document-verify' },
    { name: 'Contact', href: '/contact' },
  ]

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-h-[60px] lg:min-h-[80px] px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link to="/" className="shrink-0 flex items-center group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
          <img
            src={logo}
            alt="H.K.C.A. Logo"
            className="h-[50px] lg:h-[85px] w-auto group-hover:scale-105 transition-all duration-500 mix-blend-multiply"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                to={link.href}
                className="flex items-center gap-1.5 text-[#1a2128] hover:text-[#0084ff] font-semibold text-[14px] xl:text-[15px] tracking-wide transition-all duration-300 py-3 relative"
              >
                {link.name}
                {link.hasDropdown && (
                  <IoChevronDown
                    className="mt-0.5 text-gray-400 group-hover:text-[#0084ff] group-hover:rotate-180 transition-transform duration-300"
                    size={14}
                  />
                )}
                {/* Underline Hover Effect */}
                <motion.div
                  className="absolute bottom-6 left-0 right-0 h-0.5 bg-[#0084ff] origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>

              {/* Enhanced Dropdown Menu */}
              {link.hasDropdown && (
                <div className="absolute top-full left-0 bg-white shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)] rounded-b-lg min-w-[280px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-t-2 border-[#0084ff] transform translate-y-4 group-hover:translate-y-0 text-left overflow-hidden">
                  <div className="flex flex-col py-2">
                    {link.subItems.map((sub, idx) => (
                      <Link
                        key={idx}
                        to={`/disciplines/${sub.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                        className="px-8 py-3.5 text-[14px] text-gray-600 hover:bg-blue-50/50 hover:text-[#0084ff] font-medium transition-all duration-200 border-b border-gray-50 last:border-0 block"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-3 xl:gap-4">
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-[#1a2128] hover:text-[#0084ff] font-bold text-[14px] uppercase tracking-wider transition-colors"
                >
                  Login
                </Link>
                <HoverScale>
                  <Link
                    to="/register"
                    className="bg-[#0084ff] text-white px-6 py-2.5 rounded-md flex items-center gap-2 font-bold text-[14px] uppercase tracking-wide hover:bg-[#0074e0] transition-all"
                  >
                    Register
                    <FaArrowRight size={12} />
                  </Link>
                </HoverScale>
              </>
            ) : (
              <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-[#1a2128]"
                >
                  {user.documents?.photograph ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-[#0084ff]/30">
                      <img src={user.documents.photograph} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <FaUserCircle size={20} className="text-[#0084ff]" />
                  )}
                  <span className="font-bold text-[13px] uppercase tracking-wider">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <RiLogoutBoxLine size={22} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 bg-gray-50 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 top-[60px] bg-white z-40 shadow-2xl"
          >
            <div className="flex flex-col h-full overflow-y-auto px-6 py-8 pb-32 space-y-1">

              {/* User Section on Mobile */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 p-6 bg-blue-50 rounded-4xl border border-blue-100 flex items-center gap-4"
                >
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#1a2128] overflow-hidden shadow-sm border border-blue-100">
                    {user.documents?.photograph ? (
                      <img src={user.documents.photograph} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <FaUserCircle size={32} className="text-[#1a2128]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">Welcome back</p>
                    <p className="font-black text-slate-900 leading-tight truncate">{user.username}</p>
                  </div>
                </motion.div>
              )}

              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                  className="border-b border-gray-50 last:border-0"
                >
                  {link.hasDropdown ? (
                    <div className="flex flex-col">
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="flex items-center justify-between py-5 text-[#1a2128] font-bold text-lg hover:text-blue-600 transition-colors"
                      >
                        {link.name}
                        <IoChevronDown className={`transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} size={18} />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-gray-50/50 rounded-2xl mb-4 py-2"
                          >
                            {link.subItems.map((sub, idx) => (
                              <Link
                                key={idx}
                                to={`/disciplines/${sub.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-6 py-3.5 text-[15px] text-gray-600 font-medium hover:text-blue-600 block"
                              >
                                {sub}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-5 text-[#1a2128] font-bold text-lg hover:text-blue-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}

              <div className="pt-10 flex flex-col gap-4">
                {!user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-[#0084ff] text-white py-5 rounded-4xl flex items-center justify-center gap-3 font-black text-base uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20"
                      >
                        Become a Member
                        <FaArrowRight size={16} />
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-slate-100 text-slate-800 py-5 rounded-4xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em]"
                      >
                        Login Account
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-white border-2 border-blue-600 text-blue-600 py-4.5 rounded-4xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em]"
                      >
                        <RiDashboardLine size={20} /> My Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full bg-red-50 text-red-500 py-4.5 rounded-4xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em]"
                      >
                        <RiLogoutBoxLine size={20} /> Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
