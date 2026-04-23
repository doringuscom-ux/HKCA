import React from 'react'
import securityImg from '../../assets/About/Security/image.png'

const SecuritySolutions = () => {
  return (
    <section className="bg-[#131b23] py-24 sm:py-32 px-6 sm:px-10 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Text Col (Left) */}
        <div className="w-full lg:w-3/5 flex flex-col items-start text-left">
          <h2 className="text-white font-heading text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight uppercase mb-10">
            SECURITY SOLUTIONS
          </h2>
          
          <div className="space-y-8 text-gray-300 text-[15px] sm:text-[16px] leading-[1.8] font-normal font-sans">
            <p>
              Founded in the heart of Haryana, HKCA originated with a vision to bring competitive water sports to the forefront of the community's athletic landscape. Our commitment to excellence is reflected in every aspect of our operations, ensuring a safe and secure environment for all athletes and members.
            </p>
            <p>
              Pellentesque gravida iaculis amet, amet dignissim netus ac eget porttitor malesuada quisque habitant mauris, sed vestibulum convallis vel dignissim arcu lectus nunc vulputate vitae adipiscing amet nisl ultrices quam mattis et blandit amet turpis aliquam etiam commodo sit augue nec sociis platea mauris elit tempus adipiscing.
            </p>
            <p>
              We believe that water sports can transform lives and build stronger communities. Our mission is to provide the resources and support necessary to empower every athlete to reach their full potential, while maintaining the highest standards of safety and professionalism.
            </p>
          </div>
        </div>

        {/* Image Col (Right) */}
        <div className="w-full lg:w-2/5 flex items-center justify-center lg:justify-end">
          <div className="relative group">
            {/* Image shadow/glow effect */}
            <div className="absolute -inset-1 bg-white/5 rounded-sm blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <img 
              src={securityImg} 
              alt="Security Personnel" 
              className="relative rounded-sm shadow-2xl h-[65vh] min-h-[400px] w-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

      </div>
    </section>
  )
}

export default SecuritySolutions
