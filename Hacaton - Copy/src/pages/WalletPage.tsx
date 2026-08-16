import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Clock, CheckCircle2, X
} from 'lucide-react';
import QRCode from 'qrcode';
import { useAuth } from '../context/AuthContext';
import { dbService } from '../lib/supabase';
import type { WalletTransaction, Reward, RewardRedemption } from '../types';

export const WalletPage: React.FC = () => {
  const { user, refreshProfile, updateUserBalance } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'credited' | 'redeemed'>('all');
  
  // Redemption State
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState<boolean>(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState<RewardRedemption | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadData = async () => {
    try {
      const txs = await dbService.getTransactions();
      setTransactions(txs);

      const rws = await dbService.getRewards();
      setRewards(rws);
    } catch (err) {
      console.error('Failed to load wallet data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter transactions by tab
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab === 'credited') return tx.type === 'credited';
    if (activeTab === 'redeemed') return tx.type === 'redeemed';
    return true;
  });

  // Handle Reward Redemption
  const handleRedeem = async (reward: Reward) => {
    setErrorMsg('');
    if ((user?.eco_credits || 0) < reward.cost_credits) {
      setErrorMsg(`Insufficient EcoCredits. You need ${reward.cost_credits} CR but have ${user?.eco_credits || 0} CR.`);
      return;
    }

    setIsRedeeming(true);
    try {
      const { redemption, newBalance } = await dbService.redeemReward(reward.id);
      
      // Generate QR Code data URL for staff scanning
      const qrDataUrl = await QRCode.toDataURL(redemption.redemption_code, {
        width: 250,
        margin: 2,
        color: { dark: '#09291F', light: '#FFFFFF' }
      });
      setQrCodeUrl(qrDataUrl);

      updateUserBalance(newBalance);
      setRedemptionSuccess(redemption);
      setSelectedReward(reward);
      await loadData();
      await refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || 'Redemption failed. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-serif">
      
      {/* 1. PREMIUM ECOCREDIT BALANCE CARD */}
      <div className="relative bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-[#E6C65C] tracking-widest uppercase block mb-1">
              CAMPUS REWARDS WALLET
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-wide">
              EcoCredit Ledger
            </h1>
            <p className="text-xs text-[#E8E8E8]/80 mt-1">
              Earned through verified waste segregation across campus bins.
            </p>
          </div>

          {/* Balance Display */}
          <div className="bg-[#09291F] border-2 border-[#D4AF37] rounded-2xl p-6 shadow-xl min-w-[260px] text-center sm:text-right">
            <span className="text-xs font-bold text-[#E8E8E8]/70 block mb-1">AVAILABLE BALANCE</span>
            <div className="flex items-baseline justify-center sm:justify-end space-x-2">
              <span className="text-5xl font-bold text-[#D4AF37] tracking-tight">
                {user?.eco_credits || 0}
              </span>
              <span className="text-lg font-bold text-[#E6C65C]">EcoCredits</span>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-500/50 rounded-2xl text-xs text-red-200 text-center flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')} className="text-red-400 font-bold ml-2">Dismiss</button>
        </div>
      )}

      {/* 2. CAMPUS REWARDS STORE GRID */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <span>Campus Rewards Marketplace</span>
            </h2>
            <p className="text-xs text-[#E8E8E8]/80 mt-0.5">
              Redeem EcoCredits for instant campus vouchers, printing quotas, and merchandise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => {
            const canAfford = (user?.eco_credits || 0) >= reward.cost_credits;
            return (
              <div 
                key={reward.id}
                className="bg-[#09291F] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl overflow-hidden flex flex-col justify-between transition-all hover:scale-[1.02] shadow-xl"
              >
                <div>
                  <img src={reward.image_url} alt={reward.name} className="w-full h-36 object-cover border-b border-[#D4AF37]/30" />
                  <div className="p-5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                      {reward.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2 mb-1">{reward.name}</h3>
                    <p className="text-xs text-[#E8E8E8]/70 leading-relaxed">{reward.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-[#D4AF37]/20 mt-3">
                  <div>
                    <span className="text-lg font-bold text-[#D4AF37]">{reward.cost_credits}</span>
                    <span className="text-xs text-[#E6C65C] ml-1">Credits</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || isRedeeming}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                      canAfford
                        ? 'eco-gold-gradient text-[#09291F] hover:scale-105'
                        : 'bg-[#0F3A2D] text-white/40 border border-white/10 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher' : 'Insufficient Credits'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TRANSACTION HISTORY SECTION */}
      <div className="bg-[#0F3A2D] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span>EcoCredit Transaction History</span>
            </h2>
            <p className="text-xs text-[#E8E8E8]/80 mt-0.5">
              Complete audit ledger of credited waste disposals and redeemed vouchers.
            </p>
          </div>

          {/* Filter Tabs: All / Credited / Redeemed */}
          <div className="flex bg-[#09291F] border border-[#D4AF37]/40 rounded-xl p-1">
            {(['all', 'credited', 'redeemed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  activeTab === tab ? 'bg-[#D4AF37] text-[#09291F]' : 'text-[#E8E8E8]/70 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / Rows */}
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <p className="text-xs text-[#E8E8E8]/60 text-center py-8">No transactions found for selected filter.</p>
          ) : (
            filteredTransactions.map((tx) => (
              <div 
                key={tx.id}
                className="p-4 bg-[#09291F] border border-[#D4AF37]/20 rounded-2xl flex items-center justify-between hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    tx.type === 'credited' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                  }`}>
                    {tx.type === 'credited' ? '+' : '-'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{tx.description}</h4>
                    <p className="text-[11px] text-[#E8E8E8]/60 mt-0.5">
                      {new Date(tx.created_at).toLocaleString()} • Status: <span className="text-emerald-400 capitalize">{tx.status}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-base font-bold ${tx.type === 'credited' ? 'text-[#D4AF37]' : 'text-amber-400'}`}>
                    {tx.type === 'credited' ? `+${tx.amount}` : `-${tx.amount}`} CR
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* REDEMPTION SUCCESS QR MODAL */}
      {redemptionSuccess && selectedReward && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F3A2D] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative">
            <button
              onClick={() => { setRedemptionSuccess(null); setSelectedReward(null); }}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#09291F] border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">Voucher Redeemed!</h3>
              <p className="text-xs text-[#E6C65C] mt-1">{selectedReward.name}</p>
            </div>

            {/* Generated QR Code for Staff */}
            <div className="bg-white p-4 rounded-2xl inline-block border-2 border-[#D4AF37]">
              {qrCodeUrl && <img src={qrCodeUrl} alt="Redemption QR Code" className="w-48 h-48 mx-auto" />}
            </div>

            <div className="bg-[#09291F] border border-[#D4AF37]/30 rounded-xl p-3">
              <span className="text-[10px] text-[#E8E8E8]/60 block uppercase tracking-wider">ONE-TIME STAFF CODE</span>
              <code className="text-base font-bold text-[#D4AF37] tracking-widest">{redemptionSuccess.redemption_code}</code>
            </div>

            <p className="text-xs text-[#E8E8E8]/80 leading-relaxed">
              Show this QR code or 6-digit verification code to the campus canteen/library staff to claim your reward.
            </p>

            <button
              onClick={() => { setRedemptionSuccess(null); setSelectedReward(null); }}
              className="w-full py-3 rounded-xl eco-gold-gradient text-[#09291F] font-bold text-sm shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
