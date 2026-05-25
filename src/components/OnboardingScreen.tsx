import React, { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const [hasStarted, setHasStarted] = useState(false);
  
  // Slide button drag physics
  const x = useMotionValue(0);
  const handleWidth = 56;
  const trackWidth = 310;
  
  // Transform x position to change opacity/color of track text
  const textOpacity = useTransform(x, [0, trackWidth - handleWidth - 16], [1, 0.15]);

  const handleDragEnd = () => {
    if (x.get() > (trackWidth - handleWidth - 16) * 0.7) {
      triggerOnboarding();
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  };

  const triggerOnboarding = () => {
    if (hasStarted) return;
    setHasStarted(true);
    // Animate handle to the fully unlocked right side
    animate(x, trackWidth - handleWidth - 12, { duration: 0.25 }).then(() => {
      setTimeout(() => {
        onGetStarted();
      }, 200);
    });
  };

  return (
    <div className="relative w-full h-full bg-[#aee1c5] flex flex-col justify-between p-7 overflow-hidden select-none font-sans">
      
      {/* Decorative Floating Background Orbs for Premium Multi-dimensional Depth */}
      <div className="absolute top-1/4 -left-12 w-48 h-48 rounded-full bg-white/20 blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-60 h-60 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />

      {/* Main Title Typography with custom Dribbble vector inline graphics */}
      <div className="mt-14 space-y-2 relative z-10">
        <motion.h1 
          className="text-5xl font-black tracking-tight text-[#0d1612] leading-[1.1] font-display flex items-center flex-wrap gap-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>We</span>
          {/* Custom Spinning Premium Orange Slice */}
          <motion.span 
            className="inline-flex w-12 h-12 rounded-full border-4 border-[#ff7a00] bg-[#ffa14a] relative shrink-0 items-center justify-center shadow-lg"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          >
            {/* White rind outline */}
            <div className="absolute inset-1 rounded-full border border-dashed border-white/60 flex items-center justify-center">
              {/* Core wheel spokes */}
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <div className="absolute w-full h-0.5 bg-white/30" />
              <div className="absolute h-full w-0.5 bg-white/30" />
            </div>
          </motion.span>
        </motion.h1>
        
        <motion.h1 
          className="text-5xl font-black tracking-tight text-[#0d1612] leading-[1.1] font-display flex items-center flex-wrap gap-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Deliver</span>{" "}
          {/* Overlapping clean geometric loops */}
          <span className="inline-flex items-center -space-x-2.5 bg-white/30 py-1.5 px-3 rounded-full border border-white/40 shadow-sm">
            <span className="w-6 h-6 rounded-full border-2 border-emerald-950 bg-emerald-100 inline-block"></span>
            <span className="w-6 h-6 rounded-full border-2 border-emerald-950 bg-[#ffddaa] inline-block"></span>
          </span>
        </motion.h1>

        <motion.h1 
          className="text-5xl font-black tracking-tight text-[#0d1612] leading-[1.1] font-display"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Fresh Food
        </motion.h1>
      </div>

      {/* Hero Exhibition - Rotating Background Leafy blob & Hand Holding High-Quality Burger */}
      <div className="relative flex-1 flex items-center justify-center -mr-12 mt-2">
        
        {/* Organic amorphous background card shape */}
        <motion.div 
          className="absolute w-72 h-72 bg-[#92ccab]/50 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] pointer-events-none"
          animate={{ 
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%", 
              "60% 40% 50% 50% / 50% 60% 30% 70%", 
              "40% 60% 70% 30% / 40% 50% 60% 50%"
            ],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
        />

        {/* Pulse Halo over center region to represent luxury app interactivity */}
        <div className="absolute w-56 h-56 rounded-full border-2 border-white/30 animate-ping opacity-30 pointer-events-none" />

        {/* Bobbing Walnuts/Nuts with clean drop shadow */}
        <motion.div 
          className="absolute left-4 top-14 z-20 pointer-events-none drop-shadow-xl"
          animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        >
          <svg width="42" height="32" viewBox="0 0 45 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 18C12 11 18 8 23 12C28 16 32 14 32 19C32 24 26 28 20 28C14 28 12 25 12 18Z" fill="#a0724c" />
            <path d="M21 16C21 13 23 11 26 13C29 15 31 14 31 17C31 20 28 22 25 22C22 22 21 20 21 16Z" fill="#cf9c77" />
          </svg>
        </motion.div>

        <motion.div 
          className="absolute left-16 bottom-20 z-20 pointer-events-none drop-shadow-lg"
          animate={{ y: [0, 10, 0], rotate: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut", delay: 0.3 }}
        >
          <svg width="32" height="26" viewBox="0 0 35 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 14C10 9 15 7 19 10C23 13 26 11 26 15C26 19 21 22 16 22C11 22 10 19 10 14Z" fill="#8e5e3a" />
            <path d="M17 12C17 10 19 9 21 10C23 11 24 10 24 13C24 16 21 17 19 17C17 17 17 15 17 12Z" fill="#9e6d49" />
          </svg>
        </motion.div>

        {/* Hand holding extremely high-quality transparent burger styled with precise alignment */}
        <motion.div
          className="relative z-10 w-72 h-72 flex items-center justify-center mt-4"
          initial={{ scale: 0.8, rotate: 12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.25 }}
        >
          {/* Main delicious Hamburger */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400"
              alt="Delicious Burger Showcase"
              className="w-56 h-56 object-cover rounded-full border-4 border-white/60 shadow-2xl relative z-10 transform -rotate-12 transition-transform duration-500 hover:rotate-0"
              style={{ clipPath: "circle(50% at 50% 50%)" }}
            />
            
            {/* Elegant shadow ring backdrop */}
            <div className="absolute inset-4 rounded-full bg-black/10 blur-xl z-0" />
          </div>
          
          {/* Beautiful vector hand holding from bottom right */}
          <div className="absolute -bottom-10 -right-4 w-44 h-44 pointer-events-none z-20">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
              <path d="M50 140 C 70 120, 100 130, 110 110 C 120 90, 110 50, 130 35 C 140 25, 160 30, 155 55 C 150 80, 175 90, 160 110 C 145 130, 180 145, 150 165 C 130 180, 80 170, 50 140 Z" fill="#edd0be" />
              <path d="M10 160C30 145, 50 140, 70 160L40 200L5 190Z" fill="#0d1612" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Swipe/Slide Action Button */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <motion.div 
          className="relative bg-[#0d1612] rounded-full p-1.5 flex items-center select-none shadow-2xl border border-white/10"
          style={{ width: `${trackWidth}px`, height: "68px" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          {/* Track background subtle glowing wave */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />

          {/* Track static/fading textual label */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pl-10 pr-4 text-white font-bold text-sm tracking-widest uppercase font-sans pointer-events-none"
            style={{ opacity: textOpacity }}
          >
            Get Started
          </motion.div>

          {/* Golden/White Ring Slider handle indicator */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: trackWidth - handleWidth - 12 }}
            dragElastic={0.05}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-2xl z-20 text-black border border-gray-100"
          >
            <ArrowRight size={22} className="text-black stroke-[3]" />
          </motion.div>

          {/* Direct Tap Fallback region inside slider for instantaneous entry */}
          <div 
            onClick={triggerOnboarding} 
            className="absolute right-2 top-2 bottom-2 left-16 cursor-pointer z-0 opacity-0" 
            title="Click to start"
          />
        </motion.div>

        {/* Small aesthetic subtext */}
        <p className="text-emerald-950 font-bold text-[10px] uppercase tracking-widest mt-3.5 opacity-60 pointer-events-none">
          Slide handle or tap to begin
        </p>
      </div>
    </div>
  );
}
