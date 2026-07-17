import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Why Distilled Water is Essential for Your CPAP Machine | Taj Water Blog',
  description: 'Learn why using distilled water in your CPAP machine is crucial for your health and the longevity of your equipment.',
  keywords: ['distilled water for CPAP', 'distilled water delivery Vancouver', 'CPAP machine water', 'Taj Water distilled', 'distilled water Burnaby'],
}

export default function BlogPost() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-[#0c2340] mb-6">Why Distilled Water is Essential for Your CPAP Machine</h1>
      <p className="text-sm text-[#4a7fa5] mb-8">Published on {new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })} • 4 min read</p>
      
      <div className="prose prose-lg prose-blue max-w-none text-[#4a7fa5]">
        <p>
          If you rely on a CPAP machine for sleep apnea, you know how important it is to keep your equipment clean and functioning properly. 
          One of the most critical aspects of CPAP maintenance is the type of water you use in the humidifier chamber.
        </p>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">What happens if you use tap water?</h2>
        <p>
          Tap water, even in places with excellent water quality like Metro Vancouver, contains minerals such as calcium and magnesium. 
          When this water evaporates in your CPAP humidifier, it leaves behind hard mineral deposits (scale). Over time, this buildup can:
        </p>
        <ul>
          <li>Damage the water chamber</li>
          <li>Harbor bacteria and mold</li>
          <li>Shorten the lifespan of your CPAP machine</li>
          <li>Irritate your airways if mineral dust is inhaled</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">The Solution: Pure Distilled Water</h2>
        <p>
          Distilled water is created through a rigorous process of boiling water into steam and then condensing it back into liquid. 
          This process removes 99.9% of minerals, impurities, and contaminants. 
          When you use distilled water, there is no mineral residue left behind when the water evaporates, ensuring your CPAP machine stays clean and safe.
        </p>

        <h2 className="text-2xl font-bold text-[#0c2340] mt-8 mb-4">Convenience of Delivery</h2>
        <p>
          Buying gallon jugs of distilled water from the grocery store every week can be heavy and tedious. 
          A water delivery service brings 5-gallon jugs of pure distilled water straight to your door, ensuring you never run out right before bed.
        </p>

        <div className="bg-[#f0f9ff] p-6 rounded-2xl mt-12 border border-[#cce7f0]">
          <h3 className="text-xl font-bold text-[#0c2340] mb-4">Need Distilled Water?</h3>
          <p className="mb-4">Taj Water provides pure distilled water delivery across Vancouver, Burnaby, Richmond, and the entire lower mainland.</p>
          <Link href="/distilled-water-delivery-vancouver" className="text-[#0097a7] font-bold hover:underline">
            Order Distilled Water for your CPAP →
          </Link>
        </div>
      </div>
    </article>
  )
}
