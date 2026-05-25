import React from "react";
import { motion } from "motion/react";
import { Check, Calendar, ArrowRight, ShoppingBag } from "lucide-react";

interface ConfirmedScreenProps {
  onBackToHome: () => void;
}

export default function ConfirmedScreen({ onBackToHome }: ConfirmedScreenProps) {
  // Generate beautiful delivery dates dynamically
  const formatDeliveryDates = () => {
    const today = new Date();
    // Delivery window: e.g. next 2 to 4 days
    const minDelivery = new Date(today);
    minDelivery.setDate(today.getDate() + 2);
    
    const maxDelivery = new Date(today);
    maxDelivery.setDate(today.getDate() + 4);

    const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "2-digit", month: "short" };
    const minString = minDelivery.toLocaleDateString("en-US", options);
    const maxString = maxDelivery.toLocaleDateString("en-US", options);
    
    return `${minString} - ${maxString}`;
  };

  return (
    <div className="w-full h-full bg-[#fdfdfd] flex flex-col justify-between p-7 text-center font-sans text-black select-none">
      
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 select-none">
        
        {/* Animated Checkbox Outer box design with expanding details */}
        <div className="relative flex items-center justify-center w-40 h-40">
          
          {/* Concentric rotating glowing rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#9ce0b7]/40"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />

          <motion.div 
            className="absolute inset-4 rounded-full bg-[#e8fbf1] -z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
          />

          {/* Opening Food Delivery Box Box Icon SVG */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
            className="relative z-10 w-24 h-24 text-gray-800 flex items-center justify-center"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full fill-none drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
              {/* Box Bottom Base */}
              <path d="M20 45 L 50 62 L 80 45 L 50 28 Z" fill="#cfebd9" stroke="#5db77f" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M20 45 L 20 72 L 50 88 L 50 62 Z" fill="#5db77f" stroke="#36965b" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M50 62 L 50 88 L 80 72 L 80 45 Z" fill="#3ea86a" stroke="#257545" strokeWidth="2.5" strokeLinejoin="round" />
              
              {/* Left Lid open */}
              <path d="M20 45 L 50 28 L 32 15 L 5 32 Z" fill="#aee9c4" stroke="#5db77f" strokeWidth="2" strokeLinejoin="round" />
              
              {/* Right Lid open */}
              <path d="M50 28 L 80 45 L 95 32 L 68 15 Z" fill="#aee9c4" stroke="#5db77f" strokeWidth="2" strokeLinejoin="round" />
            </svg>

            {/* Glowing success seal badge checkmark badge circle */}
            <motion.div 
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-black text-[#9ce0b7] border-4 border-white flex items-center justify-center shadow-lg"
              initial={{ scale: 0, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.5 }}
            >
              <Check size={18} strokeWidth={4} />
            </motion.div>
          </motion.div>
          
        </div>

        {/* Text descriptions heading details */}
        <div className="space-y-3 px-2">
          <motion.h2 
            className="text-2xl font-black text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            Order Confirmed
          </motion.h2>
          
          <motion.p 
            className="text-xs text-gray-500 font-semibold px-4 leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Your order has been placed successfully.<br />Our dynamic culinary service is preparing your food.
          </motion.p>
        </div>

        {/* Dynamic Estimated Delivery Calendar Widget container */}
        <motion.div 
          className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex items-center gap-3 w-full max-w-[260px] shadow-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="w-10 h-10 rounded-2xl bg-[#e8fbf1] text-[#257545] flex items-center justify-center shrink-0 shadow-inner">
            <Calendar size={18} strokeWidth={2.5} />
          </div>
          <div className="text-left space-y-0.5">
            <span className="text-[9px] text-gray-400 font-black tracking-widest uppercase block">Get Delivery By</span>
            <span className="text-xs font-black text-gray-800 block">
              {formatDeliveryDates()}
            </span>
          </div>
        </motion.div>

      </div>

      {/* Action Footer: Order More / Back to Home navigation */}
      <motion.div 
        className="pt-4 pb-2 shrink-0"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <button
          onClick={onBackToHome}
          className="w-full bg-[#0d1612] hover:bg-black text-[#9ce0b7] py-4 px-6 rounded-2xl flex items-center justify-between shadow-xl transition-all active:scale-98 cursor-pointer group"
        >
          <span className="text-xs font-black tracking-wider uppercase text-white group-hover:text-[#9ce0b7] transition-colors flex items-center gap-2">
            <ShoppingBag size={14} /> Back to standard menu
          </span>
          
          <span className="bg-[#9ce0b7] text-[#0d1612] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
             Order More <ArrowRight size={14} />
          </span>
        </button>
      </motion.div>
      
    </div>
  );
}
