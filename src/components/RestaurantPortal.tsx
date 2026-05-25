import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Utensils, 
  Clock, 
  CheckCircle2, 
  X, 
  ToggleLeft, 
  ToggleRight, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  Camera
} from "lucide-react";
import { FoodItem, Order, CartItem } from "../types";

interface RestaurantPortalProps {
  menuItems: FoodItem[];
  orders: Order[];
  onAddNewMenuItem: (item: FoodItem) => void;
  onToggleMenuItemAvailability: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void;
  onSendChatMessage: (orderId: string, text: string, sender: "restaurant") => void;
}

export default function RestaurantPortal({
  menuItems,
  orders,
  onAddNewMenuItem,
  onToggleMenuItemAvailability,
  onUpdateOrderStatus,
  onSendChatMessage
}: RestaurantPortalProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "kitchen" | "menu" | "analytics">("orders");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chatMessageText, setChatMessageText] = useState("");
  
  // Custom new menu item form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodSub, setNewFoodSub] = useState("");
  const [newFoodPrice, setNewFoodPrice] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState("Burger");
  const [newFoodIngredients, setNewFoodIngredients] = useState("");
  const [newFoodImage, setNewFoodImage] = useState("");

  const activeOrders = orders.filter(
    o => o.status !== "delivered" && o.status !== "cancelled"
  );
  
  const completedOrders = orders.filter(
    o => o.status === "delivered" || o.status === "cancelled"
  );

  // Revenue analytics
  const totalRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const netCommissionPaid = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.commissionFee, 0);

  const earningsNetOfCommission = totalRevenue - netCommissionPaid;

  const handleCreateFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodPrice) return;

    const parsedPrice = parseFloat(newFoodPrice) || 3.50;
    const randomImg = newFoodImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";

    const newItem: FoodItem = {
      id: "res-custom-" + Date.now(),
      name: newFoodName,
      subName: newFoodSub || "Fresh kitchen creation",
      rating: 4.8,
      reviewsCount: 1,
      deliveryTime: "25 Min",
      price: parsedPrice,
      image: randomImg,
      ingredients: newFoodIngredients || "Assorted fresh local kitchen ingredients, seasonings and garnish sauce.",
      category: newFoodCategory,
      isAvailable: true
    };

    onAddNewMenuItem(newItem);
    
    // Clear state
    setNewFoodName("");
    setNewFoodSub("");
    setNewFoodPrice("");
    setNewFoodIngredients("");
    setNewFoodImage("");
    setShowAddModal(false);
  };

  const presetImages = [
    { name: "Burger Combo", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=150" },
    { name: "French Fries", url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=150" },
    { name: "Soda Coke", url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=150" },
    { name: "Premium Salad", url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=150" },
    { name: "Hot Hot Pizza", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=150" }
  ];

  return (
    <div className="w-full h-full bg-[#f8fafc] flex flex-col font-sans overflow-hidden select-none text-slate-800">
      
      {/* Top Banner Header with quick indicators */}
      <div className="bg-[#0b1319] text-white p-5 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/25 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Utensils size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg tracking-tight flex items-center gap-2">
              Billion Food Kitchen <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Approved Portal</span>
            </h1>
            <p className="text-slate-400 text-xs font-semibold">Active Chef Panel • ঢাকার রসনা বিলাস</p>
          </div>
        </div>

        {/* Dynamic Navigation Tabs inside Head */}
        <div className="flex gap-1.5 mt-4 md:mt-0 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(["orders", "kitchen", "menu", "analytics"] as const).map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  // Ensure we clear selection context when switching screens
                  if (tab !== "orders") setSelectedOrder(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-black capitalize tracking-wide transition-all ${
                  isActive
                    ? "bg-slate-800 text-white shadow-md border border-slate-700/50"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Display Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {activeTab === "orders" && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Hand: Orders list */}
            <div className="w-full md:w-1/2 border-r border-slate-200/60 p-5 overflow-y-auto no-scrollbar flex flex-col space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-xs shrink-0">
                <span className="text-xs font-black uppercase text-slate-400">Incoming Orders</span>
                <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs font-black px-2.5 py-0.5 rounded-full">
                  {activeOrders.length} Cooking Active
                </span>
              </div>

              {activeOrders.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 text-center bg-white border border-slate-100 rounded-2xl">
                  <span className="text-4xl animate-bounce">🍳</span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-3">Ready for New Orders</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1">Keep the customer app open and submit an order inside the simulator to instantly capture cooking workflows here!</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {activeOrders.map(order => {
                    const isSelected = selectedOrder?.id === order.id;
                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                          isSelected 
                            ? "border-[#0b1319] shadow-md ring-2 ring-slate-800/5 scale-[1.01]" 
                            : "border-slate-150/60 hover:border-slate-300/85"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-black font-mono text-slate-400">ORDER_ID: #{order.id.slice(-6).toUpperCase()}</span>
                            <h4 className="font-black text-sm text-slate-900 capitalize">{order.customerName}</h4>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            order.status === "placed" 
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : order.status === "preparing"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-1 my-3 text-xs text-slate-500 font-bold border-y border-dashed border-slate-100 py-2">
                          {order.items.map(item => (
                            <div key={item.foodItem.id} className="flex justify-between">
                              <span>{item.quantity}x {item.foodItem.name}</span>
                              <span className="font-mono text-[11px]">${(item.foodItem.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                            <Clock size={12} />
                            <span>Ordered {order.timestamp}</span>
                          </div>
                          <span className="font-black text-sm text-slate-800">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Hand: Order execution console detail */}
            <div className="w-full md:w-1/2 p-5 overflow-y-auto no-scrollbar bg-white flex flex-col justify-between">
              {selectedOrder ? (
                <div className="flex-1 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    {/* Console Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div className="space-y-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-md font-mono">
                          LIVE KITCHEN PROCESS
                        </span>
                        <h3 className="font-black text-lg text-slate-900 mt-1">
                          #{selectedOrder.id.slice(-6).toUpperCase()} Active Order
                        </h3>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedOrder(null)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Customer Meta Row */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs font-bold space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Customer Recipient</span>
                        <span className="text-slate-800 font-black">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone Contact</span>
                        <span className="text-slate-800 font-black">{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="flex flex-col pt-1.5 border-t border-dashed border-slate-200 mt-1.5">
                        <span className="text-slate-400 mb-0.5">Delivery Address</span>
                        <span className="text-slate-800 leading-snug font-black">{selectedOrder.address}</span>
                      </div>
                    </div>

                    {/* Workflow status timeline controls */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        Kitchen Action Control
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedOrder.status === "placed" && (
                          <>
                            <button
                              onClick={() => onUpdateOrderStatus(selectedOrder.id, "accepted")}
                              className="font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl bg-slate-900 text-white hover:bg-black text-center shadow-md cursor-pointer transition-all active:scale-95 border border-slate-800"
                            >
                              ✔️ Accept Order
                            </button>
                            <button
                              onClick={() => {
                                onUpdateOrderStatus(selectedOrder.id, "cancelled");
                                setSelectedOrder(null);
                              }}
                              className="font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 text-center cursor-pointer transition-all active:scale-95"
                            >
                              ❌ Reject / Cancel
                            </button>
                          </>
                        )}

                        {selectedOrder.status === "accepted" && (
                          <button
                            onClick={() => onUpdateOrderStatus(selectedOrder.id, "preparing")}
                            className="col-span-2 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-center shadow-md cursor-pointer transition-all active:scale-98"
                          >
                            🍳 Start Cooking / Preparing
                          </button>
                        )}

                        {selectedOrder.status === "preparing" && (
                          <button
                            onClick={() => onUpdateOrderStatus(selectedOrder.id, "ready")}
                            className="col-span-2 font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-center shadow-md cursor-pointer transition-all active:scale-98"
                          >
                            🍽️ Mark "Ready for Pickup"
                          </button>
                        )}

                        {selectedOrder.status === "ready" && (
                          <div className="col-span-2 bg-emerald-50 text-emerald-700 text-xs font-bold p-3.5 rounded-xl border border-emerald-100 text-center">
                            🍽️ Food is cooked & packed! Waiting for Delivery Rider dispatch approval on the Rider App console.
                          </div>
                        )}

                        {selectedOrder.status === "out-for-delivery" && (
                          <div className="col-span-2 bg-blue-50 text-blue-700 text-xs font-bold p-3.5 rounded-xl border border-blue-100 text-center">
                            🛵 Rider is currently in transit delivering this order. You can monitor progress on their view.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Integrated Chat Simulation drawer within Chef panel */}
                    <div className="border border-slate-150 rounded-2xl overflow-hidden flex flex-col h-48 bg-slate-50">
                      <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                          <MessageSquare size={12} /> Live order chat channel
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">Synced</span>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto space-y-2 flex flex-col no-scrollbar">
                        {selectedOrder.chatMessages.map(msg => {
                          const isMe = msg.sender === "restaurant";
                          return (
                            <div 
                              key={msg.id}
                              className={`max-w-[80%] p-2 rounded-xl text-xs font-semibold ${
                                isMe 
                                  ? "bg-slate-900 text-white self-end rounded-tr-none" 
                                  : "bg-white text-slate-800 border border-slate-200 self-start rounded-tl-none shadow-xs"
                              }`}
                            >
                              <div className="text-[8px] font-black uppercase tracking-wider text-slate-400 mb-0.5">
                                {msg.sender}
                              </div>
                              <p className="leading-snug">{msg.text}</p>
                              <span className="text-[7px] text-slate-400 text-right block mt-0.5">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Input controls */}
                      <div className="p-1.5 border-t border-slate-250/60 bg-white flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Reply to client..."
                          value={chatMessageText}
                          onChange={(e) => setChatMessageText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && chatMessageText.trim()) {
                              onSendChatMessage(selectedOrder.id, chatMessageText.trim(), "restaurant");
                              setChatMessageText("");
                            }
                          }}
                          className="flex-1 h-8 px-2.5 text-xs font-bold bg-slate-50 rounded-lg outline-none border border-slate-150 focus:border-slate-800"
                        />
                        <button
                          onClick={() => {
                            if (chatMessageText.trim()) {
                              onSendChatMessage(selectedOrder.id, chatMessageText.trim(), "restaurant");
                              setChatMessageText("");
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-black flex items-center justify-center shrink-0"
                        >
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-bold text-slate-400 flex items-center justify-center gap-2">
                    <Sparkles size={14} className="text-amber-500 animate-spin" />
                    <span>Instant state syncing completes across Admin & Riders!</span>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-8 space-y-2">
                  <span className="text-3xl">👈</span>
                  <h4 className="font-extrabold text-slate-800 text-xs">Select an active order</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                    Click any incoming card list element on the left to start live kitchen progression or customer message responses!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "kitchen" && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-150/60 shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900">Kitchen Display System (KDS)</h3>
                <p className="text-slate-400 text-xs font-semibold">Live order preparation grid</p>
              </div>
              <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                Live Kitchen Camera
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Prepare Block 1: Placed / Queued */}
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-amber-800 font-extrabold pb-2 border-b border-amber-200/40">
                  <span className="text-xs tracking-wider uppercase">Queued / New</span>
                  <span className="bg-amber-100 text-xs px-2.5 py-0.5 rounded-full">
                    {activeOrders.filter(o => o.status === "placed").length} Orders
                  </span>
                </div>
                
                <div className="space-y-3">
                  {activeOrders
                    .filter(o => o.status === "placed")
                    .map(order => (
                      <div key={order.id} className="bg-white p-3.5 rounded-xl border border-amber-200/50 shadow-xs space-y-2">
                        <div className="flex justify-between font-black text-xs">
                          <span>Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className="text-amber-600">Pending</span>
                        </div>
                        <ul className="text-[11px] text-slate-600 font-bold space-y-0.5 list-disc pl-4">
                          {order.items.map(it => (
                            <li key={it.foodItem.id}>
                              {it.quantity}x {it.foodItem.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>

              {/* Prepare Block 2: In Cooking */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-blue-800 font-extrabold pb-2 border-b border-blue-200/40">
                  <span className="text-xs tracking-wider uppercase">On stove / Cooking</span>
                  <span className="bg-blue-100 text-xs px-2.5 py-0.5 rounded-full">
                    {activeOrders.filter(o => o.status === "preparing").length} Items
                  </span>
                </div>

                <div className="space-y-3">
                  {activeOrders
                    .filter(o => o.status === "preparing")
                    .map(order => (
                      <div key={order.id} className="bg-white p-3.5 rounded-xl border border-blue-200/50 shadow-xs space-y-2">
                        <div className="flex justify-between font-black text-xs">
                          <span>Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className="text-blue-600 flex items-center gap-1">
                            <Clock size={11} className="animate-spin text-blue-500" /> Preparing
                          </span>
                        </div>
                        <ol className="text-[11px] text-slate-600 font-bold space-y-0.5 list-decimal pl-4">
                          {order.items.map(it => (
                            <li key={it.foodItem.id}>
                              {it.quantity}x {it.foodItem.name}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ))}
                </div>
              </div>

              {/* Prepare Block 3: Ready for Courier Dispatch */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-4">
                <div className="flex justify-between items-center text-emerald-800 font-extrabold pb-2 border-b border-emerald-200/40">
                  <span className="text-xs tracking-wider uppercase">Cooked / Ready</span>
                  <span className="bg-emerald-100 text-xs px-2.5 py-0.5 rounded-full">
                    {activeOrders.filter(o => o.status === "ready").length} Ready
                  </span>
                </div>

                <div className="space-y-3">
                  {activeOrders
                    .filter(o => o.status === "ready")
                    .map(order => (
                      <div key={order.id} className="bg-white p-3.5 rounded-xl border border-emerald-250/50 shadow-xs space-y-2">
                        <div className="flex justify-between font-black text-xs text-emerald-700">
                          <span>Order #{order.id.slice(-6).toUpperCase()}</span>
                          <span className="flex items-center gap-0.5 text-[9px] bg-emerald-100 font-black px-1.5 py-0.2 rounded-full">COURIER DISPATCH</span>
                        </div>
                        <ul className="text-[11px] text-slate-500 font-bold space-y-0.5 list-disc pl-4">
                          {order.items.map(it => (
                            <li key={it.foodItem.id}>
                              {it.quantity}x {it.foodItem.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "menu" && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-150/60 shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900">Restaurant Menu Catalog</h3>
                <p className="text-slate-400 text-xs font-semibold">Add, delete or live-toggle food items inside customer selection store</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-slate-900 hover:bg-black text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1"
              >
                <Plus size={14} className="stroke-[3]" /> Add New Food
              </button>
            </div>

            {/* Menu Items Table grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100"
                    />
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#0b1319]">${item.price.toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">{item.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live Availability Switch */}
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Store Avail</span>
                      <button 
                        onClick={() => onToggleMenuItemAvailability(item.id)}
                        className="text-slate-700 active:scale-90 transition-transform cursor-pointer"
                        title="Toggle availability"
                      >
                        {item.isAvailable !== false ? (
                          <ToggleRight size={28} className="text-emerald-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-slate-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide-out modal overlay for adding menu food */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
                >
                  <div className="bg-[#0b1319] text-white p-5 flex justify-between items-center">
                    <h3 className="font-black text-md font-display flex items-center gap-2">
                      <Utensils size={18} className="text-emerald-400" /> Add Restaurant Food Item
                    </h3>
                    <button 
                      onClick={() => setShowAddModal(false)}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateFoodItem} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Item Name *</label>
                        <input
                          type="text"
                          required
                          value={newFoodName}
                          onChange={(e) => setNewFoodName(e.target.value)}
                          placeholder="e.g. Dhaka Mustard Prawn Roll"
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-800 focus:shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Subtitle descriptor</label>
                        <input
                          type="text"
                          value={newFoodSub}
                          onChange={(e) => setNewFoodSub(e.target.value)}
                          placeholder="e.g. Creamy chili dip"
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newFoodPrice}
                          onChange={(e) => setNewFoodPrice(e.target.value)}
                          placeholder="5.50"
                          className="w-full h-10 px-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-800"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</label>
                        <select
                          value={newFoodCategory}
                          onChange={(e) => setNewFoodCategory(e.target.value)}
                          className="w-full h-10 px-2.5 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-800 bg-white"
                        >
                          <option value="Burger">Burger</option>
                          <option value="Pizza">Pizza</option>
                          <option value="Muffin">Muffin</option>
                          <option value="Hot dog">Hot dog</option>
                        </select>
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ingredients / Description</label>
                        <textarea
                          rows={2}
                          value={newFoodIngredients}
                          onChange={(e) => setNewFoodIngredients(e.target.value)}
                          placeholder="Organic jumbo prawn, raw mustard rub, butter buns..."
                          className="w-full p-3 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-800"
                        />
                      </div>

                      {/* Image Selector */}
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Select Food Thumbnail Image</label>
                        <div className="grid grid-cols-5 gap-2">
                          {presetImages.map((img, idx) => {
                            const isChose = newFoodImage === img.url;
                            return (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => setNewFoodImage(img.url)}
                                className={`h-11 border rounded-lg overflow-hidden flex items-center justify-center p-0.5 transition-all ${
                                  isChose ? "border-emerald-500 scale-102 ring-2 ring-emerald-500/10" : "border-slate-200"
                                }`}
                                title={img.name}
                              >
                                <img src={img.url} className="w-full h-full object-cover rounded-md" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0b1319] hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
                    >
                      Publish Item to Store
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
            {/* Top row analytics */}
            <div className="grid grid-cols-3 gap-5">
              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-widest font-sans">Gross Kitchen Revenue</span>
                  <DollarSign size={16} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h2>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                  <TrendingUp size={11} /> +18.4% compared to yesterday
                </p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-widest font-sans">Commission Charges (App)</span>
                  <ShoppingBag size={16} className="text-slate-400" />
                </div>
                <h2 className="text-2xl font-black text-rose-600">${netCommissionPaid.toFixed(2)}</h2>
                <p className="text-[10px] text-slate-400 font-bold">Adjusted from system commission slider</p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-black uppercase tracking-widest font-sans">Net Payout Accrued</span>
                  <DollarSign size={16} className="text-[#3ea86a]" />
                </div>
                <h2 className="text-2xl font-black text-emerald-600">${earningsNetOfCommission.toFixed(2)}</h2>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-0.5 rounded-full inline-block border border-emerald-100">
                  AUTO-SETTLED WALLET
                </span>
              </div>
            </div>

            {/* Custom SVG line-and-bar graph */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-xs">
              <div>
                <h4 className="font-extrabold text-[#0b1319] text-sm">Revenue Progress Tracker</h4>
                <p className="text-slate-400 text-xs">Simulated hours-of-day progression metrics</p>
              </div>

              <div className="w-full h-56 relative bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden flex items-end p-2 px-6">
                {/* Simulated Chart Bars */}
                <div className="absolute inset-0 p-4 flex justify-between items-end">
                  {[45, 80, 110, 65, 120, 190, 160].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 mx-2 text-center h-full justify-end">
                      <div 
                        className="w-full bg-slate-800 hover:bg-emerald-500 rounded-lg transition-all duration-500 flex items-center justify-center text-[10px] text-white font-black" 
                        style={{ height: `${(val / 220) * 100}%` }}
                      >
                        <span className="opacity-0 hover:opacity-100 py-1 transition-opacity">${val}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 mt-2 font-mono">Day {idx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Completed historic record */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-xs">
              <h4 className="font-extrabold text-[#0b1319] text-xs uppercase tracking-wider">Completed cooking logs</h4>
              <div className="space-y-2 text-xs">
                {completedOrders.length === 0 ? (
                  <p className="text-slate-400 font-semibold italic text-center py-6">No orders archived yet.</p>
                ) : (
                  completedOrders.map(o => (
                    <div key={o.id} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                      <div className="space-y-0.5">
                        <span className="font-mono font-black text-slate-400">#{o.id.slice(-6).toUpperCase()}</span>
                        <p className="font-bold text-slate-800">{o.customerName} ordered {o.items.length} dishes</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-800 block">${o.totalAmount.toFixed(2)}</span>
                        <span className={`text-[9px] font-black uppercase text-right tracking-wider ${o.status === "delivered" ? "text-emerald-500" : "text-rose-500"}`}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
