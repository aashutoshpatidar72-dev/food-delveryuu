import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Plus, Minus, Trash2, Tag, Ticket } from "lucide-react";
import { CartItem } from "../types";

interface CartScreenProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onContinue: () => void;
}

export default function CartScreen({ 
  cart, 
  onBack, 
  onUpdateQuantity, 
  onRemoveItem, 
  onContinue 
}: CartScreenProps) {
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");

  // Calculate bill metrics
  const productPrice = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  const deliveryCharge = productPrice > 0 ? 2.00 : 0.00;
  
  // Custom discount logic
  const promoAppliedPrice = productPrice - discount;
  const totalAmount = promoAppliedPrice + deliveryCharge;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "FRESH70") {
      setDiscount(productPrice * 0.7);
      setPromoMessage("Success! 70% discount applied.");
    } else if (promoCode.trim().toUpperCase() === "FREE") {
      setDiscount(5.00);
      setPromoMessage("Code success! $5.00 discount applied.");
    } else if (promoCode.trim() !== "") {
      // General promo validation discount for any valid entry
      setDiscount(1.50);
      setPromoMessage("Coupon code applied! $1.50 off.");
    } else {
      setPromoMessage("Please enter a valid coupon code.");
    }
  };

  return (
    <div className="w-full h-full bg-[#fcfcfc] flex flex-col justify-between overflow-y-auto no-scrollbar font-sans text-black select-none">
      
      {/* Header Bar */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>

        <h3 className="font-black text-base text-gray-900 tracking-tight">
          My Cart
        </h3>

        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Cart items list section */}
      <div className="flex-1 px-6 py-2 overflow-y-auto space-y-4 max-h-[380px] no-scrollbar">
        {cart.map(item => (
          <motion.div 
            key={item.foodItem.id}
            layoutId={`cart-item-${item.foodItem.id}`}
            exit={{ opacity: 0, x: -50 }}
            className="bg-white border border-gray-100 rounded-3xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-center gap-3">
              {/* Image thumbnail */}
              <div className="w-16 h-16 rounded-2xl bg-gray-50 p-1 flex items-center justify-center overflow-hidden shrink-0 border border-gray-50">
                <img 
                  src={item.foodItem.image} 
                  alt={item.foodItem.name} 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Title, specifications & Subpricing info */}
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-sm text-gray-900 leading-snug tracking-tight truncate max-w-[130px]">
                  {item.foodItem.name}
                </h4>
                <p className="text-[10px] text-gray-400 font-semibold tracking-tight">
                  380g / item 1
                </p>
                <span className="text-xs font-black text-[#0d1612] block">
                  ${(item.foodItem.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Quantity control controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onUpdateQuantity(item.foodItem.id, -1)}
                className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-200 active:scale-90 transition-transform"
              >
                <Minus size={12} strokeWidth={3} />
              </button>

              <span className="font-black text-xs w-4 text-center text-gray-900">
                {item.quantity}
              </span>

              <button 
                onClick={() => onUpdateQuantity(item.foodItem.id, 1)}
                className="w-8 h-8 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-500 hover:text-black hover:border-gray-200 active:scale-90 transition-transform"
              >
                <Plus size={12} strokeWidth={3} />
              </button>

              {/* Remove item button */}
              <button 
                onClick={() => onRemoveItem(item.foodItem.id)}
                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                title="Remove item"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}

        {cart.length === 0 && (
          <div className="py-16 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
            <span className="text-4xl animate-bounce">🛒</span>
            <p className="font-black text-sm text-gray-800">Your cart selection is empty!</p>
            <p className="text-xs text-gray-400">Head back to the menu to add delicious meals.</p>
          </div>
        )}
      </div>

      {/* Bill information, Promo Code & actions section */}
      <div className="bg-white border-t border-gray-100 rounded-t-[40px] px-6 py-5 space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.015)] shrink-0">
        
        {/* Promo code input block */}
        <div className="space-y-1">
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-50 rounded-2xl px-4 flex items-center gap-2 border border-gray-100 shadow-inner">
              <Ticket size={16} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Promo Code" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="w-full h-11 bg-transparent outline-none text-xs font-bold text-gray-800 placeholder-gray-400 uppercase"
              />
            </div>
            <button 
              onClick={handleApplyPromo}
              className="bg-black text-white text-xs font-black px-5 rounded-2xl active:scale-95 transition-all shadow-md shrink-0"
            >
              Apply Code
            </button>
          </div>
          {promoMessage && (
            <p className={`text-[10px] font-black pl-2 ${discount > 0 ? "text-emerald-500 animate-pulse" : "text-amber-500"}`}>
              {promoMessage}
            </p>
          )}
        </div>

        {/* Pricing calculations details */}
        <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-bold">Product Price</span>
            <span className="font-black text-gray-800">${productPrice.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-xs text-emerald-500 animate-pulse">
              <span className="font-bold flex items-center gap-1">
                <Tag size={12} /> Promo Discount Discount
              </span>
              <span className="font-black">-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-bold">Delivery Charge</span>
            <span className="font-black text-gray-800">${deliveryCharge.toFixed(2)}</span>
          </div>

          <hr className="border-t border-gray-200 border-dashed" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-gray-900">Total Amount</span>
            <span className="text-base font-black text-gray-900">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button: Continue Order */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={cart.length === 0}
          onClick={onContinue}
          className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between shadow-xl transition-all ${
            cart.length === 0 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#0d1612] text-white cursor-pointer hover:bg-black"
          }`}
        >
          <span className="text-xs font-black tracking-wider uppercase">
            Continue Order
          </span>
          
          <span className="bg-[#9ce0b7] text-[#0d1612] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
             Checkout Total: ${totalAmount.toFixed(2)}
          </span>
        </motion.button>

      </div>
    </div>
  );
}
