import { IoMail, IoLocationSharp } from 'react-icons/io5'
import { FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa'

const TopBar = () => {
  return (
    <div className="bg-[#131b23] text-white py-2.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-normal">
        {/* Left: Contact Info */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 items-center w-full sm:w-auto">
          <a 
            href="mailto:haryanacanoe@gmail.com" 
            className="hidden sm:flex items-center gap-2.5 hover:text-white/80 transition-all duration-300 group"
          >
            <IoMail size={18} className="group-hover:scale-110 transition-transform" />
            <span className="tracking-tight">haryanacanoe@gmail.com</span>
          </a>
          <div className="flex items-center gap-2.5 group cursor-default text-center sm:text-left justify-center w-full sm:w-auto">
            <IoLocationSharp size={18} className="group-hover:scale-110 transition-transform text-white/90 shrink-0" />
            <span className="tracking-tight text-[12px] sm:text-sm">#1161, Sector 14, Sonepat, Haryana</span>
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="hidden sm:flex gap-5 items-center">
          <a href="#" className="hover:text-red-500 transition-all duration-300 hover:scale-110">
            <FaYoutube size={19} />
          </a>
          <a href="#" className="hover:text-pink-500 transition-all duration-300 hover:scale-110">
            <FaInstagram size={19} />
          </a>
          <a href="#" className="hover:text-[#1877F2] transition-all duration-300 hover:scale-110">
            <FaFacebookF size={18} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
