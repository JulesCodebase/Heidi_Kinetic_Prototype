import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, Shield, CreditCard, Coins, ArrowRight } from 'lucide-react';

const Membership: React.FC = () => {
  const { user } = useApp();
  const [tokensToApply, setTokensToApply] = useState(0);

  const SUBSCRIPTION_COST = 99.00;
  const DISCOUNT_PER_TOKEN = 2.00;
  const MAX_DISCOUNT_PERCENT = 0.40; // Max 40% off to keep business viable
  
  const maxDiscountAmount = SUBSCRIPTION_COST * MAX_DISCOUNT_PERCENT;
  const maxTokensUsable = Math.floor(maxDiscountAmount / DISCOUNT_PER_TOKEN);
  const availableTokens = Math.floor(user.tokens);
  
  // Cap tokens based on user balance and max allow discount
  const effectiveMaxTokens = Math.min(availableTokens, maxTokensUsable);

  const currentDiscount = tokensToApply * DISCOUNT_PER_TOKEN;
  const finalPrice = SUBSCRIPTION_COST - currentDiscount;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Network Membership</h2>
        <p className="text-slate-500">Manage your subscription and apply token rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Plan Details Card */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">Professional Plan</h3>
                <p className="text-slate-400 text-sm mt-1">Full Network Access</p>
              </div>
              <Shield className="w-8 h-8 text-teal-400" />
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span>Unlimited Record Browsing</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span>Advanced Network Insights</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-teal-600" />
                <span>Priority Record Verification</span>
              </li>
            </ul>
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-1">
                 <span className="text-slate-500 font-medium">Monthly Cost</span>
                 <span className="text-2xl font-bold text-slate-900">${SUBSCRIPTION_COST.toFixed(2)}</span>
               </div>
               <p className="text-xs text-slate-400 text-right">Billed monthly. Cancel anytime.</p>
            </div>
          </div>
        </div>

        {/* Token Discount Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-amber-100 p-2 rounded-lg">
                 <Coins className="w-6 h-6 text-amber-600" />
               </div>
               <div>
                 <h4 className="font-bold text-slate-900">Token Rewards</h4>
                 <p className="text-sm text-slate-600">You have {user.tokens.toFixed(1)} tokens available.</p>
               </div>
             </div>
             
             <div className="mb-4">
               <label className="block text-sm font-medium text-slate-700 mb-2">
                 Apply tokens for discount
               </label>
               <input 
                 type="range" 
                 min="0" 
                 max={effectiveMaxTokens} 
                 value={tokensToApply}
                 onChange={(e) => setTokensToApply(parseInt(e.target.value))}
                 className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
               />
               <div className="flex justify-between text-xs text-slate-500 mt-2">
                 <span>0 Tokens</span>
                 <span>{effectiveMaxTokens} Tokens (Max)</span>
               </div>
             </div>

             <div className="bg-white rounded-lg p-4 border border-amber-100">
               <div className="flex justify-between text-sm mb-2">
                 <span className="text-slate-600">Base Price</span>
                 <span className="text-slate-900">${SUBSCRIPTION_COST.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm mb-2 text-green-600 font-medium">
                 <span>Token Discount (-{tokensToApply}t)</span>
                 <span>-${currentDiscount.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                 <span className="font-bold text-slate-800">Total Due</span>
                 <span className="text-xl font-bold text-slate-900">${finalPrice.toFixed(2)}</span>
               </div>
             </div>

             <button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
               <CreditCard className="w-4 h-4" />
               Pay Subscription
             </button>
             
             {effectiveMaxTokens < availableTokens && (
               <p className="text-xs text-slate-400 mt-3 text-center">
                 *Discount capped at 40% to maintain network viability.
               </p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;