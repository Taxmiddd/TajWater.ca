'use client'

import { motion } from 'framer-motion'
import { Shield, Award, Leaf, Heart, Users, Droplets } from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Award, Leaf, Heart, Users, Droplets,
}

const certs = [
  { icon: 'Shield', label: 'NSF/ANSI 58 Certified', desc: 'Meets all Health Canada drinking water standards' },
  { icon: 'Award', label: 'ISO 9001:2015', desc: 'Quality management system certified' },
  { icon: 'Leaf', label: 'BC Water Authority Approved', desc: 'Fully licensed water delivery operator in BC' },
  { icon: 'Heart', label: 'BPA-Free Containers', desc: 'All jugs are food-grade, BPA-free polycarbonate' },
]

const values = [
  { icon: 'Droplets', title: 'Purity First', desc: 'Every drop is tested before it leaves our facility. Quality is non-negotiable.' },
  { icon: 'Users', title: 'Community Driven', desc: "We're a local BC company — your neighbours, not a faceless corporation." },
  { icon: 'Shield', title: 'Reliability', desc: "We've delivered over 50,000 jugs with a 99.6% on-time delivery rate." },
  { icon: 'Heart', title: 'Customer Love', desc: '4.9 stars from over 800 verified reviews across Google and Facebook.' },
]

interface TeamMember {
  id: string; name: string; role: string; bio: string
  initials: string; color: string; image_url?: string | null
}

interface Props {
  team: TeamMember[]
  mission: string
  vision: string
  heroSubtitle: string
}

export default function AboutClient({ team, mission, vision, heroSubtitle }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-28 hero-gradient overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="#f0f9ff" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold mb-4">Our Story</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5">
              About TajWater —<br /><span className="gradient-text-light">Metro Vancouver&apos;s Water Delivery Company</span>
            </h1>
            <p className="text-[#b3e5fc] text-xl max-w-2xl mx-auto">{heroSubtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[#f0f9ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: 'Our Mission', text: mission, color: '#0097a7' },
              { label: 'Our Vision', text: vision, color: '#1565c0' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 border border-[#cce7f0] shadow-sm"
              >
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4" style={{ background: item.color }}>
                  {item.label}
                </span>
                <p className="text-[#0c2340] text-lg leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0c2340] mb-3">Certifications &amp; <span className="gradient-text">Standards</span></h2>
            <p className="text-[#4a7fa5]">TajWater meets the highest water quality and safety standards in British Columbia.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certs.map((cert, i) => {
              const Icon = iconMap[cert.icon] ?? Shield
              return (
                <motion.div
                  key={cert.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-5 bg-[#f0f9ff] rounded-2xl border border-[#cce7f0]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e0f7fa] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#0097a7]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-sm">{cert.label}</p>
                    <p className="text-xs text-[#4a7fa5] mt-0.5">{cert.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] mb-3">Meet the <span className="gradient-text">Team</span></h2>
              <p className="text-[#4a7fa5]">The people behind every perfect delivery across Metro Vancouver</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl p-6 text-center border border-[#cce7f0]"
                >
                  {member.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.image_url} alt={member.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}99)` }}>
                      {member.initials}
                    </div>
                  )}
                  <h3 className="font-bold text-[#0c2340]">{member.name}</h3>
                  <p className="text-xs font-medium mb-3 text-[#0097a7]">{member.role}</p>
                  <p className="text-[#4a7fa5] text-xs leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-[#006064] to-[#1565c0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Why Choose <span className="gradient-text-light">TajWater</span> for Water Delivery in Metro Vancouver</h2>
            <p className="text-[#b3e5fc] max-w-2xl mx-auto">We deliver more than water. We deliver consistency, trust, and genuine care to every household and business we serve.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => {
              const Icon = iconMap[val.icon] ?? Droplets
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-70px' }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-dark rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-[#00bcd4]" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{val.title}</h3>
                  <p className="text-[#b3e5fc] text-sm">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* NAP block — critical for local SEO */}
      <section className="py-16 bg-white border-t border-[#cce7f0]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-extrabold text-[#0c2340] mb-4">Visit or Contact TajWater</h2>
          <address className="not-italic text-[#4a7fa5] text-sm leading-relaxed space-y-1">
            <p className="font-semibold text-[#0c2340]">Taj Water Ltd</p>
            <p>1770 McLean Ave Unit 7, Port Coquitlam, BC V3C 4K8, Canada</p>
            <p>Phone: <a href="tel:+17785047880" className="text-[#0097a7] hover:underline">+1 778-504-7880</a></p>
            <p>Serving Metro Vancouver including Vancouver, Burnaby, Richmond, Surrey, Coquitlam, Port Coquitlam, Langley, Delta, North Vancouver, West Vancouver, and 11 more cities.</p>
          </address>
        </div>
      </section>
    </div>
  )
}
