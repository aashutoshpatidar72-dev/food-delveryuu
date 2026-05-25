import React, { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Info, HelpCircle, Check, MapPin } from "lucide-react";

interface PaymentScreenProps {
  totalAmount: number;
  onBack: () => void;
  onPlaceOrder: (method: "card" | "paypal" | "wallet" | "upi" | "cod") => void;
  userWalletBalance: number;
}

export default function PaymentScreen({ totalAmount, onBack, onPlaceOrder, userWalletBalance }: PaymentScreenProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "wallet" | "upi" | "cod">("card");
  const [cardHolder, setCardHolder] = useState("Ratul Hasan");
  const [expiry, setExpiry] = useState("04-08-2026");
  const [cvc, setCvc] = useState("8127");
  const [upiId, setUpiId] = useState("ratul@paybd");
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  return (
    <div className="w-full h-full bg-[#fbfbfb] flex flex-col justify-between overflow-y-auto no-scrollbar font-sans text-black select-none">
      
      {/* Header Bar */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>

        <h3 className="font-backend text-base text-gray-900 tracking-tight font-black">
          Payment
        </h3>

        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Main Payment Forms area */}
      <div className="flex-1 px-6 py-2 overflow-y-auto space-y-3.5 no-scrollbar">
        
        {/* Payment Methods selector block */}
        <div className="space-y-2.5">
          
          {/* Option: Wallet Payment */}
          <div 
            onClick={() => setPaymentMethod("wallet")}
            className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === "wallet" ? "border-black bg-slate-55/40" : "border-gray-105/70 bg-white shadow-xs"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "wallet" ? "border-black" : "border-gray-300"
              }`}>
                {paymentMethod === "wallet" && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-gray-800 block">Personal Digital Wallet</span>
                <span className="text-[10px] text-emerald-500 font-bold block">Available: ${userWalletBalance.toFixed(2)}</span>
              </div>
            </div>
            <span className="text-lg">💳</span>
          </div>

          {/* Option: UPI */}
          <div 
            onClick={() => setPaymentMethod("upi")}
            className={`border rounded-2xl p-3.5 flex flex-col gap-2 cursor-pointer transition-all ${
              paymentMethod === "upi" ? "border-black bg-slate-55/40" : "border-gray-105/70 bg-white shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "upi" ? "border-black" : "border-gray-300"
                }`}>
                  {paymentMethod === "upi" && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
                <span className="text-xs font-black text-gray-800">UPI Instant Payment (BHIM)</span>
              </div>
              <span className="text-[10px] uppercase font-black bg-[#faf0ff] text-indigo-700 px-1.5 py-0.5 rounded-md">UPI Quick</span>
            </div>

            {paymentMethod === "upi" && (
              <div className="pt-1.5" onClick={e => e.stopPropagation()}>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. ratul@oksbi"
                  className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-xs font-bold text-gray-800 focus:border-black outline-none shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Option A: Pay with PayPal */}
          <div 
            onClick={() => setPaymentMethod("paypal")}
            className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === "paypal" ? "border-black bg-gray-50/50" : "border-gray-101/70 bg-white shadow-xs"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "paypal" ? "border-black" : "border-gray-300"
              }`}>
                {paymentMethod === "paypal" && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
              <span className="text-xs font-black text-gray-800">Pay with PayPal</span>
            </div>

            <div className="flex items-center gap-0.5 bg-blue-50 px-2 py-1 rounded-lg">
              <span className="text-xs font-black italic text-blue-800">Pay</span>
              <span className="text-xs font-black italic text-cyan-600">Pal</span>
            </div>
          </div>

          {/* Option B: Credit & Debit Cards */}
          <div 
            onClick={() => setPaymentMethod("card")}
            className={`border rounded-2xl p-3.5 flex flex-col gap-3 cursor-pointer transition-all ${
              paymentMethod === "card" ? "border-black bg-gray-50/50" : "border-gray-101/70 bg-white shadow-xs"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "card" ? "border-black" : "border-gray-300"
                }`}>
                  {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-black" />}
                </div>
                <span className="text-xs font-black text-gray-800">Credit & Debit Cards</span>
              </div>

              <div className="flex gap-1 bg-white p-0.5 rounded border border-gray-102">
                <div className="text-[7.5px] font-black italic text-blue-800 p-0.2">Visa</div>
                <div className="text-[7.5px] font-black text-[#ffaa00] p-0.2">Master</div>
              </div>
            </div>

            {paymentMethod === "card" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 pt-1 text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Cardholder Name</label>
                  <input 
                    type="text" 
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-xs font-bold text-gray-800 focus:border-black outline-none shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">MM/YY</label>
                    <input 
                      type="text" 
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-xs font-bold text-gray-800 focus:border-black outline-none text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block font-sans">CVC</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full h-10 bg-white border border-gray-100 rounded-xl px-3 text-xs font-bold text-gray-800 focus:border-black outline-none text-center"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Option: Cash on Delivery */}
          <div 
            onClick={() => setPaymentMethod("cod")}
            className={`border rounded-2xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
              paymentMethod === "cod" ? "border-black bg-gray-50/50" : "border-gray-101/70 bg-white shadow-xs"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "cod" ? "border-black" : "border-gray-300"
              }`}>
                {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
              <span className="text-xs font-black text-gray-800">Cash on Delivery (COD)</span>
            </div>
            <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full">Pay at Door</span>
          </div>

        </div>

        {/* Verification conditions */}
        <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={isTermsAccepted} 
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
            className="sr-only"
          />
          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
            isTermsAccepted ? "bg-black border-black text-white" : "bg-white border-gray-300"
          }`}>
            {isTermsAccepted && <Check size={10} strokeWidth={3} />}
          </div>
          <span className="text-[9px] text-gray-400 font-extrabold text-left leading-normal block">
            I verify that I have filled accuracy information and accept the service's delivery terms & condition logic.
          </span>
        </label>


        {/* Delivery Address Google Vector Map */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-gray-400 tracking-wider uppercase flex items-center gap-1.5">
            <MapPin size={12} className="text-[#e23c3c]" /> Delivery Address
          </h4>

          {/* Virtual Street grid map illustration */}
          <div className="w-full h-32 rounded-2xl border border-gray-100 bg-[#e5e9f0] relative overflow-hidden shadow-sm">
            {/* Custom SVG grid rendering maps, streets, routes and pins */}
            <svg className="w-full h-full absolute inset-0 text-white/50" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Streets paths */}
              <path d="M-10 40H320" stroke="#fbfcfd" strokeWidth="18" />
              <path d="M-10 40H320" stroke="#cfd8dc" strokeWidth="1.5" />
              
              <path d="M80 -10V150" stroke="#fbfcfd" strokeWidth="18" />
              <path d="M80 -10V150" stroke="#cfd8dc" strokeWidth="1.5" strokeDasharray="3 3" />
              
              <path d="M220 -10V150" stroke="#fbfcfd" strokeWidth="22" />
              <path d="M220 -10V150" stroke="#cfd8dc" strokeWidth="1.5" />

              <path d="M-10 100H320" stroke="#fbfcfd" strokeWidth="24" strokeLinecap="round" />
              <path d="M-10 100H320" stroke="#cfd8dc" strokeWidth="1.5" />
              
              {/* Route Line highlighted in Blue */}
              <path d="M80 120 L 80 100 L 220 100 L 220 50" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
            </svg>

            {/* Map Area Labels details overlay */}
            <div className="absolute top-2 left-3 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-[8px] font-black tracking-tight text-gray-800">
              Tysons Corner
            </div>
            <div className="absolute bottom-6 right-12 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded-md text-[8px] font-black tracking-tight text-gray-500">
              Pimmit Hills
            </div>

            {/* Target locator locator pointer indicator */}
            <motion.div 
              className="absolute left-[214px] top-[40px] z-10"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {/* Pin design */}
              <div className="relative">
                <MapPin size={22} className="text-[#e23c3c] drop-shadow-md" fill="#e23c3c" />
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-white border border-[#e23c3c]" />
                {/* Ripple radar */}
                <div className="absolute -bottom-1 left-1.5 w-2 h-1 bg-black/25 rounded-full scale-y-50 blur-xs" />
              </div>
            </motion.div>
          </div>
        </div>

      </div>

      {/* Place Order Checkout CTA and invoice details section */}
      <div className="bg-white border-t border-gray-100 rounded-t-[40px] px-6 py-5 space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.015)] shrink-0">
        
        {/* Toggleable invoice detail view link */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-extrabold uppercase tracking-wide">Total Amount</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-gray-900">${totalAmount.toFixed(2)}</span>
              <button 
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="text-[10px] font-black text-gray-500 hover:text-black underline cursor-pointer"
              >
                {showPriceDetails ? "Hide details" : "See price details"}
              </button>
            </div>
          </div>

          {/* Expanded billing subdetails */}
          {showPriceDetails && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-gray-50 rounded-xl p-3 text-[10px] font-bold text-gray-600 border border-gray-100 flex flex-col gap-1.5"
            >
              <div className="flex justify-between">
                <span>Dynamic basket value</span>
                <span>${(totalAmount - 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 border-dashed pt-1 font-black text-gray-800">
                <span>Gross Checkout total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Ultimate Place Order checkout button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={!isTermsAccepted}
          onClick={() => onPlaceOrder(paymentMethod)}
          className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between shadow-xl transition-all ${
            !isTermsAccepted 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#0d1612] text-white cursor-pointer hover:bg-black"
          }`}
        >
          <span className="text-xs font-black tracking-wider uppercase">
            Place Order
          </span>
          
          <span className="bg-[#9ce0b7] text-[#0d1612] text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1">
             Debit Total Amount: ${totalAmount.toFixed(2)}
          </span>
        </motion.button>

      </div>
    </div>
  );
}
