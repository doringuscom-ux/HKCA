import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WordReveal, HoverScale } from '../common/Animations'

// Import images from assets/Slider
import slide1 from '../../assets/Home/Slider/aleksandar-andreev-ut4DlgxTvgM-unsplash.jpg'
import slide2 from '../../assets/Home/Slider/brooke-willson-0ZBVhFJNneY-unsplash.jpg'
import slide3 from '../../assets/Home/Slider/kaja-sariwating-Pl3rjZ83Of0-unsplash.jpg'
import slide4 from '../../assets/Home/Slider/santiago-segundo-guerrero-vivas-27i2mCKwlSM-unsplash.jpg'

const HeroSlider = () => {
  const images = [slide1, slide2, slide3, slide4]
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-cycle effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black font-sans">
      {/* Background Slides */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            idx === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white/90 text-sm sm:text-base font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Join the Adventure
        </motion.p>
        
        <WordReveal 
          text="EMPOWERING WATER SPORTS EXCELLENCE"
          delay={0.7}
          className="text-white font-heading text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] mb-8 drop-shadow-lg tracking-tight px-2 flex justify-center w-full"
        />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-white/85 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-normal italic tracking-wide"
        >
          Discover the thrill of kayaking and canoeing with HKCA. Join our community <br className="hidden sm:block" />
          dedicated to fostering water sports across Haryana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, type: 'spring' }}
        >
          <HoverScale>
            <button className="bg-[#0084ff] text-white px-9 py-4 rounded-md font-bold text-base uppercase tracking-wider hover:bg-[#0074e0] hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform active:scale-95 group">
              Join Association
            </button>
          </HoverScale>
        </motion.div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-500 rounded-full ${
                idx === currentIndex ? 'w-10 bg-[#0084ff]' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
