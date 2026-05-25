import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone,
  UtensilsCrossed,
  Truck,
  ShieldAlert,
  HelpCircle,
  Database,
  Coins
} from "lucide-react";

import { FOOD_ITEMS } from "./data";
import { FoodItem, CartItem, Order, RiderState, PlatformConfig, ChatMessage } from "./types";

// Subscreen and System Portal imports
import OnboardingScreen from "./components/OnboardingScreen";
import HomeScreen from "./components/HomeScreen";
import DetailScreen from "./components/DetailScreen";
import CartScreen from "./components/CartScreen";
import PaymentScreen from "./components/PaymentScreen";
import ConfirmedScreen from "./components/ConfirmedScreen";

// Specialized Backend Portals
import RestaurantPortal from "./components/RestaurantPortal";
import RiderDispatch from "./components/RiderDispatch";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  // Master active view controllers for smaller viewports or primary desktop tabs
  const [activeSystemControl, setActiveSystemControl] = useState<"customer" | "restaurant" | "rider" | "admin">("customer");
  
  // App state
  const [currentScreen, setCurrentScreen] = useState<
    "onboarding" | "home" | "detail" | "cart" | "payment" | "confirmed"
  >("onboarding");

  // Dynamic products database preseeded
  const [menuItems, setMenuItems] = useState<FoodItem[]>(FOOD_ITEMS);

  // Dynamic Orders Ledger Database
  const [orders, setOrders] = useState<Order[]>([]);

  // Platform Commission configuration
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>({
    commissionRate: 15,
    baseDeliveryFee: 2.00,
    enableAiRecommender: true,
    platformName: "Billion Food Delivery",
    darkMode: false
  });

  // Client simulated Digital Wallet Balance preseeded with ample capital
  const [userWalletBalance, setUserWalletBalance] = useState<number>(150.00);

  // Integrated dynamic Rider status
  const [riderState, setRiderState] = useState<RiderState>({
    name: "Mahbubur Rahman",
    phone: "01712345678",
    vehicle: "Suzuki Overdrive Motor 150cc",
    rating: 4.9,
    walletBalance: 42.50,
    isOnline: true
  });

  // Master Promo Coupon list
  const [couponCodes, setCouponCodes] = useState([
    { code: "CHEFSPEC", discountRate: 20 },
    { code: "STARTUP10", discountRate: 10 }
  ]);

  // Master Broadcast Notification announcements log
  const [systemNotifications, setSystemNotifications] = useState<string[]>([
    "Welcome to Billion-Dollar Food Delivery Network. Multi-portal nodes successfully online."
  ]);

  // Dark node controller
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Pre-seed an active mock checkout cart on load so the experience feels ready and organic
  const [cart, setCart] = useState<CartItem[]>([
    { foodItem: FOOD_ITEMS[0], quantity: 2 }, // Classic Deluxe Burger @ $5.84 = $11.68
    { foodItem: FOOD_ITEMS[1], quantity: 1 }, // Burger & Strips Combo @ $4.00 = $4.00
    { foodItem: FOOD_ITEMS[2], quantity: 1 }  // Mandu Momo @ $2.00 = $2.00
  ]);

  const [selectedItem, setSelectedItem] = useState<FoodItem>(FOOD_ITEMS[0]);

  // --- CART OPERATIONS HANDLERS ---
  const handleAddToCart = (item: FoodItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(c => c.foodItem.id === item.id);
      if (existing) {
        return prevCart.map(c => 
          c.foodItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { foodItem: item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCart(prevCart => 
      prevCart.map(c => {
        if (c.foodItem.id === itemId) {
          const targetQty = c.quantity + change;
          return { ...c, quantity: Math.max(1, targetQty) };
        }
        return c;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prevCart => prevCart.filter(c => c.foodItem.id !== itemId));
  };

  const handleSelectItem = (item: FoodItem) => {
    setSelectedItem(item);
    setCurrentScreen("detail");
  };

  const getCartCount = () => {
    return cart.reduce((sum, c) => sum + c.quantity, 0);
  };

  const getCartTotalAmount = () => {
    const productPrice = cart.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
    const delivery = productPrice > 0 ? platformConfig.baseDeliveryFee : 0.00;
    return productPrice + delivery;
  };

  // --- MASTER STATE WORKFLOW SYNC HANDLERS ---
  
  // Adding products in the Chef screen
  const handleAddNewMenuItem = (item: FoodItem) => {
    setMenuItems(prev => [...prev, item]);
    handleBroadcastNotification(`Chef posted new recipe: ${item.name}! Check it out now inside the catalog.`);
  };

  // Toggling chef item availability status
  const handleToggleMenuItemAvailability = (id: string) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  // Wallet Actions
  const handleTopUpWallet = (amount: number) => {
    setUserWalletBalance(prev => prev + amount);
    handleBroadcastNotification(`Credited $${amount.toFixed(2)} to client digital wallet account.`);
  };

  // Promoting Discount Codes inside Admin Panel
  const handleAddNewCoupon = (code: string, rate: number) => {
    setCouponCodes(prev => [...prev, { code, discountRate: rate }]);
    handleBroadcastNotification(`Special promotion released: Code "${code}" offers ${rate}% discount!`);
  };

  const handleDeleteCoupon = (code: string) => {
    setCouponCodes(prev => prev.filter(c => c.code !== code));
  };

  // Global Administrative announcements broadcaster
  const handleBroadcastNotification = (announcement: string) => {
    setSystemNotifications(prev => [...prev, announcement]);
  };

// Standalone safe ID generator function
function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

  // Placing the checkout Order
  const handlePlaceOrderWithPayment = (method: "card" | "paypal" | "wallet" | "upi" | "cod") => {
    const totalCost = getCartTotalAmount();
    const productTotal = Math.max(0, totalCost - platformConfig.baseDeliveryFee);

    // Check balance deductions if Wallet is specified
    if (method === "wallet") {
      if (userWalletBalance < totalCost) {
        handleBroadcastNotification("🚨 Checkout failed: Insufficient client wallet credits.");
        return;
      }
      setUserWalletBalance(prev => prev - totalCost);
    }

    const newOrder: Order = {
      id: "ord-" + generateRandomId(),
      items: [...cart],
      subtotal: productTotal,
      deliveryFee: platformConfig.baseDeliveryFee,
      commissionFee: parseFloat(((productTotal * platformConfig.commissionRate) / 100).toFixed(2)),
      couponCode: null,
      discountAmount: 0,
      totalAmount: totalCost,
      status: "placed",
      paymentMethod: method,
      address: "Tysons Corner Block C, Dhaka",
      customerName: "Ratul Hasan",
      customerPhone: "01711223344",
      timestamp: new Date().toLocaleTimeString(),
      riderAssigned: null,
      riderRouteProgress: 0,
      chatMessages: [
        { id: "msg-1", text: "Welcome, your gourmet Chef order has been successfully placed!", sender: "restaurant", time: "Just now" }
      ]
    };

    setOrders(prev => [...prev, newOrder]);
    setCart([]); // Reset selection cart
    setCurrentScreen("confirmed");
    handleBroadcastNotification(`New Food Order placed successfully via corporate ${method.toUpperCase()} payment!`);
  };

  // Real-time Chat Communications Sync
  const handleSendChatMessage = (orderId: string, text: string, sender: "customer" | "restaurant" | "rider") => {
    const newMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setOrders(prev => 
      prev.map(o => 
        o.id === orderId 
          ? { ...o, chatMessages: [...o.chatMessages, newMessage] }
          : o
      )
    );
  };

  // Main order status changer logic
  const handleUpdateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(prev => 
      prev.map(order => {
        if (order.id !== orderId) return order;

        let additionalUpdates: Partial<Order> = {};
        
        // Auto assignment of Rider on "out-for-delivery" state change
        if (status === "out-for-delivery") {
          additionalUpdates.riderAssigned = riderState.name;
          additionalUpdates.riderRouteProgress = 25; // advanced
        }

        return {
          ...order,
          status,
          ...additionalUpdates
        };
      })
    );

    // Dynamic global audio alerts or alerts
    handleBroadcastNotification(`Order #${orderId.slice(-6).toUpperCase()} status transitioned to: ${status.toUpperCase()}`);
  };

  // Increasing rider delivery progression coordinate percentage
  const handleIncrementRiderLocation = (orderId: string) => {
    setOrders(prev => 
      prev.map(o => {
        if (o.id !== orderId) return o;
        const nextProgress = Math.min(100, (o.riderRouteProgress || 0) + 25);
        return {
          ...o,
          riderRouteProgress: nextProgress
        };
      })
    );
    handleBroadcastNotification(`Delivery courier is navigating streets (making progression).`);
  };

  // Rider payouts
  const handleRiderEarnMoney = (amount: number) => {
    setRiderState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
  };

  const handleUpdateRiderOnlineStatus = (isOnline: boolean) => {
    setRiderState(prev => ({ ...prev, isOnline }));
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`w-screen min-h-screen font-sans flex flex-col justify-start lg:justify-center items-center p-3 lg:p-8 overflow-y-auto ${
      darkMode ? "bg-[#090b11] text-slate-100" : "bg-gradient-to-br from-[#f1eefd] via-[#e5eafd] to-[#e4eefb] text-slate-900"
    }`}>
      
      {/* 1. MASTER UPPER SWEDISH-STYLED PLATFORM BRAND HEADER */}
      <div className="w-full max-w-7xl flex flex-col items-center justify-between gap-4 mb-4 xl:mb-6 shrink-0 z-10 text-center lg:text-left lg:flex-row px-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2">
            🍕 BILLION-DOLLAR DELIVERIES <span className="bg-purple-600 text-white text-[9px] font-black tracking-tight px-2 py-0.5 rounded-md uppercase">PRO_CONSOLE</span>
          </h1>
          <p className="text-xs font-bold text-slate-500 max-w-lg mt-1 block dark:text-slate-400">
            Perfect side-by-side synchronized simulation. Placing orders updates the Kitchen, flashes the Rider offering, and displays SVG live-progression tracking simultaneously!
          </p>
        </div>

        {/* Small viewport controls */}
        <div className="flex flex-wrap justify-center gap-1.5 bg-slate-200/50 dark:bg-slate-900/60 p-1 rounded-2xl border border-white/20">
          <button 
            onClick={() => setActiveSystemControl("customer")}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${activeSystemControl === "customer" ? "bg-[#010515] text-white" : "text-slate-600 hover:text-black"}`}
          >
            <Smartphone size={12} /> Mobile Phone
          </button>
          <button 
            onClick={() => setActiveSystemControl("restaurant")}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${activeSystemControl === "restaurant" ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-indigo-600"}`}
          >
            <UtensilsCrossed size={12} /> Chef Kitchen
          </button>
          <button 
            onClick={() => setActiveSystemControl("rider")}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${activeSystemControl === "rider" ? "bg-emerald-600 text-white" : "text-slate-600 hover:text-emerald-700"}`}
          >
            <Truck size={12} /> Rider Courier
          </button>
          <button 
            onClick={() => setActiveSystemControl("admin")}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${activeSystemControl === "admin" ? "bg-purple-600 text-white" : "text-slate-600 hover:text-purple-700"}`}
          >
            <ShieldAlert size={12} /> Admin Ledger
          </button>
        </div>
      </div>

      {/* 2. ULTIMATE STAGED DOUBLE-PANEL SIMULATOR CANVAS */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 items-stretch">
        
        {/* ================= LEFT BENTO: PORTABLE SMARTPHONE SIMULATOR ================= */}
        {/* On broad screens we always show customer mobile, or honor the active tabs on mobile */}
        <div className={`col-span-1 lg:col-span-4 flex items-center justify-center ${
          activeSystemControl === "customer" ? "block" : "hidden lg:flex"
        }`}>
          
          {/* PHYSICAL IPHONE DEVICE FRAME CONTAINER */}
          <div className="relative w-full max-w-[350px] sm:max-w-[365px] h-[760px] bg-slate-900 rounded-[52px] p-2.5 shadow-[0_25px_60px_rgba(20,10,50,0.22)] border-[5px] border-neutral-800 flex flex-col justify-between overflow-hidden relative shrink-0">
            
            {/* Real device notch pill */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-between px-2.5 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <div className="w-3.5 h-1 bg-neutral-900 rounded-full" />
            </div>

            {/* Simulated System Status indicators */}
            <div className="absolute top-3 inset-x-0 h-6 px-6 flex justify-between items-center z-40 text-black pr-7 select-none font-sans pointer-events-none">
              <span className={`text-[10px] font-black tracking-tight ${darkMode ? "text-slate-300" : "text-slate-800"}`}>
                09:47
              </span>

              <div className={`flex items-center gap-1 ${darkMode ? "text-slate-300" : "text-slate-800"}`}>
                <Signal size={10} className="opacity-80" />
                <Wifi size={10} className="opacity-80" />
                <div className="flex items-center gap-0.5">
                  <span className="text-[8px] font-black">92%</span>
                  <Battery size={11} className="opacity-90" />
                </div>
              </div>
            </div>

            {/* SCREEN INNER VIEW CANVAS VIEWPORT */}
            <div className={`w-full h-full rounded-[42px] overflow-hidden relative pt-6 pb-2.5 flex flex-col ${
              darkMode ? "bg-slate-950 text-white" : "bg-white text-black"
            }`}>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScreen}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex-1 overflow-hidden"
                >
                  
                  {currentScreen === "onboarding" && (
                     <OnboardingScreen 
                       onGetStarted={() => setCurrentScreen("home")} 
                     />
                  )}

                  {currentScreen === "home" && (
                    <HomeScreen 
                      onSelectItem={handleSelectItem}
                      onAddToCart={handleAddToCart}
                      cartCount={getCartCount()}
                      onGoToCart={() => setCurrentScreen("cart")}
                      menuItems={menuItems}
                      orders={orders}
                      onReorderItems={(reorderItems) => {
                        // Quick populate selections to cart
                        setCart(reorderItems);
                        setCurrentScreen("cart");
                      }}
                      riderState={riderState}
                      onSendChatMessage={handleSendChatMessage}
                      userWalletBalance={userWalletBalance}
                      onTopUpWallet={handleTopUpWallet}
                      darkMode={darkMode}
                      onToggleDarkMode={handleToggleDarkMode}
                      systemNotifications={systemNotifications}
                    />
                  )}

                  {currentScreen === "detail" && (
                    <DetailScreen 
                      item={selectedItem}
                      onBack={() => setCurrentScreen("home")}
                      onAddToCart={handleAddToCart}
                      onGoToCart={() => setCurrentScreen("cart")}
                    />
                  )}

                  {currentScreen === "cart" && (
                    <CartScreen 
                      cart={cart}
                      onBack={() => setCurrentScreen("home")}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onContinue={() => setCurrentScreen("payment")}
                    />
                  )}

                  {currentScreen === "payment" && (
                    <PaymentScreen 
                      totalAmount={getCartTotalAmount()}
                      onBack={() => setCurrentScreen("cart")}
                      userWalletBalance={userWalletBalance}
                      onPlaceOrder={(paymentMethod) => handlePlaceOrderWithPayment(paymentMethod)}
                    />
                  )}

                  {currentScreen === "confirmed" && (
                    <ConfirmedScreen 
                      onBackToHome={() => setCurrentScreen("home")} 
                    />
                  )}

                </motion.div>
              </AnimatePresence>

              {/* Physical home pill indicator */}
              <div className="absolute bottom-1 px-12 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-50">
                <div className={`w-28 h-1 rounded-full ${darkMode ? "bg-white/30" : "bg-black/25"}`} />
              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT BENTO: CENTRAL BACKEND WORKPLACE CONSOLE ================= */}
        {/* On broader screens, this holds the tabbed views of Restaurant, Rider, and Admin dashboards */}
        <div className={`col-span-1 lg:col-span-8 flex flex-col justify-start rounded-[32px] overflow-hidden border border-white/20 p-1  ${
          darkMode ? "bg-[#0d101d]" : "bg-white/60 shadow-xl"
        } ${
          activeSystemControl === "customer" ? "hidden lg:flex" : "flex"
        }`}>
          
          {/* Quick desktop operations tabs selectors */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-t-[26px]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-black text-xs uppercase tracking-wider">
                Multi-Portal Backend Simulator
              </h3>
            </div>

            <div className="hidden sm:flex gap-1.5 bg-slate-800 p-1 rounded-xl">
              <button 
                onClick={() => setActiveSystemControl("restaurant")}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeSystemControl === "restaurant" ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                🍳 Chef Panel
              </button>
              
              <button 
                onClick={() => setActiveSystemControl("rider")}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeSystemControl === "rider" ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                🛵 Rider Dispatched
              </button>

              <button 
                onClick={() => setActiveSystemControl("admin")}
                className={`px-3 py-1.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeSystemControl === "admin" ? "bg-purple-600 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                🛡️ Master Admin
              </button>
            </div>
          </div>

          {/* Interactive Live Screen Box */}
          <div className="flex-1 min-h-[580px] h-[660px] relative overflow-hidden bg-slate-100">
            
            <AnimatePresence mode="wait">
              
              {/* portal A: CHEF KITCHEN Cockpit */}
              {activeSystemControl === "restaurant" && (
                <motion.div 
                  key="restaurant"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <RestaurantPortal 
                    menuItems={menuItems}
                    orders={orders}
                    onAddNewMenuItem={handleAddNewMenuItem}
                    onToggleMenuItemAvailability={handleToggleMenuItemAvailability}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onSendChatMessage={handleSendChatMessage}
                  />
                </motion.div>
              )}

              {/* portal B: DELIVERY RIDER Dispatch Courier App */}
              {activeSystemControl === "rider" && (
                <motion.div 
                  key="rider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <RiderDispatch 
                    orders={orders}
                    riderState={riderState}
                    onUpdateRiderOnlineStatus={handleUpdateRiderOnlineStatus}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                    onIncrementRiderLocation={handleIncrementRiderLocation}
                    onSendChatMessage={handleSendChatMessage}
                    onRiderEarnMoney={handleRiderEarnMoney}
                  />
                </motion.div>
              )}

              {/* portal C: EXECUTIVE CONTROL ADMIN LEDGER */}
              {activeSystemControl === "admin" && (
                <motion.div 
                  key="admin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <AdminPanel 
                    orders={orders}
                    menuItems={menuItems}
                    riderState={riderState}
                    platformConfig={platformConfig}
                    onUpdatePlatformConfig={(config) => setPlatformConfig(prev => ({ ...prev, ...config }))}
                    onBroadcastNotification={handleBroadcastNotification}
                    couponCodes={couponCodes}
                    onAddNewCoupon={handleAddNewCoupon}
                    onDeleteCoupon={handleDeleteCoupon}
                    notificationLogs={systemNotifications}
                  />
                </motion.div>
              )}

              {/* FALLBACK: IF CUSTOMER SELECTION ACCIDENTALLY LEAKS TO WORKSPACE BOX ON LARGE DESKTOP */}
              {activeSystemControl === "customer" && (
                <motion.div 
                  key="customer-welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center bg-[#070913] text-white p-8 text-center"
                >
                  <div className="max-w-md space-y-4">
                    <span className="text-4xl">📱</span>
                    <h3 className="text-lg font-black uppercase tracking-wider">Mobile Device Selected</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You are inspecting Customer Mobile emulator on the left. Use the top menu options to launch the **Cooking Chef Kitchen (Egg/Bacon) Dashboard**, **Rider motorcycle Map**, or **Executive Financial Ledger** inside this workspace screen directly!
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      <button 
                        onClick={() => setActiveSystemControl("restaurant")}
                        className="bg-indigo-600 hover:bg-indigo-750 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-transform"
                      >
                        🍳 Try Chef Kitchen
                      </button>
                      <button 
                        onClick={() => setActiveSystemControl("rider")}
                        className="bg-emerald-600 hover:bg-emerald-750 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-transform"
                      >
                        🛵 Try Rider Dispatch
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Console Ledger bottom status rail footer */}
          <div className="bg-slate-900 text-slate-400 p-3 flex justify-between items-center text-[10px] font-mono border-t border-slate-800 rounded-b-[24px]">
            <span className="flex items-center gap-1.5"><Database size={11} className="text-purple-400" /> API: @google/genai-online</span>
            <span className="flex items-center gap-1"><Coins size={11} className="text-yellow-400" /> Platform Fee: {platformConfig.commissionRate}% comms</span>
          </div>

        </div>

      </div>

    </div>
  );
}
