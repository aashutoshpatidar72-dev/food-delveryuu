import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Navigation, 
  MapPin, 
  MessageSquare, 
  PhoneCall, 
  DollarSign, 
  User, 
  ShieldAlert, 
  Sparkles, 
  Send,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  Package,
  BellRing
} from "lucide-react";
import { Order, RiderState } from "../types";

interface RiderDispatchProps {
  orders: Order[];
  riderState: RiderState;
  onUpdateRiderOnlineStatus: (isOnline: boolean) => void;
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onIncrementRiderLocation: (orderId: string) => void;
  onSendChatMessage: (orderId: string, text: string, sender: "rider") => void;
  onRiderEarnMoney: (amount: number) => void;
}

export default function RiderDispatch({
  orders,
  riderState,
  onUpdateRiderOnlineStatus,
  onUpdateOrderStatus,
  onIncrementRiderLocation,
  onSendChatMessage,
  onRiderEarnMoney
}: RiderDispatchProps) {
  const [selectedTab, setSelectedTab] = useState<"delivery" | "earnings" | "chat">("delivery");
  const [chatMessageText, setChatMessageText] = useState("");
  const [showCallModal, setShowCallModal] = useState(false);
  const [tickerSecond, setTickerSecond] = useState(15);

  // Active orders assigned to this rider or waiting for dispatch
  const incomingDispatchOrder = orders.find(
    o => o.status === "ready" && !o.riderAssigned && riderState.isOnline
  );

  const activeAssignedOrder = orders.find(
    o => o.riderAssigned === riderState.name && o.status !== "delivered" && o.status !== "cancelled"
  );

  const completedDeliveries = orders.filter(
    o => o.riderAssigned === riderState.name && o.status === "delivered"
  );

  // Automatic ticking for order notification countdown
  useEffect(() => {
    let interval: any;
    if (incomingDispatchOrder) {
      interval = setInterval(() => {
        setTickerSecond(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setTickerSecond(15);
    }
    return () => clearInterval(interval);
  }, [incomingDispatchOrder]);

  const handleAcceptOrder = (orderId: string) => {
    // Assign order to this rider and update status to out-for-delivery
    onUpdateOrderStatus(orderId, "out-for-delivery");
    // State machine coordinates it
  };

  const handleAdvanceRoute = () => {
    if (!activeAssignedOrder) return;
    
    // Increment the delivery state progress
    if (activeAssignedOrder.riderRouteProgress < 100) {
      onIncrementRiderLocation(activeAssignedOrder.id);
    }
  };

  const handleCompleteDeliveryStatus = () => {
    if (!activeAssignedOrder) return;
    onUpdateOrderStatus(activeAssignedOrder.id, "delivered");
    // Standard payout for delivery order: e.g. baseline delivery charge ($2.00) + premium mileage bonus ($1.50)
    onRiderEarnMoney(3.50);
  };

  return (
    <div className="w-full h-full bg-[#f1f5f9] flex flex-col justify-between font-sans overflow-hidden text-slate-800 select-none relative">
      
      {/* Rider Navigation Header */}
      <div className="bg-[#090d16] text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#223dd6]/20 border border-[#223dd6]/40 rounded-full flex items-center justify-center text-blue-400">
            <Navigation size={16} />
          </div>
          <div>
            <h2 className="font-display font-black text-sm tracking-tight">{riderState.name}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{riderState.vehicle} • ★ {riderState.rating}</p>
          </div>
        </div>

        {/* Toggle online status indicator */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
            {riderState.isOnline ? "Online" : "Offline"}
          </span>
          <button 
            onClick={() => onUpdateRiderOnlineStatus(!riderState.isOnline)}
            className="cursor-pointer transition-transform active:scale-95"
          >
            {riderState.isOnline ? (
              <ToggleRight size={28} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={28} className="text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Main interactive screen zone */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-16 relative">
        
        {/* FLASHING INCOMING DISPATCH ORDER NOTIFICATION MODAL */}
        <AnimatePresence>
          {incomingDispatchOrder && (
            <motion.div 
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-x-4 top-4 bg-[#0a0f1d] text-white p-5 rounded-3xl z-40 shadow-2xl border border-blue-500/30 font-sans"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <BellRing size={10} /> Dispatch Offering
                </span>
                <span className="text-amber-500 text-xs font-black font-mono">Accept in {tickerSecond}s</span>
              </div>

              <div className="space-y-2 mb-5 text-left">
                <h3 className="font-black text-base">{incomingDispatchOrder.items[0].foodItem.name} Combo</h3>
                <div className="text-xs text-slate-400 font-bold space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>Cuisine Pick</span>
                    <span>Billion Food Kitchen BD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Distance</span>
                    <span>3.2 km</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-black">
                    <span>Your payout earnings</span>
                    <span>+$3.50 (Guaranteed)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptOrder(incomingDispatchOrder.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Confirm Accept Tag
                </button>
                <button
                  onClick={() => onUpdateOrderStatus(incomingDispatchOrder.id, "cancelled")}
                  className="px-4 bg-slate-800 text-slate-400 font-black text-xs uppercase hover:text-white rounded-xl"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {selectedTab === "delivery" && (
          <div className="w-full h-full flex flex-col justify-between">
            {activeAssignedOrder ? (
              <div className="flex-1 p-4 space-y-4 text-left">
                
                {/* Active courier details card */}
                <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Delivery Active
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      #{activeAssignedOrder.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-black text-md text-slate-900 leading-tight">
                    Deliver to {activeAssignedOrder.customerName}
                  </h3>
                  <p className="text-xs font-bold text-slate-400">
                    📍 {activeAssignedOrder.address}
                  </p>
                </div>

                {/* Animated vector navigation map */}
                <div className="w-full h-44 rounded-2xl bg-[#e2e8f0] relative overflow-hidden shadow-xs border border-slate-150">
                  <svg className="w-full h-full absolute inset-0 text-white/50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Maps grids streets */}
                    <path d="M-10 60H320" stroke="#f1f5f9" strokeWidth="22" />
                    <path d="M-10 60H320" stroke="#cbd5e1" strokeWidth="1" />
                    
                    <path d="M120 -10V180" stroke="#f1f5f9" strokeWidth="22" />
                    <path d="M120 -10V180" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                    
                    {/* Delivery Route Blue path */}
                    <path d="M40 60 L 120 60 L 120 130 L 260 130" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  {/* Icon pins representing Diner kitchen and Customer destination */}
                  <div className="absolute left-[30px] top-[46px] bg-[#090d16] text-white p-1 rounded-md text-[8px] font-bold">
                    Chef Diner
                  </div>
                  <div className="absolute right-[24px] top-[140px] bg-red-600 text-white p-1 rounded-md text-[8px] font-bold">
                    📍 Customer Home
                  </div>

                  {/* Moving dynamic Rider pin indicator synced with progress */}
                  <motion.div 
                    className="absolute"
                    style={{
                      // Map the progress 0-100 to map coordinate paths
                      left: activeAssignedOrder.riderRouteProgress < 50 
                        ? `${40 + (activeAssignedOrder.riderRouteProgress * 1.6)}px`
                        : "120px",
                      top: activeAssignedOrder.riderRouteProgress < 50
                        ? "48px"
                        : `${50 + ((activeAssignedOrder.riderRouteProgress - 50) * 1.6)}px`
                    }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg">
                        🛵
                      </div>
                      <div className="absolute -inset-1 rounded-full border border-blue-600 animate-ping opacity-40 pointer-events-none" />
                    </div>
                  </motion.div>
                </div>

                {/* Progress simulator widgets */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-bold space-y-3">
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Route Completion Progress</span>
                    <span className="font-mono text-slate-800 text-xs font-black">{activeAssignedOrder.riderRouteProgress}%</span>
                  </div>

                  {/* Visual pipeline progress bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeAssignedOrder.riderRouteProgress}%` }}
                    />
                  </div>

                  {activeAssignedOrder.riderRouteProgress < 100 ? (
                    <button
                      onClick={handleAdvanceRoute}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      🛵 Drive Route / Advance GPS
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteDeliveryStatus}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      📦 Handover & Confirm Settle Delivered
                    </button>
                  )}
                </div>

                {/* Communications quick trigger */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setSelectedTab("chat")}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl font-black text-xs uppercase tracking-wider text-slate-700 hover:text-black hover:border-slate-350 hover:bg-slate-50 text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare size={13} className="text-blue-500" /> Chat Recipient
                  </button>

                  <button 
                    onClick={() => setShowCallModal(true)}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl font-black text-xs uppercase tracking-wider text-slate-700 hover:text-black hover:border-slate-350 hover:bg-slate-50 text-center flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall size={13} className="text-emerald-500" /> Dial Call
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto mt-12 bg-white rounded-3xl border border-slate-100 shadow-xs">
                <span className="text-4xl animate-pulse">🛰️</span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">Waiting for Food Orders</h3>
                  <p className="text-[11.5px] text-slate-400 mt-1 leading-relaxed">
                    Once a user submits an order and the restaurant has accepted, cooked, and marked the dish as "Ready", a dispatch notification card will instantly blink right here for acceptance!
                  </p>
                </div>

                <div className="border border-amber-200 bg-amber-50/50 rounded-xl p-3 text-left text-[11px] text-amber-700 font-bold space-y-1">
                  <span>💡 Simulator Quick Instructions:</span>
                  <p className="text-[10px] text-slate-500 leading-snug font-medium">1. Set your status toggle in the header to "Online".<br />2. Submit a food basket order on the Customer App.<br />3. Accept & advance kitchen status inside the Restaurant Panel.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedTab === "earnings" && (
          <div className="p-4 space-y-4 text-left">
            {/* Quick balance card */}
            <div className="bg-[#090d16] text-white p-5 rounded-2xl shadow-md border border-slate-850 space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Rider Wallet Balance</span>
              <h2 className="text-3xl font-display font-black text-emerald-400">
                ${riderState.walletBalance.toFixed(2)}
              </h2>
              <p className="text-[10px] text-slate-500">Auto-settled securely using Million Wallet API</p>
            </div>

            {/* Quota history logs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">Completed dropoffs history</h4>
              
              {completedDeliveries.length === 0 ? (
                <p className="text-xs text-slate-400 font-semibold italic py-4 text-center">No deliveries accrued yet.</p>
              ) : (
                <div className="space-y-2">
                  {completedDeliveries.map(o => (
                    <div key={o.id} className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100 last:border-0">
                      <div>
                        <span className="font-mono text-[10px] font-black text-slate-400 block">#{o.id.slice(-6).toUpperCase()}</span>
                        <span className="font-bold text-slate-700">{o.customerName} home drop</span>
                      </div>
                      <span className="font-black text-emerald-600">+$3.50</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === "chat" && (
          <div className="p-4 flex flex-col h-[400px] justify-between relative text-xs">
            {activeAssignedOrder ? (
              <div className="flex-1 border border-slate-200 rounded-2xl overflow-hidden flex flex-col bg-slate-50 shadow-xs h-full">
                <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500">
                    💬 Messaging {activeAssignedOrder.customerName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Channel Live</span>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 flex flex-col no-scrollbar">
                  {activeAssignedOrder.chatMessages.map(msg => {
                    const isMe = msg.sender === "rider";
                    return (
                      <div 
                        key={msg.id}
                        className={`max-w-[85%] p-2 rounded-xl text-xs font-semibold ${
                          isMe 
                            ? "bg-slate-900 text-white self-end rounded-tr-none" 
                            : "bg-white text-slate-800 border border-slate-200 self-start rounded-tl-none shadow-xs"
                        }`}
                      >
                        <div className="text-[7.5px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                          {msg.sender}
                        </div>
                        <p className="leading-snug">{msg.text}</p>
                        <span className="text-[7px] text-slate-400 text-right block mt-0.5">{msg.time}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-1.5 border-t border-slate-200 bg-white flex gap-1.5 shrink-0">
                  <input
                    type="text"
                    placeholder="Send text to customer..."
                    value={chatMessageText}
                    onChange={(e) => setChatMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && chatMessageText.trim()) {
                        onSendChatMessage(activeAssignedOrder.id, chatMessageText.trim(), "rider");
                        setChatMessageText("");
                      }
                    }}
                    className="flex-1 h-8 px-2.5 text-xs font-bold bg-slate-50 rounded-lg outline-none border border-slate-150 focus:border-slate-800"
                  />
                  <button
                    onClick={() => {
                      if (chatMessageText.trim()) {
                        onSendChatMessage(activeAssignedOrder.id, chatMessageText.trim(), "rider");
                        setChatMessageText("");
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-black flex items-center justify-center shrink-0"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <span className="text-3xl">🏜️</span>
                <p className="font-extrabold text-slate-800 text-xs mt-2">No Active Order Convo</p>
                <p className="text-[11px] text-slate-450 mt-1">Accept drop-offs to initiate live chat protocols with orders recipients!</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Internal interactive Navigation indicators */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-white/95 backdrop-blur-md border-t border-slate-200/65 flex items-center justify-around z-30">
        <button 
          onClick={() => setSelectedTab("delivery")}
          className={`text-center flex flex-col items-center gap-0.5 ${selectedTab === "delivery" ? "text-blue-600 font-extrabold" : "text-slate-400 hover:text-slate-800 font-bold"}`}
        >
          <Navigation size={15} />
          <span className="text-[10px] leading-none uppercase tracking-wider">Route Map</span>
        </button>

        <button 
          onClick={() => setSelectedTab("earnings")}
          className={`text-center flex flex-col items-center gap-0.5 ${selectedTab === "earnings" ? "text-emerald-600 font-extrabold" : "text-slate-400 hover:text-slate-800"}`}
        >
          <DollarSign size={15} />
          <span className="text-[10px] leading-none uppercase tracking-wider">Earnings</span>
        </button>

        <button 
          onClick={() => setSelectedTab("chat")}
          className={`text-center flex flex-col items-center gap-0.5 ${selectedTab === "chat" ? "text-slate-900 font-extrabold" : "text-slate-400 hover:text-slate-800"}`}
        >
          <div className="relative">
            <MessageSquare size={15} />
            {activeAssignedOrder && (
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#e23c3c] rounded-full" />
            )}
          </div>
          <span className="text-[10px] leading-none uppercase tracking-wider">Customer Convo</span>
        </button>
      </div>

      {/* CALL MODAL OVERLAY */}
      {showCallModal && activeAssignedOrder && (
        <div className="fixed inset-0 bg-[#090d16]/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-50 text-white">
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500 flex items-center justify-center text-emerald-400 animate-pulse text-4xl mb-6">
            📞
          </div>
          
          <h2 className="text-xl font-black font-display tracking-tight">Calling Customer</h2>
          <p className="text-slate-400 text-xs font-semibold mt-1">{activeAssignedOrder.customerName} • Dhaka Dispatch Routing</p>
          <span className="text-[9px] bg-white/10 text-white font-black uppercase px-2 py-0.5 rounded-full mt-4 font-mono">00:04 Sec</span>

          <button
            onClick={() => setShowCallModal(false)}
            className="mt-14 w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 font-black text-xl text-white flex items-center justify-center shadow-lg active:scale-90 select-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
