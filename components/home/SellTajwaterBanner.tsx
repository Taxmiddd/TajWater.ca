import Link from 'next/link'
import { Building, ArrowRight } from 'lucide-react'

export default function SellTajwaterBanner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0097a7] to-[#1565c0] rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00bcd4] opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />
          
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Partner with TajWater</h2>
            </div>
            <p className="text-[#b3e5fc] text-lg max-w-xl">
              Are you a local business, gym, or grocery store looking to offer premium water to your customers? Ask about our wholesale reseller program.
            </p>
          </div>
          
          <div className="relative z-10 shrink-0 w-full md:w-auto">
            <Link 
              href="/sell-tajwater" 
              className="group flex items-center justify-center gap-2 bg-white text-[#0097a7] hover:bg-[#f0f9ff] font-bold text-lg px-8 py-4 rounded-xl shadow-lg transition-all w-full md:w-auto"
            >
              Become a Reseller
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
