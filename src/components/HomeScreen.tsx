import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Bell, 
  Search, 
  Plus, 
  Star,
  Home as HomeIcon,
  ShoppingBag,
  User as UserIcon,
  Heart,
  Sparkles,
  Navigation,
  MessageSquare,
  PhoneCall,
  Clock,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Map,
  X,
  Send,
  ArrowRight,
  Ticket,
  Moon,
  Sun
} from "lucide-react";
import { FoodItem, Order, RiderState } from "../types";

interface HomeScreenProps {
  onSelectItem: (item: FoodItem) => void;
  onAddToCart: (item: FoodItem) => void;
  cartCount: number;
  onGoToCart: () => void;
  menuItems: FoodItem[];
  orders: Order[];
  onReorderItems: (items: any[]) => void;
  riderState: RiderState;
  onSendChatMessage: (orderId: string, text: string, sender: "customer") => void;
  userWalletBalance: number;
  onTopUpWallet: (amount: number) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  systemNotifications: string[];
}

export default function HomeScreen({ 
  onSelectItem, 
  onAddToCart, 
  cartCount, 
  onGoToCart,
  menuItems,
  orders,
  onReorderItems,
  riderState,
  onSendChatMessage,
  userWalletBalance,
  onTopUpWallet,
  darkMode,
  onToggleDarkMode,
  systemNotifications
}: HomeScreenProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(["classic-deluxe-burger", "mandu-momo"]);
  const [activeTab, setActiveTab] = useState<"home" | "favorite" | "profile">("home");
  
  // Local states for custom interactions
  const [selectedActiveOrderToTrack, setSelectedActiveOrderToTrack] = useState<Order | null>(null);
  const [trackingChatMessageText, setTrackingChatMessageText] = useState("");
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showSavedAddressesModal, setShowSavedAddressesModal] = useState(false);
  
  // Mock saved addresses list
  const [savedAddresses, setSavedAddresses] = useState([
    { id: "addr-1", type: "Home 🏠", label: "Tysons Corner Block C, Dhaka" },
    { id: "addr-2", type: "Office 🏢", label: "Billion Startup Tower Floor 18" },
    { id: "addr-3", type: "Gym 🏋️", label: "Iron Fitness Gym, Gulshan" }
  ]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Filter food items based on category, search, and availability
  const filteredItems = menuItems.filter(item => {
    if (item.isAvailable === false) return false;
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Active trackable orders (not delivered and not cancelled)
  const activeTrackableOrder = orders.find(
    o => o.status !== "delivered" && o.status !== "cancelled"
  );

  const completedOrders = orders.filter(o => o.status === "delivered");

  // AI recommendations selection trigger
  const aiRecommendedFoods = menuItems.filter(
    item => item.rating >= 4.7 && item.isAvailable !== false
  ).slice(0, 3);

  return (
    <div className={`w-full h-full flex flex-col relative font-sans overflow-hidden select-none pb-18 transition-colors ${
      darkMode ? "bg-slate-950 text-white" : "bg-[#fafafa] text-black"
    }`}>
      
      {/* Dynamic system announcements bar ticker */}
      {systemNotifications.length > 0 && (
        <div className="bg-purple-600 text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-4 text-center overflow-hidden whitespace-nowrap text-ellipsis animate-pulse shrink-0">
          📡 Admin Alert: {systemNotifications[systemNotifications.length - 1]}
        </div>
      )}

      {/* Pinned Top Header */}
      <div className={`p-4 pb-2.5 flex items-center justify-between z-30 border-b shrink-0 ${
        darkMode ? "bg-slate-900/90 border-slate-800" : "bg-[#fafafa]/85 border-gray-50"
      }`}>
        <div className="flex items-center gap-2">
          {/* Static premium profile icon with toggle click */}
          <div 
            onClick={() => setActiveTab("profile")}
            className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer"
          >
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" 
              alt="User profile avatar" 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>

          <div className="text-left">
            <span className={`text-[9px] block uppercase font-black tracking-widest ${darkMode ? "text-slate-400" : "text-gray-400"}`}>Deliver to</span>
            <button 
              onClick={() => setShowSavedAddressesModal(true)}
              className="text-xs font-black tracking-tight leading-none text-slate-500 hover:text-black hover:underline flex items-center gap-0.5"
            >
              📍 Tysons Corner Dhaka <span className="text-[8px]">▼</span>
            </button>
          </div>
        </div>

        {/* Action icons bar */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onToggleDarkMode()}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xs active:scale-90 transition-transform ${
              darkMode ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white border-gray-100 text-slate-700"
            }`}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button 
            onClick={() => setShowNotificationCenter(true)}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-sm relative active:scale-95 transition-all ${
              darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-105 text-gray-700"
            }`}
          >
            <Bell size={15} />
            {systemNotifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container Views Scroll area */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        
        {/* ACTIVE RUNNING ORDER BAR WARNING ticker */}
        {activeTrackableOrder && (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setSelectedActiveOrderToTrack(activeTrackableOrder)}
            className="mx-4 mt-3 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/40 rounded-2xl p-3 flex justify-between items-center cursor-pointer hover:border-emerald-500 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-left">
              <span className="text-lg animate-bounce">🛵</span>
              <div>
                <h4 className="text-[11px] font-black tracking-wide uppercase text-emerald-500 flex items-center gap-1">
                  Active Courier Dispatch <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </h4>
                <p className="text-[10px] text-slate-400 font-bold leading-tight uppercase">
                  Order status: <span className="text-blue-500 font-extrabold">{activeTrackableOrder.status}</span> ({activeTrackableOrder.riderRouteProgress}% transit)
                </p>
              </div>
            </div>
            <span className="text-[11px] bg-emerald-500 hover:bg-emerald-600 text-white font-black px-2.5 py-1 rounded-xl uppercase tracking-wider">
              Track Live
            </span>
          </motion.div>
        )}

        {activeTab === "home" && (
          <div className="space-y-5">
            
            {/* SEARCH COMPONENT & AI recommend banner */}
            <div className="px-4 pt-3 space-y-3 text-left">
              <div>
                <h2 className="text-xl font-black font-display tracking-tight leading-none text-slate-900 dark:text-white">
                  Discover Culinary Chef Art
                </h2>
                <p className="text-slate-450 text-xs font-semibold text-gray-400 mt-1 dark:text-slate-300">Premium startup standard food delivery</p>
              </div>

              {/* Dynamic search bar layout */}
              <div className={`flex gap-2 p-1.5 rounded-2xl border shadow-inner ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-gray-50 border-gray-100"
              }`}>
                <div className="flex-1 px-2.5 flex items-center gap-2">
                  <Search size={15} className="text-gray-405/80" />
                  <input 
                    type="text" 
                    placeholder="Search gourmet burger, pizza, momo..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 outline-none text-xs font-bold text-gray-800 placeholder-gray-400 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Smart AI suggestions banner panel */}
            <div className="px-4 text-left">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-3xl text-white space-y-3.5 relative overflow-hidden shadow-lg border border-purple-500/20">
                <div className="absolute top-0 right-0 p-5 opacity-15 text-5xl font-black pointer-events-none">AI</div>
                
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-200 flex items-center gap-1">
                    <Sparkles size={11} className="fill-purple-300 text-purple-200" /> Dynamic Gourmet AI Suggestions
                  </h4>
                  <p className="text-xs font-bold leading-relaxed max-w-sm">Based on your Gulshan order history, we recommend high-protein items:</p>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
                  {aiRecommendedFoods.map(rec => (
                    <div 
                      key={rec.id}
                      onClick={() => onSelectItem(rec)}
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-2 rounded-2xl flex items-center gap-2.5 cursor-pointer shrink-0 transition-all border border-white/10"
                    >
                      <img src={rec.image} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="text-left leading-none space-y-0.5">
                        <span className="text-[10px] font-black text-white block max-w-[90px] truncate">{rec.name}</span>
                        <span className="text-[9px] text-amber-300 font-extrabold block">★ {rec.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrolling Dynamic Category filters bar */}
            <div className="space-y-2 text-left">
              <h4 className="text-[10.5px] font-black uppercase tracking-widest text-gray-400 pl-4">Our Premium Selections</h4>
              
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-1">
                {["All", "Burger", "Pizza", "Muffin", "Hot dog"].map(category => {
                  const isChose = activeCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4.5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shrink-0 border uppercase tracking-wider shadow-xs hover:border-black ${
                        isChose 
                          ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-950" 
                          : darkMode 
                          ? "bg-slate-900 border-slate-800 text-slate-300" 
                          : "bg-white border-slate-102 text-gray-700"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food gallery grid catalog */}
            <div className="px-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                {filteredItems.map(item => {
                  const isFav = favorites.includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`p-3.5 rounded-3xl border shadow-xs transition-transform duration-300 hover:scale-102 active:scale-98 flex flex-col justify-between cursor-pointer ${
                        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-105/70"
                      }`}
                    >
                      <div className="relative w-full h-28 flex items-center justify-center p-1 bg-slate-50/50 dark:bg-slate-850/50 rounded-2xl overflow-hidden shrink-0">
                        {/* Dynamic absolute selector buttons */}
                        <button 
                          onClick={(e) => toggleFavorite(item.id, e)}
                          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-xs rounded-full flex items-center justify-center border border-gray-150 shadow-xs z-10 active:scale-90 transition-transform"
                        >
                          <Heart size={12} className={isFav ? "fill-red-500 stroke-red-500" : "stroke-gray-300"} />
                        </button>

                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5 mt-2 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400">
                            <span>{item.category}</span>
                            <span className="text-amber-500 text-[10px]">★ {item.rating}</span>
                          </div>
                          
                          <h4 className="font-extrabold text-xs text-slate-900 leading-tight block truncate mt-0.5 dark:text-white">
                            {item.name}
                          </h4>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-805/50 shrink-0">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            ${item.price.toFixed(2)}
                          </span>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(item);
                            }}
                            className="bg-slate-900 hover:bg-black text-white w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform dark:bg-white dark:text-slate-950 shadow-md"
                          >
                            <Plus size={12} className="stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {activeTab === "favorite" && (
          <div className="p-4 space-y-4 text-left">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">My Favorites</h2>
              <p className="text-slate-400 text-xs font-semibold">Gourmet choices selected for immediate access</p>
            </div>

            <div className="space-y-3">
              {favorites.map(favId => {
                const item = menuItems.find(i => i.id === favId);
                if (!item) return null;
                return (
                  <div 
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`p-3 rounded-2xl border flex justify-between items-center cursor-pointer transition-colors ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={item.image} className="w-12 h-12 rounded-xl object-cover border border-slate-50" />
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950 dark:text-white leading-snug">{item.name}</h4>
                        <span className="text-xs font-black text-[#0d1612] dark:text-slate-300">${item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(item);
                      }}
                      className="bg-black text-[#9ce0b7] font-black text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl block cursor-pointer transition-transform active:scale-95"
                    >
                      Add Basket
                    </button>
                  </div>
                );
              })}

              {favorites.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-center text-slate-450 leading-relaxed">
                  <span className="text-4xl animate-bounce">💖</span>
                  <p className="font-extrabold text-sm mt-2 text-slate-800 dark:text-white">Empty favorites vault</p>
                  <p className="text-xs text-slate-400">Slide favorited heart badges inside standard food lists to display items here!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="p-4 space-y-5 text-left text-xs">
            
            {/* Account Profile header card */}
            <div className={`p-4 rounded-3xl border p-5 flex items-center gap-3.5 shadow-xs ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-105/90"
            }`}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" className="w-14 h-14 rounded-full border border-slate-200" />
              <div className="space-y-0.5">
                <span className="text-[9px] uppercase font-black bg-emerald-100 text-[#257545] px-2.5 py-0.5 rounded-full inline-block">Authorized client</span>
                <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight">Ratul Hasan</h3>
                <p className="text-[10px] text-slate-400 font-bold leading-none">VIP Corporate Account • ratul@paybd</p>
              </div>
            </div>

            {/* Wallet Quick Balance actions */}
            <div className={`p-4 rounded-3xl border p-4 space-y-3 shadow-xs text-left ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-105/90"
            }`}>
              <div className="flex justify-between items-center pb-2 border-b border-dashed border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Diner Wallet Credit</span>
                  <h3 className="text-xl font-black text-emerald-500 font-display">${userWalletBalance.toFixed(2)}</h3>
                </div>

                <div className="flex gap-1">
                  <button 
                    onClick={() => onTopUpWallet(10.00)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    +$10
                  </button>
                  <button 
                    onClick={() => onTopUpWallet(25.00)}
                    className="bg-[#090d16] hover:bg-black text-white text-[9px] font-black uppercase px-2.5 py-1.5 rounded-lg active:scale-95 transition-all outline-none"
                  >
                    +$25
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-tight">Preseed wallet enables click-to-pay wallet checkouts inside payment tabs!</p>
            </div>

            {/* Saved Addresses Manager lists */}
            <div className={`p-4 rounded-3xl border p-4 space-y-3.5 shadow-xs ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-105/90"
            }`}>
              <h4 className="font-black text-[10px] uppercase tracking-wider text-slate-400">Saved coordinates</h4>
              
              <div className="space-y-2">
                {savedAddresses.map(addr => (
                  <div key={addr.id} className="flex justify-between items-center text-xs py-1 border-b border-slate-50 last:border-0 pb-1.5">
                    <div className="space-y-0.5">
                      <span className="font-black text-slate-800 dark:text-white tracking-widest">{addr.type}</span>
                      <p className="text-[10px] text-slate-400 leading-none">{addr.label}</p>
                    </div>
                    <span className="text-[10px] text-gray-300">✓ Default</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historic order histories & reorders */}
            <div className={`p-4 rounded-3xl border p-4 space-y-3 shadow-xs ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-105/90"
            }`}>
              <h4 className="font-black text-[10px] uppercase tracking-wider text-slate-400">Order history</h4>
              
              {completedOrders.length === 0 ? (
                <p className="text-xs font-semibold italic text-slate-400 py-3 text-center">No successful checkouts recorded yet.</p>
              ) : (
                <div className="space-y-3.5">
                  {completedOrders.map((histOrder, hIdx) => (
                    <div key={histOrder.id} className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="font-mono text-[9px] font-black text-slate-400 block">ORDER_ID: #{histOrder.id.slice(-6).toUpperCase()}</span>
                        <span className="font-black text-slate-800 dark:text-white block">{histOrder.items[0].foodItem.name} Combo</span>
                        <span className="text-[10px] text-slate-400 block">Settle via {histOrder.paymentMethod.toUpperCase()}</span>
                      </div>

                      <div className="text-right space-y-1 block">
                        <span className="font-black text-slate-900 dark:text-white block">${histOrder.totalAmount.toFixed(2)}</span>
                        <button
                          onClick={() => onReorderItems(histOrder.items)}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-extrabold text-[9px] uppercase px-2.5 py-1 rounded-md transition-colors"
                        >
                          ⚡ Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* MODAL COURIER TRACKER DETAIL DRAWER VIEW PORT */}
      <AnimatePresence>
        {selectedActiveOrderToTrack && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className={`fixed inset-0 z-50 flex flex-col justify-between font-sans ${
              darkMode ? "bg-slate-950 text-white" : "bg-white text-slate-800"
            }`}
          >
            {/* Nav Close Header bar */}
            <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
              darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl animate-bounce">🛵</span>
                <div className="text-left leading-none">
                  <h3 className="font-black text-xs font-mono uppercase text-emerald-500">Live Courier Tracker</h3>
                  <span className="text-[10px] text-slate-400 block font-semibold">OrderID: #{selectedActiveOrderToTrack.id.slice(-6).toUpperCase()}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedActiveOrderToTrack(null)}
                className="p-1.5 rounded-lg bg-slate-205/50 border hover:bg-slate-200 outline-none text-slate-400 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Tracker details progress timeline body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              
              {/* Graphic Tracker indicator */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl text-xs space-y-2.5 text-left">
                <div className="flex justify-between items-center text-slate-400 uppercase font-black tracking-widest text-[9px]">
                  <span>Journey map</span>
                  <span className="text-slate-800 dark:text-white">{selectedActiveOrderToTrack.riderRouteProgress}% Completed</span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedActiveOrderToTrack.riderRouteProgress}%` }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-1 text-[9px] text-center font-bold text-slate-400 uppercase">
                  <span className={selectedActiveOrderToTrack.riderRouteProgress >= 0 ? "text-emerald-500 font-extrabold" : ""}>COOKING</span>
                  <span className={selectedActiveOrderToTrack.riderRouteProgress >= 25 ? "text-emerald-500 font-extrabold" : ""}>COURIER ASSIGNED</span>
                  <span className={selectedActiveOrderToTrack.riderRouteProgress >= 50 ? "text-emerald-500 font-extrabold" : ""}>TRANSIT</span>
                  <span className={selectedActiveOrderToTrack.riderRouteProgress >= 100 ? "text-emerald-500 font-extrabold" : ""}>DELIVERED</span>
                </div>
              </div>

              {/* Vector route map tracker */}
              <div className="w-full h-36 rounded-2xl bg-[#e5e9f0] relative overflow-hidden border border-slate-150">
                <svg className="w-full h-full absolute inset-0 text-white/50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid paths streets */}
                  <path d="M-10 50H320" stroke="#fbfcfd" strokeWidth="18" />
                  <path d="M-10 50H320" stroke="#cfd8dc" strokeWidth="1" />
                  
                  <path d="M110 -10V180" stroke="#fbfcfd" strokeWidth="18" />
                  <path d="M110 -10V180" stroke="#cfd8dc" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Delivery route blue stroke */}
                  <path d="M40 50 L 110 50 L 110 110 L 250 110" stroke="#2563eb" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="absolute left-[20px] top-[14px] bg-[#0c1319] p-1 rounded font-mono text-white text-[8px] font-black uppercase">Chef Cafe</div>
                <div className="absolute right-[24px] top-[120px] bg-red-600 p-1 font-sans rounded text-white text-[8px] font-bold">📍 Recipient (You)</div>

                {/* Moving courier marker coordinate tracker synced with progress ratio */}
                <motion.div 
                  className="absolute"
                  style={{
                    left: selectedActiveOrderToTrack.riderRouteProgress < 50 
                      ? `${40 + (selectedActiveOrderToTrack.riderRouteProgress * 1.4)}px`
                      : "110px",
                    top: selectedActiveOrderToTrack.riderRouteProgress < 50
                      ? "40px"
                      : `${40 + ((selectedActiveOrderToTrack.riderRouteProgress - 50) * 1.4)}px`
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="w-7 h-7 bg-emerald-500 rounded-full border border-white flex items-center justify-center shadow-lg text-white">
                    🛵
                  </div>
                </motion.div>
              </div>

              {/* Courier Profile details */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between text-left">
                <div className="flex items-center gap-2.5 text-xs font-semibold">
                  <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-lg">👨‍✈️</div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white capitalize">{riderState.name}</h4>
                    <p className="text-[10px] text-slate-400 capitalize">{riderState.vehicle} • Approved Courier</p>
                  </div>
                </div>

                <div className="flex gap-1.5 shrink-0">
                  <a 
                    href={`tel:${riderState.phone}`}
                    className="w-8 h-8 rounded-lg bg-emerald-100 text-[#257545] hover:bg-emerald-250 flex items-center justify-center text-xs"
                    title="Call"
                  >
                    <PhoneCall size={12} />
                  </a>
                </div>
              </div>

              {/* Integrated active chat channel panel */}
              <div className="border border-slate-150/80 rounded-2xl overflow-hidden flex flex-col h-48 bg-slate-50 dark:bg-slate-900 shadow-xs">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 border-b border-slate-205 flex items-center justify-between text-[10px] uppercase font-black text-slate-400">
                  <span>Convo chat with {riderState.name}</span>
                  <span className="font-mono text-emerald-500">Live Connect</span>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 flex flex-col no-scrollbar">
                  {selectedActiveOrderToTrack.chatMessages.map(msg => {
                    const isMe = msg.sender === "customer";
                    return (
                      <div 
                        key={msg.id}
                        className={`max-w-[85%] p-2 rounded-xl text-xs font-semibold ${
                          isMe 
                            ? "bg-slate-900 text-white self-end rounded-tr-none" 
                            : "bg-white text-slate-800 border border-slate-200 self-start rounded-tl-none shadow-xs"
                        }`}
                      >
                        <div className="text-[7.5px] font-black uppercase tracking-wider text-slate-450 mb-0.5">
                          {msg.sender}
                        </div>
                        <p className="leading-snug">{msg.text}</p>
                        <span className="text-[7px] text-slate-400 text-right block mt-0.5">{msg.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Send chat controls */}
                <div className="p-1.5 border-t border-slate-200 bg-white flex gap-1.5 shrink-0">
                  <input
                    type="text"
                    placeholder="Text to rider..."
                    value={trackingChatMessageText}
                    onChange={(e) => setTrackingChatMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && trackingChatMessageText.trim()) {
                        onSendChatMessage(selectedActiveOrderToTrack.id, trackingChatMessageText.trim(), "customer");
                        setTrackingChatMessageText("");
                      }
                    }}
                    className="flex-1 h-8 px-2.5 text-xs font-bold bg-slate-50 rounded-lg outline-none border border-slate-150 focus:border-slate-800"
                  />
                  <button
                    onClick={() => {
                      if (trackingChatMessageText.trim()) {
                        onSendChatMessage(selectedActiveOrderToTrack.id, trackingChatMessageText.trim(), "customer");
                        setTrackingChatMessageText("");
                      }
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-black flex items-center justify-center shrink-0"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

            </div>

            <div className={`p-4 border-t text-center text-[10px] font-black uppercase tracking-widest ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-450" : "bg-slate-50 border-slate-100 text-slate-500"
            }`}>
              Billion Food Tracker • ঢাকার রসনা বিলাস 🇧🇩
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL COURIER SYSTEM NOTIFICATIONS LISTS CENTER */}
      {showNotificationCenter && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-[#0c1319] text-white p-4 flex justify-between items-center text-xs pb-4">
              <h3 className="font-black flex items-center gap-1"><Bell size={14} /> Alerts Bulletin Bulletin</h3>
              <button onClick={() => setShowNotificationCenter(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">✕</button>
            </div>

            <div className="p-4 space-y-2.5 text-left text-xs text-slate-700 font-medium max-h-72 overflow-y-auto no-scrollbar">
              {systemNotifications.length === 0 ? (
                <p className="py-8 italic font-semibold text-slate-400 text-center">No platform broadcasts logged yet.</p>
              ) : (
                systemNotifications.map((ann, idx) => (
                  <div key={idx} className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex gap-2">
                    <span className="text-purple-600 font-bold shrink-0">📡</span>
                    <p className="font-bold leading-normal text-slate-800">{ann}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL SAVED ADDRESSES CHOOSE MODAL */}
      {showSavedAddressesModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-50 p-3 flex justify-between items-center text-[11px] font-black uppercase tracking-wider border-b border-slate-100">
              <span>Select location coordinate</span>
              <button onClick={() => setShowSavedAddressesModal(false)} className="text-slate-400 font-bold text-xs p-1 hover:text-black">✕</button>
            </div>

            <div className="p-4 space-y-2 text-left text-xs font-bold text-slate-700">
              {savedAddresses.map(addr => (
                <button 
                  key={addr.id}
                  onClick={() => setShowSavedAddressesModal(false)}
                  className="w-full p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-left flex flex-col justify-start"
                >
                  <span className="font-black text-[10.5px] uppercase tracking-wider text-slate-800">{addr.type}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium truncate w-full">{addr.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
