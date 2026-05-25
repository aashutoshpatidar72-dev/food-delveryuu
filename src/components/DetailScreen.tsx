import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Heart, Star, ShoppingBag, Plus, Minus, Sparkles } from "lucide-react";
import { FoodItem } from "../types";
import { RELATED_THUMBNAILS } from "../data";

interface DetailScreenProps {
  item: FoodItem;
  onBack: () => void;
  onAddToCart: (item: FoodItem) => void;
  onGoToCart: () => void;
}

export default function DetailScreen({ item, onBack, onAddToCart, onGoToCart }: DetailScreenProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState<string>(item.image);

  // Quick quantity actions
  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item);
    }
    // Deep link transition into the checkout cart
    onGoToCart();
  };

  return (
    <div className="w-full h-full bg-[#fcfcfc] flex flex-col justify-between overflow-y-auto no-scrollbar font-sans text-black select-none relative pb-6">
      
      {/* Top Controls Bar */}
      <div className="px-6 pt-6 pb-2.5 flex items-center justify-between z-10 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-150/70 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft size={18} className="text-gray-800" />
        </button>

        <h3 className="font-extrabold text-xs text-gray-400 tracking-wider uppercase">
          Product Details
        </h3>

        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-150/70 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Heart 
            size={16} 
            className={`transition-colors duration-300 ${isFavorited ? "text-[#e23c3c] fill-[#e23c3c]" : "text-gray-300"}`} 
          />
        </button>
      </div>

      {/* Primary Central Food Asset Exhibit with pulse background shadow */}
      <div className="px-6 py-2 flex flex-col items-center relative shrink-0">
        <motion.div 
          layoutId={`food-card-${item.id}`}
          className="relative w-56 h-56 flex items-center justify-center"
        >
          {/* Subtle revolving glowing circular gradient */}
          <div className="absolute inset-1 bg-[#daf7e6]/60 rounded-full -z-10 animate-pulse blur-xl" />
          
          <img 
            src={selectedThumb} 
            alt={item.name} 
            className="w-44 h-44 object-cover rounded-3xl drop-shadow-[0_22px_36px_rgba(0,0,0,0.18)] transform rotate-6 hover:rotate-0 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Dynamic Pager indicators mimicking high-fidelity carousel */}
        <div className="flex gap-1.5 mt-5">
          <span className="w-4 h-1.5 rounded-full bg-emerald-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Dynamic Sheet Card */}
      <div className="bg-white border-t border-gray-100 rounded-t-[40px] px-7 py-6 space-y-5 shadow-[0_-15px_30px_rgba(0,0,0,0.01)] flex-1 flex flex-col justify-between">
        
        <div className="space-y-4">
          
          {/* Main Title header with description metrics */}
          <div className="flex justify-between items-start">
            <div className="space-y-1 block max-w-[180px]">
              <h2 className="text-xl font-black text-gray-900 tracking-tight leading-tight font-display">
                {item.name}
              </h2>
              
              <div className="flex items-center gap-2.5 text-[10px] text-gray-500 font-extrabold uppercase tracking-wider">
                <span className="text-amber-600">★ {item.rating}</span>
                <span>•</span>
                <span className="text-gray-400">({item.reviewsCount}+ reviews)</span>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-gray-900 block font-display">
                ${(item.price * quantity).toFixed(2)}
              </span>
              <span className="text-[9px] text-gray-400 font-black block tracking-widest uppercase">
                ${item.price.toFixed(2)} / each
              </span>
            </div>
          </div>

          {/* Cooking ingredients / descriptions section */}
          <div className="space-y-1.5 block">
            <h4 className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
              Description & Ingredients
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-bold">
              {item.ingredients}
            </p>
          </div>

          {/* Related Thumbnails Selection Carousel */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 tracking-widest uppercase flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500 fill-amber-500" />
              Upgrade your meal
            </h4>
            
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-0.5">
              {RELATED_THUMBNAILS.map((thumbUrl, idx) => {
                const isSelected = selectedThumb === thumbUrl;
                return (
                  <button 
                    key={idx}
                    onClick={() => setSelectedThumb(thumbUrl)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-0.5 bg-gray-50 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-emerald-400 scale-102 shadow-md bg-white" : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={thumbUrl} 
                      alt="Thumbnail item" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Cohesive Sticky Action Row containing quantity controls AND Add to Cart button */}
        <div className="flex items-center gap-3 pt-3.5 border-t border-gray-50 shrink-0">
          
          {/* Embedded Quantity selector inside bottom bar */}
          <div className="bg-[#f0f2f5] p-1 rounded-2xl flex items-center gap-3.5 border border-gray-150/50">
            <button 
              onClick={decrement}
              className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 text-black flex items-center justify-center active:scale-90 transition-all shadow-xs"
            >
              <Minus size={11} strokeWidth={3.5} />
            </button>
            
            <span className="font-black text-xs text-gray-900 w-3 text-center">
              {quantity}
            </span>

            <button 
              onClick={increment}
              className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 text-black flex items-center justify-center active:scale-90 transition-all shadow-xs"
            >
              <Plus size={11} strokeWidth={3.5} />
            </button>
          </div>

          {/* High-quality primary Action button with responsive shadow */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#0d1612] hover:bg-black text-white py-3.5 px-4 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer active:scale-98 transition-all border border-white/5"
          >
            <span className="text-[10px] font-black tracking-widest uppercase pl-1">
              Add to Basket
            </span>
            
            <span className="bg-[#9ce0b7] text-[#0d1612] text-xs font-black px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
              ${(item.price * quantity).toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
