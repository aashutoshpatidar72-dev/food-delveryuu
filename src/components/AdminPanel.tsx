import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Users, 
  Ticket, 
  Settings2, 
  Volume2, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Sliders, 
  PlusCircle, 
  Trash2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { FoodItem, Order, PlatformConfig, RiderState } from "../types";

interface AdminPanelProps {
  orders: Order[];
  menuItems: FoodItem[];
  riderState: RiderState;
  platformConfig: PlatformConfig;
  onUpdatePlatformConfig: (config: Partial<PlatformConfig>) => void;
  onBroadcastNotification: (announcement: string) => void;
  couponCodes: { code: string; discountRate: number }[];
  onAddNewCoupon: (code: string, rate: number) => void;
  onDeleteCoupon: (code: string) => void;
  notificationLogs: string[];
}

export default function AdminPanel({
  orders,
  menuItems,
  riderState,
  platformConfig,
  onUpdatePlatformConfig,
  onBroadcastNotification,
  couponCodes,
  onAddNewCoupon,
  onDeleteCoupon,
  notificationLogs
}: AdminPanelProps) {
  const [activeMenu, setActiveMenu] = useState<"overview" | "users" | "restaurants" | "coupons" | "broadcast" | "settings">("overview");
  const [newPromo, setNewPromo] = useState("");
  const [newPromoRate, setNewPromoRate] = useState("10"); // percent
  const [systemAlertMessage, setSystemAlertMessage] = useState("");

  // Platform gross computations
  const totalSubtotals = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.subtotal, 0);

  const totalCommissionsEarned = orders
    .filter(o => o.status === "delivered")
    .reduce((sum, o) => sum + o.commissionFee, 0);

  const successfulDeliveries = orders.filter(o => o.status === "delivered").length;
  const activePreparingOrdersNum = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length;

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo) return;
    const rateValue = parseFloat(newPromoRate) / 100 || 0.10;
    onAddNewCoupon(newPromo.trim().toUpperCase(), rateValue);
    setNewPromo("");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemAlertMessage) return;
    onBroadcastNotification(systemAlertMessage.trim());
    setSystemAlertMessage("");
  };

  return (
    <div className="w-full h-full bg-[#faefff]/40 flex flex-col font-sans overflow-hidden text-slate-800 select-none">
      
      {/* Top Luxury Command Bar */}
      <div className="bg-[#1e152a] text-white p-5 flex flex-col md:flex-row md:items-center justify-between border-b border-purple-950/45 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="font-display font-black text-md tracking-tight flex items-center gap-2">
              BillionStartup HQ Ops <span className="bg-purple-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest animate-pulse">Master Admin</span>
            </h1>
            <p className="text-purple-300/60 text-xs font-bold font-mono">Platform Admin Controls • Standard Latency: 0.04 ms</p>
          </div>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex flex-wrap gap-1 mt-4 md:mt-0 bg-purple-950/40 p-1 rounded-xl border border-purple-900/40">
          {(["overview", "users", "restaurants", "coupons", "broadcast", "settings"] as const).map(tab => {
            const isSel = activeMenu === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveMenu(tab)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isSel 
                    ? "bg-[#6c4fb9] text-white shadow-md border border-purple-400/20" 
                    : "text-purple-300 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Administrative Screens canvas */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 text-left">
        
        {activeMenu === "overview" && (
          <div className="space-y-6">
            
            {/* Core financial ledgers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-purple-200/50 p-5 rounded-3xl shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Gross Order Inflow</span>
                <h2 className="text-2xl font-black text-slate-900">${totalSubtotals.toFixed(2)}</h2>
                <p className="text-[10px] text-slate-400">All checkout orders in pipeline</p>
              </div>

              <div className="bg-white border border-purple-200/50 p-5 rounded-3xl shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Commissions Earned</span>
                <h2 className="text-2xl font-black text-purple-600">${totalCommissionsEarned.toFixed(2)}</h2>
                <p className="text-[10px] text-emerald-500 font-black">+{(platformConfig.commissionRate * 100).toFixed(0)}% Rate setting yield</p>
              </div>

              <div className="bg-white border border-purple-200/50 p-5 rounded-3xl shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Deliveries Completed</span>
                <h2 className="text-2xl font-black text-slate-900">{successfulDeliveries} Successful</h2>
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-emerald-600 font-black">LIVESTREAM ACTIVE</span>
                </div>
              </div>

              <div className="bg-white border border-purple-200/50 p-5 rounded-3xl shadow-xs space-y-1">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Active cooking stove</span>
                <h2 className="text-2xl font-black text-amber-600">{activePreparingOrdersNum} Orders</h2>
                <p className="text-[10px] text-slate-400">Preparation status synced live</p>
              </div>
            </div>

            {/* Platform metrics SVG Scatter plot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="col-span-2 bg-white border border-purple-200/40 rounded-3xl p-5 space-y-4 shadow-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-sm font-display text-slate-900">Weekly System Inflow Yield</h3>
                    <p className="text-slate-450 text-xs text-slate-400">Synchronized hourly log indices</p>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-[#6c4fb9] font-black px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-widest font-mono">
                    Real-time SVG Output
                  </span>
                </div>

                <div className="w-full h-44 border border-slate-100 rounded-2xl bg-slate-50 relative flex items-end p-2 px-5 pb-6">
                  {/* Scatter plotting lines SVGs */}
                  <svg className="absolute inset-0 w-full h-full p-2 text-purple-500/25 pointer-events-none" viewBox="0 0 400 150">
                    <path d="M 10,130 Q 80,40 150,110 T 290,20 T 390,70" fill="none" stroke="#6c4fb9" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="10" cy="130" r="4" fill="#6c4fb9" />
                    <circle cx="80" cy="80" r="4" fill="#6c4fb9" />
                    <circle cx="150" cy="110" r="4" fill="#6c4fb9" />
                    <circle cx="290" cy="20" r="4" fill="#ff7a00" />
                    <circle cx="390" cy="70" r="4" fill="#6c4fb9" />
                  </svg>

                  <div className="absolute inset-x-0 bottom-1 flex justify-between px-4 text-[9px] text-slate-400 font-mono">
                    <span>Mon 12am</span>
                    <span>Wed 3pm</span>
                    <span>Fri 6pm</span>
                    <span>Sun 11pm</span>
                  </div>
                </div>
              </div>

              {/* Settings Core control widgets */}
              <div className="bg-white border border-purple-200/40 rounded-3xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-150/60 pb-2">
                    <Sliders size={14} className="text-purple-500" /> Commission Slider
                  </h4>

                  <div className="space-y-1 block">
                    <div className="flex justify-between text-xs font-extrabold text-slate-700">
                      <span>Rate setting (%)</span>
                      <span className="text-[#6c4fb9]">{(platformConfig.commissionRate * 100).toFixed(0)}%</span>
                    </div>
                    
                    <input 
                      type="range" 
                      min="0.05" 
                      max="0.30" 
                      step="0.01"
                      value={platformConfig.commissionRate}
                      onChange={(e) => onUpdatePlatformConfig({ commissionRate: parseFloat(e.target.value) })}
                      className="w-fullaccent-purple-600 cursor-pointer h-1 bg-slate-100 rounded-lg outline-none"
                    />
                    <span className="text-[10px] text-slate-400 leading-snug font-semibold block">Applies immediately to new completed orders!</span>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-3.5 border border-purple-100 text-[11px] text-[#6c4fb9] font-bold mt-4">
                  💡 High Commission Slider decreases Net Chef revenue, but yields bigger platform gains for BillionStartup HQ!
                </div>
              </div>
            </div>

            {/* Quick action logs */}
            <div className="bg-white border border-purple-200/40 rounded-3xl p-5 space-y-3 shadow-xs">
              <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider">Recent Active Orders Ledgers</h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar text-xs font-bold text-slate-600">
                {orders.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No transactions on platform ledger yet.</p>
                ) : (
                  orders.map(o => (
                    <div key={o.id} className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                      <div className="space-y-0.5">
                        <span className="font-mono text-slate-400 font-blue">#{o.id.slice(-6).toUpperCase()}</span>
                        <p className="text-slate-800">{o.customerName} ordered via {o.paymentMethod.toUpperCase()}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-slate-800">${o.totalAmount.toFixed(2)}</span>
                        <span className={`text-[9px] block uppercase font-mono tracking-wider ${o.status === "delivered" ? "text-emerald-500" : o.status === "cancelled" ? "text-rose-500" : "text-amber-500"}`}>
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

        {activeMenu === "users" && (
          <div className="space-y-6">
            <div className="bg-white border border-purple-200/40 p-4 rounded-2xl flex justify-between items-center shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Users size={18} className="text-purple-500" /> Platform Accounts Registry
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Verify simulated user ratings and ride catalogs</p>
              </div>
            </div>

            {/* Group Grid lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Users */}
              <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-purple-600 pb-2 border-b border-purple-100">Customer profiles catalog (Emulator linked)</h4>
                
                <div className="space-y-2 text-xs font-extrabold text-slate-700">
                  <div className="flex justify-between items-center p-2 border border-slate-50 rounded-xl hover:bg-slate-50">
                    <div>
                      <span>Ratul Hasan (Dhaka Recipient)</span>
                      <p className="text-[10px] text-slate-400 leading-none">Status: Premium Diner</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded-full text-[9px]">ACTIVE</span>
                  </div>

                  <div className="flex justify-between items-center p-2 border border-slate-50 rounded-xl">
                    <div>
                      <span>Noreen Karim (Uttara Sector)</span>
                      <p className="text-[10px] text-slate-400 leading-none">Status: Food Reviewer</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-700 font-[#257545] font-black px-2 py-0.5 rounded-full text-[9px]">ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* Riders info */}
              <div className="bg-white p-4 rounded-2xl border border-slate-150 space-y-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-purple-600 pb-2 border-b border-purple-100">Riders Dispatch logs (Simulator dynamic)</h4>
                
                <div className="space-y-2.5 text-xs font-extrabold text-slate-700">
                  <div className="flex justify-between items-center p-2 border border-slate-50 rounded-xl">
                    <div className="space-y-0.5">
                      <span>{riderState.name} ({riderState.vehicle})</span>
                      <p className="text-[10px] text-slate-400">Wallet balance accrued: ${riderState.walletBalance.toFixed(2)}</p>
                    </div>
                    <span className={`font-black px-2 py-0.5 rounded-full text-[9px] ${riderState.isOnline ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {riderState.isOnline ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "restaurants" && (
          <div className="space-y-6">
            <div className="bg-white border border-purple-200/40 p-4 rounded-2xl flex justify-between items-center shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Building2 size={18} className="text-[#6c4fb9]" /> Restaurant Approvals registry
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Operational authorization panel</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-2xl p-4 text-xs font-bold text-slate-700 space-y-3">
              <div className="flex justify-between items-center p-2.5 border-b border-slate-50">
                <div className="space-y-0.5">
                  <span>Billion Food Kitchen BD ( ঢাকার রন্ধনশালা )</span>
                  <p className="text-[10px] text-slate-400">Total list catalogue items count: {menuItems.length} items live</p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 font-extrabold px-3 py-1 rounded-full text-[10px]">VERIFIED STORE</span>
              </div>
            </div>
          </div>
        )}

        {activeMenu === "coupons" && (
          <div className="space-y-6">
            <div className="bg-white border border-purple-200/40 p-4 rounded-2xl flex justify-between items-center shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Ticket size={18} className="text-purple-500" /> Platform Coupon Management
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Add customizable vouchers instantly reflecting in user checkout inputs</p>
              </div>
            </div>

            {/* Add coupon form */}
            <form onSubmit={handleCreateCoupon} className="bg-white p-4 rounded-2xl border border-slate-150 flex flex-col md:flex-row gap-3">
              <input
                type="text"
                required
                placeholder="e.g. BillionBonus"
                value={newPromo}
                onChange={(e) => setNewPromo(e.target.value)}
                className="flex-grow h-10 px-3 border border-slate-200 rounded-xl text-xs font-black uppercase outline-none focus:border-purple-600"
              />
              <select
                value={newPromoRate}
                onChange={(e) => setNewPromoRate(e.target.value)}
                className="h-10 px-2.5 border border-slate-200 bg-white rounded-xl text-xs font-black outline-none focus:border-purple-600"
              >
                <option value="10">10% Off</option>
                <option value="25">25% Off Combo</option>
                <option value="50">50% Half Price</option>
                <option value="70">70% Giant Cut</option>
              </select>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer py-2"
              >
                Create Code
              </button>
            </form>

            <div className="bg-white border border-slate-150 rounded-2xl p-4 space-y-3 text-xs font-bold">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-widest pl-1">Active Coupon vouchers database</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {couponCodes.map(promo => (
                  <div key={promo.code} className="p-3 border border-purple-100 bg-purple-50/40 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-black text-slate-900 block font-mono uppercase">{promo.code}</span>
                      <span className="text-[10px] text-[#6c4fb9] font-extrabold">{(promo.discountRate * 100).toFixed(0)}% Checkout deduction</span>
                    </div>

                    <button 
                      onClick={() => onDeleteCoupon(promo.code)}
                      className="text-slate-400 hover:text-red-600 active:scale-90 transition-transform cursor-pointer"
                      title="Delete code"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === "broadcast" && (
          <div className="space-y-6">
            <div className="bg-white border border-purple-200/40 p-4 rounded-2xl flex justify-between items-center shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Volume2 size={18} className="text-purple-500" /> Push Notification Broadcaster
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Blast announcements directly into active customer & restaurant screens</p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="bg-white p-5 rounded-3xl border border-slate-150 space-y-3 shadow-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Announcement Alert Message</label>
                <textarea
                  required
                  rows={2}
                  maxLength={160}
                  placeholder="e.g. 📢 Heavy monsoon rain outside Dhaka. Deliveries might see brief safety delays! Dynamic compensations active."
                  value={systemAlertMessage}
                  onChange={(e) => setSystemAlertMessage(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-purple-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-purple-600 hover:bg-[#6c4fb9] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                📡 Broadcast System Alert
              </button>
            </form>

            {/* Broadcast log records */}
            <div className="bg-white border border-slate-150 rounded-2xl p-4 space-y-2.5 text-xs font-medium">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest pl-1 text-[10px]">Previously Broadcasted Logs</h4>
              
              <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar font-sans">
                {notificationLogs.length === 0 ? (
                  <p className="text-slate-400 font-semibold italic text-center py-4">No announcement bulletins logged yet.</p>
                ) : (
                  notificationLogs.map((log, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex gap-2">
                      <span className="text-purple-500 font-bold shrink-0">📡</span>
                      <p className="text-slate-700 font-bold">{log}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeMenu === "settings" && (
          <div className="space-y-6">
            <div className="bg-white border border-purple-200/40 p-4 rounded-2xl flex justify-between items-center shadow-xs">
              <div>
                <h3 className="font-black text-base text-slate-900 flex items-center gap-1.5">
                  <Settings2 size={18} className="text-purple-500" /> Platform settings parameters
                </h3>
                <p className="text-slate-400 text-xs font-semibold">Tweak standard billing, themes, or algorithm parameters</p>
              </div>
            </div>

            <div className="bg-white border border-slate-150 rounded-3xl p-5 space-y-4 shadow-xs text-xs font-bold text-slate-700">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span>AI Recommendations Engine</span>
                  <p className="text-[10px] text-slate-400 leading-none">Increases personalized food suggestions yields</p>
                </div>

                <button 
                  onClick={() => onUpdatePlatformConfig({ enableAiRecommender: !platformConfig.enableAiRecommender })}
                  className="active:scale-90 transition-transform cursor-pointer"
                  title="Toggle AI logic"
                >
                  <span className={`px-3 py-1.5 rounded-xl font-black text-[9px] uppercase ${
                    platformConfig.enableAiRecommender ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {platformConfig.enableAiRecommender ? "Enabled" : "Disabled"}
                  </span>
                </button>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span>Standard Delivery Base Fee ($)</span>
                  <p className="text-[10px] text-slate-400 leading-none">Baseline fee evaluated on checkouts</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const newFee = Math.max(0, platformConfig.baseDeliveryFee - 0.50);
                      onUpdatePlatformConfig({ baseDeliveryFee: newFee });
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-black w-10 text-center">${platformConfig.baseDeliveryFee.toFixed(2)}</span>
                  <button
                    onClick={() => {
                      const newFee = platformConfig.baseDeliveryFee + 0.50;
                      onUpdatePlatformConfig({ baseDeliveryFee: newFee });
                    }}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
