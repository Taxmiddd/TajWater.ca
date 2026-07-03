'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Award, Leaf, Heart, Users, Droplets } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const [socials, setSocials] = useState({ facebook: '', instagram: '', twitter: '', tiktok: '' })

  useEffect(() => {
    supabase
      .from('site_content')
      .select('key, value')
      .in('key', ['social_facebook', 'social_instagram', 'social_twitter', 'social_tiktok'])
      .then(({ data }) => {
        if (!data) return
        const s = { facebook: '', instagram: '', twitter: '', tiktok: '' }
        for (const row of data) {
          if (row.key === 'social_facebook') s.facebook = row.value
          if (row.key === 'social_instagram') s.instagram = row.value
          if (row.key === 'social_twitter') s.twitter = row.value
          if (row.key === 'social_tiktok') s.tiktok = row.value
        }
        setSocials(s)
      })
  }, [])

  const socialPlatforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      handle: socials.facebook,
      href: socials.facebook,
      gradient: 'from-[#1877f2] to-[#0d5dbf]',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      ),
      desc: 'Like our page for updates & promos',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      handle: socials.instagram,
      href: socials.instagram,
      gradient: 'from-[#f58529] via-[#dd2a7b] to-[#8134af]',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      ),
      desc: 'See behind-the-scenes & delivery highlights',
    },
    {
      key: 'twitter',
      label: 'X (Twitter)',
      handle: socials.twitter,
      href: socials.twitter,
      gradient: 'from-[#111] to-[#333]',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      ),
      desc: 'Follow for quick tips & service news',
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      handle: socials.tiktok,
      href: socials.tiktok,
      gradient: 'from-[#010101] to-[#69c9d0]',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
      ),
      desc: 'Watch our water delivery in action',
    },
  ].filter(p => p.href)
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

      {/* Social Media */}
      {socialPlatforms.length > 0 && (
        <section className="py-20 bg-[#f0f9ff]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-[#0c2340] mb-3">Follow Us on <span className="gradient-text">Social Media</span></h2>
              <p className="text-[#4a7fa5]">Stay connected with TajWater for updates, tips, and behind-the-scenes content.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {socialPlatforms.map((platform, i) => (
                <motion.a
                  key={platform.key}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-3xl p-6 text-center border border-[#cce7f0] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-3"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {platform.icon}
                  </div>
                  <div>
                    <p className="font-bold text-[#0c2340] text-base">{platform.label}</p>
                    <p className="text-xs text-[#4a7fa5] mt-1">{platform.desc}</p>
                  </div>
                  <span className={`mt-auto text-xs font-semibold px-4 py-1.5 rounded-full bg-gradient-to-r ${platform.gradient} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    Follow →
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      )}

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
