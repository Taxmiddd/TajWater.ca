'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Building, DollarSign, Truck, Users, CheckCircle2, Star, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const benefits = [
  {
    icon: DollarSign,
    title: 'High Retail Margins',
    description: 'Enjoy competitive wholesale pricing that allows for excellent retail margins without sacrificing quality.',
  },
  {
    icon: Truck,
    title: 'Reliable Local Delivery',
    description: 'Consistent, scheduled deliveries directly to your storefront or warehouse in Metro Vancouver.',
  },
  {
    icon: CheckCircle2,
    title: 'Premium Quality Water',
    description: 'Offer your customers the best tasting, rigorously tested spring, alkaline, and distilled water.',
  },
  {
    icon: Users,
    title: 'Dedicated Account Manager',
    description: 'Get a dedicated rep to handle your inventory, delivery needs, and customer support.',
  },
]

export default function SellTajWaterPage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    estimatedVolume: ''
  })
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')
    
    const { error } = await supabase.from('wholesale_applications').insert([{
      first_name: formData.firstName,
      last_name: formData.lastName,
      business_name: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      business_type: formData.businessType,
      estimated_volume: formData.estimatedVolume ? parseInt(formData.estimatedVolume) : null,
      status: 'pending'
    }])

    if (error) {
      console.error(error)
      setErrorMsg('Something went wrong. Please try again.')
      setFormState('idle')
    } else {
      setFormState('success')
      setFormData({ firstName: '', lastName: '', businessName: '', email: '', phone: '', businessType: '', estimatedVolume: '' })
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[#f0f9ff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0097a7]/10 to-[#1565c0]/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white text-[#0097a7] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#cce7f0] shadow-sm">
              <Building className="w-4 h-4" /> B2B Wholesale Partnership
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0c2340] tracking-tight mb-6">
              Partner with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0097a7] to-[#1565c0]">TajWater</span>
            </h1>
            <p className="mt-4 text-xl text-[#4a7fa5] max-w-2xl mx-auto mb-10">
              Join our growing network of retailers, gyms, offices, and distributors. Offer your customers premium hydration while growing your bottom line.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Info & Benefits */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-3xl font-extrabold text-[#0c2340] mb-8">Why Sell TajWater?</h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon
                return (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-[#cce7f0] shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-[#e0f7fa] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#0097a7]" />
                    </div>
                    <h3 className="font-bold text-[#0c2340] mb-2">{benefit.title}</h3>
                    <p className="text-sm text-[#4a7fa5]">{benefit.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-br from-[#0097a7] to-[#1565c0] rounded-3xl p-8 text-white">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 text-amber-300 fill-amber-300" />)}
              </div>
              <p className="text-lg font-medium italic mb-6">
                "Since switching our gym's water supply to TajWater, our members have noticed the difference. The alkaline water sells out every week, and the delivery team is always on time."
              </p>
              <div>
                <p className="font-bold">Sarah Jenkins</p>
                <p className="text-[#b3e5fc] text-sm">Owner, Fitness Plus Vancouver</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Application Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-3xl border border-[#cce7f0] shadow-xl p-8 md:p-10 sticky top-24">
              <h3 className="text-2xl font-bold text-[#0c2340] mb-2">Apply for Wholesale</h3>
              <p className="text-[#4a7fa5] text-sm mb-8">Fill out the form below and our B2B team will contact you within 24 hours.</p>
              
              {formState === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#0c2340] mb-2">Application Received!</h4>
                  <p className="text-[#4a7fa5] mb-8">Thank you for your interest. We will be in touch shortly.</p>
                  <Button onClick={() => setFormState('idle')} variant="outline" className="border-[#0097a7] text-[#0097a7]">
                    Submit Another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">First Name</label>
                      <Input required value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} placeholder="Jane" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Last Name</label>
                      <Input required value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} placeholder="Doe" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Business Name</label>
                    <Input required value={formData.businessName} onChange={e => setFormData(p => ({ ...p, businessName: e.target.value }))} placeholder="Fitness Plus Gym" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Email Address</label>
                      <Input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Phone Number</label>
                      <Input required type="tel" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="(555) 123-4567" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Business Type</label>
                    <select required value={formData.businessType} onChange={e => setFormData(p => ({ ...p, businessType: e.target.value }))} className="w-full bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0097a7]/20 border">
                      <option value="">Select industry...</option>
                      <option value="gym">Gym / Fitness Center</option>
                      <option value="grocery">Grocery / Convenience</option>
                      <option value="office">Corporate Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[#0c2340] mb-1.5 block">Estimated Monthly Volume (Jugs)</label>
                    <Input type="number" value={formData.estimatedVolume} onChange={e => setFormData(p => ({ ...p, estimatedVolume: e.target.value }))} placeholder="e.g. 50" className="bg-[#f0f9ff] border-[#cce7f0] h-12 rounded-xl" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={formState === 'submitting'}
                    className="w-full bg-[#0097a7] hover:bg-[#006064] text-white h-14 text-lg rounded-xl shadow-lg mt-4 gap-2"
                  >
                    {formState === 'submitting' ? 'Submitting...' : <><Send className="w-5 h-5" /> Submit Application</>}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
          
        </div>
      </div>
    </main>
  )
}
