import React, { useState } from 'react'
import { ScrollReveal, WordReveal } from '../common/Animations'
import ikcaLogo from '../../assets/Home/our partner/Untitled design.png'
import hoaLogo from '../../assets/Home/our partner/Untitled design1.png'
import boatGif from '../../assets/cruise-transparent.gif'

const PartnerCard = ({ item }) => {
  const [active, setActive] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 35 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={handleMove}
      onClick={() => setActive((prev) => !prev)}
      style={{
        width: "100%",
        minHeight: "400px",
        position: "relative",
        overflow: "hidden",
        borderRadius: "34px",
        cursor: "pointer",
        padding: "1px",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(201,152,44,0.42), rgba(47,126,255,0.28), rgba(255,255,255,0.08))",
        boxShadow: active
          ? "0 34px 85px rgba(0,0,0,0.48)"
          : "0 22px 60px rgba(0,0,0,0.32)",
        transform: active ? "translateY(-7px)" : "translateY(0)",
        transition: "all 0.45s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: "400px",
          height: "100%",
          borderRadius: "33px",
          overflow: "hidden",
          background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.13), transparent 25%), linear-gradient(145deg, #111f31, #0d1929 58%, #081321)`,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "30px 24px",
        }}
      >
        {/* premium diagonal layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(108deg, transparent 0%, transparent 30%, rgba(255,255,255,0.045) 30%, rgba(255,255,255,0.045) 50%, transparent 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* golden background glow */}
        <div
          style={{
            position: "absolute",
            top: "28px",
            left: "50%",
            width: "170px",
            height: "170px",
            borderRadius: "50%",
            transform: "translateX(-50%)",
            background: "rgba(201,152,44,0.18)",
            filter: "blur(34px)",
            animation: "goldPulse 4.5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* moving fine line */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "82%",
            width: "100%",
            height: "1px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(to right, transparent, rgba(201,152,44,0.75), transparent)",
              animation: "lineMove 4.5s linear infinite",
            }}
          />
        </div>

        {/* moving boat */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "82%",
            width: "100%",
            height: "70px",
            marginTop: "-68px",
            pointerEvents: "none",
            opacity: active ? 0 : 1,
            transition: "opacity 0.4s",
            animation: "lineMove 6s linear infinite",
            zIndex: 10,
          }}
        >
          <img
            src={boatGif}
            alt="boat"
            style={{
              height: "100%",
              width: "auto",
            }}
          />
        </div>

        {/* content container */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "270px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: active ? "flex-start" : "center",
            transform: active ? "translateY(-12px)" : "translateY(0)",
            transition: "all 0.45s ease",
          }}
        >
          {/* logo orbit */}
          <div
            style={{
              width: "112px",
              height: "112px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "18px",
              animation: "logoFloat 4s ease-in-out infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                border: "1px solid rgba(201,152,44,0.28)",
              }}
            />

            <div
              style={{
                position: "absolute",
                width: "122px",
                height: "122px",
                borderRadius: "50%",
                border: "1.5px dashed rgba(201,152,44,0.35)",
                animation: "orbitSpin 14s linear infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "8px",
                right: "14px",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#c9982c",
                boxShadow: "0 0 18px rgba(201,152,44,0.9)",
                animation: "orbitSpin 7s linear infinite",
                transformOrigin: "-42px 46px",
              }}
            />

            <img
              src={item.logo}
              alt={item.title}
              style={{
                width: "75px",
                height: "75px",
                objectFit: "contain",
                position: "relative",
                zIndex: 2,
                filter: active
                  ? "drop-shadow(0 10px 20px rgba(201,152,44,0.34))"
                  : "drop-shadow(0 6px 14px rgba(0,0,0,0.25))",
                transform: active ? "scale(1.04)" : "scale(1)",
                transition: "all 0.4s ease",
              }}
            />
          </div>

          <h3 
            className="text-white font-heading font-bold text-xl md:text-2xl tracking-wide mb-2 leading-tight uppercase"
            style={{
              textAlign: "center",
            }}
          >
            {item.title}
          </h3>

          <div className="flex flex-col items-center space-y-1 mb-6">
            <span 
              className="text-[#2f7eff] font-['Inter'] font-black text-sm md:text-base tracking-[0.2em] uppercase drop-shadow-md"
              style={{ animation: "badgeBreath 3s ease-in-out infinite" }}
            >
              {item.designation}
            </span>
            <span className="text-white/60 font-['Inter'] font-medium text-xs tracking-widest uppercase">
              {item.location}
            </span>
          </div>
        </div>

        {/* bottom info dock */}
        <div
          style={{
            position: "absolute",
            left: "18px",
            right: "18px",
            bottom: "18px",
            zIndex: 5,
            borderRadius: "24px",
            padding: active ? "22px 18px" : "13px 18px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.055))",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: active
              ? "0 18px 45px rgba(0,0,0,0.32)"
              : "0 10px 28px rgba(0,0,0,0.18)",
            transform: active ? "translateY(0)" : "translateY(65px)", 
            transition: "all 0.55s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-white/30 font-heading italic text-sm md:text-base lowercase tracking-widest text-center">
              {item.affiliationText}
            </span>

            <h4 className="text-white font-heading font-semibold text-base md:text-lg tracking-wide uppercase text-center">
              {item.affiliateName}
            </h4>
          </div>
        </div>

        {/* hint */}
        <div 
          className="font-['Inter'] text-[10px] font-bold tracking-[0.2em] uppercase text-center"
          style={{
            position: "absolute",
            bottom: active ? "-20px" : "18px",
            left: 0,
            right: 0,
            color: "rgba(201,152,44,0.75)",
            opacity: active ? 0 : 1,
            transition: "all 0.35s ease",
          }}
        >
          Hover / Tap for Affiliation
        </div>
      </div>
    </div>
  );
};

const Partners = () => {
  const affiliations = [
    {
      logo: ikcaLogo,
      title: "INDIAN KAYAKING & CANOEING ASSOCIATION",
      designation: "( National Governing Body )",
      location: "India",
      affiliationText: "affiliated with",
      affiliateName: "International Canoe Federation"
    },
    {
      logo: hoaLogo,
      title: "HARYANA OLYMPIC ASSOCIATION",
      designation: "( State Level Body )",
      location: "Haryana",
      affiliationText: "affiliated with",
      affiliateName: "Indian Olympic Association"
    }
  ]

  return (
    <>
      <style>
        {`
          @keyframes orbitSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes logoFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
          }
          @keyframes goldPulse {
            0%, 100% { opacity: 0.22; transform: scale(1); }
            50% { opacity: 0.55; transform: scale(1.08); }
          }
          @keyframes lineMove {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes badgeBreath {
            0%, 100% { opacity: 0.75; }
            50% { opacity: 1; }
          }
        `}
      </style>
      <section className="bg-[#131b23] py-20 sm:py-24 px-6 sm:px-10 font-sans relative overflow-hidden">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
          <WordReveal 
            text="AFFILIATED WITH"
            className="text-gray-400 text-center font-['Inter'] text-xs font-black tracking-[0.4em] uppercase mb-16"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-5xl">
            {affiliations.map((item, idx) => (
              <ScrollReveal 
                key={idx}
                variant={idx === 0 ? "slideInLeft" : "slideInRight"}
              >
                <PartnerCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Partners
