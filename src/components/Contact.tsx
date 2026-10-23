import { Mail, ArrowUpRight, Copy, Check } from 'lucide-react'
import { GithubIcon, InstagramIcon } from './Icons'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const email = 'stellaroasis116@gmail.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const socials = [
    {
      name: 'GitHub',
      handle: 'mahirstillbooting',
      url: 'https://github.com/mahirstillbooting',
      icon: GithubIcon,
    },
    {
      name: 'Instagram',
      handle: '@pixl.potion',
      url: 'https://instagram.com/pixl.potion',
      icon: InstagramIcon,
    },
  ]

  return (
    <section
      id="contact"
      style={{
        maxWidth: '860px',
        margin: '0 auto',
        padding: '60px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        scrollMarginTop: '80px',
      }}
      className="w-full scroll-mt-[80px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          borderRadius: '24px',
          background: 'rgba(20, 20, 22, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        className="text-center relative overflow-hidden w-full shadow-2xl p-6 sm:p-12 lg:p-14"
      >
        {/* Subtle Ambient Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#E2652B]/10 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono mb-4 uppercase">
          <Mail className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>05 · TRANSMISSION CHANNEL</span>
        </div>

        {/* Heading with generous vertical breathing room */}
        <h2
          style={{ marginBottom: '32px' }}
          className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight max-w-xl mx-auto"
        >
          Let's build something extraordinary.
        </h2>

        <p className="text-sm sm:text-base text-[#A1A1AA] font-sans max-w-md mx-auto mb-6 leading-relaxed">
          Open to full-stack engineering roles, software challenges, and technical discussions.
        </p>

        {/* Sleek inline Copy Email button inside header card */}
        <div className="flex justify-center mb-10">
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-[#E2652B] hover:text-black border border-white/10 hover:border-[#E2652B] text-neutral-300 transition-all font-mono text-xs cursor-pointer shadow-sm active:scale-95"
            title="Click to copy email address"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white font-medium">{email} — Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copy {email}</span>
              </>
            )}
          </button>
        </div>

        {/* Exactly 2 Clean Social Transmission Cards (GitHub & Instagram only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-8 border-t border-white/8">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-[#E2652B]/40 transition-all no-underline font-mono text-xs text-[#EDEDED]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-[#E2652B] group-hover:scale-105 transition-transform flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#E2652B]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold font-sans text-sm text-white">{s.name}</div>
                    <div className="text-[11px] text-[#71717A] font-mono">{s.handle}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#71717A] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )
          })}
        </div>

      </motion.div>
    </section>
  )
}
