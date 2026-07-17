'use client'

import { motion } from 'framer-motion'
import { Gift, Droplets, Trophy, CheckCircle2, Star, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RewardsPage() {
  const points = 450 // Mock points for UI
  const nextTier = 1000
  const progress = (points / nextTier) * 100

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0c2340]">TajRewards</h2>
        <p className="text-[#4a7fa5] text-sm mt-1">Earn points for every delivery and unlock exclusive perks.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 bg-gradient-to-br from-[#0097a7] to-[#1565c0] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-[#0097a7]/20">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
          
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center sm:items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-amber-300 tracking-wider text-sm uppercase">Gold Tier</span>
              </div>
              <p className="text-5xl font-extrabold mb-1">{points}</p>
              <p className="text-[#b3e5fc] text-sm">Available Points</p>
            </div>
            
            <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
              <div className="flex justify-between text-xs text-[#b3e5fc] mb-2 font-medium">
                <span>Gold Tier</span>
                <span>Platinum Tier ({nextTier} pts)</span>
              </div>
              <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${progress}%` }} 
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
                />
              </div>
              <p className="text-xs text-[#b3e5fc] mt-3 text-center sm:text-right">
                Earn <span className="font-bold text-white">{nextTier - points}</span> more points to upgrade!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-[#cce7f0] p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#e0f7fa] flex items-center justify-center mb-4">
            <Gift className="w-8 h-8 text-[#0097a7]" />
          </div>
          <h3 className="font-bold text-[#0c2340] mb-2">Redeem Points</h3>
          <p className="text-[#4a7fa5] text-xs mb-6">Use your points for free water jugs, merch, or discounts.</p>
          <Button className="w-full bg-[#0097a7] hover:bg-[#006064] text-white rounded-xl">
            View Rewards
          </Button>
        </motion.div>
      </div>

      <div>
        <h3 className="font-extrabold text-[#0c2340] mb-4">How to Earn</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-[#cce7f0] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#e0f7fa] flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6 text-[#0097a7]" />
            </div>
            <div>
              <p className="font-bold text-[#0c2340]">Order Water</p>
              <p className="text-xs text-[#4a7fa5]">Earn 10 points per 5-gallon jug.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#cce7f0] p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#e0f7fa] flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-[#0097a7]" />
            </div>
            <div>
              <p className="font-bold text-[#0c2340]">Leave a Review</p>
              <p className="text-xs text-[#4a7fa5]">Earn 50 points for a Google Review.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
