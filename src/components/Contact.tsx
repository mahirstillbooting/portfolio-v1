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
    {
      name: 'Direct Email',
      handle: 'stellaroasis116@gmail.com',
      url: `mailto:${email}`,
      icon: Mail,
    },
  ]

  return (
    <section
      id="contact"
      style={{ padding: '140px 32px' }}
      className="w-full max-w-[1200px] mx-auto relative flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ padding: '48px 36px' }}
        className="bento-card corner-plus text-center relative overflow-hidden w-full max-w-4xl"
      >
        {/* Subtle Ambient Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-[#E2652B]/12 blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 text-xs tracking-widest text-[#E2652B] font-mono mb-4 uppercase">
          <Mail className="w-3.5 h-3.5 text-[#E2652B]" />
          <span>05 // TRANSMISSION CHANNEL</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-sans font-bold text-white tracking-tight max-w-2xl mx-auto mb-4">
          Let's build something extraordinary.
        </h2>

        <p className="text-sm sm:text-base text-[#9CA3AF] font-sans max-w-md mx-auto mb-8 leading-relaxed">
          Open to full-stack engineering roles, software challenges, and technical discussions.
        </p>

        {/* Interactive Copyable Email Pill */}
        <div className="inline-flex items-center gap-3 p-1.5 sm:p-2 pl-5 sm:pl-6 bg-[#0A0A0C] border border-white/10 rounded-full font-mono text-xs sm:text-sm text-white mb-10 shadow-lg">
          <span>{email}</span>
          <button
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.08] hover:bg-[#E2652B] hover:text-black transition-colors cursor-pointer text-xs font-mono font-medium"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        {/* Social Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/6">
          {socials.map((s) => {
            const Icon = s.icon
            return (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/6 hover:border-[#E2652B]/40 transition-all no-underline font-mono text-xs text-[#EDEDED]"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#E2652B] group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-medium font-sans text-sm text-white">{s.name}</div>
                    <div className="text-[11px] text-[#6B7280] font-mono">{s.handle}</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#6B7280] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            )
          })}
        </div>

      </motion.div>
    </section>
  )
}
