"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Headphones, Shield, Zap, Layout, ArrowRight, Check } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Headphones className="text-background w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">SonicReader</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="/login" className="px-5 py-2 glass rounded-full hover:bg-white/10 transition-colors">Login</a>
            <button className="px-5 py-2 bg-primary text-background font-semibold rounded-full hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} /> v2.4 Now Live
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
              THE GHOST IN <br />
              <span className="text-gradient">THE MACHINE</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              If you can't read the room, find the app that can read the screen.
              High-fidelity, zero-latency text narration for the information elite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-primary text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                Download for Windows <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 glass text-white font-bold rounded-xl hover:bg-white/5 transition-colors">
                View Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 animate-glow"></div>
            <div className="relative glass rounded-3xl overflow-hidden border border-white/10">
              <Image
                src="/images/hero_vis.png"
                alt="SonicReader Visualization"
                width={800}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Select Your Tier</h2>
            <p className="text-muted-foreground">Monetize your momentum. Pick the plan that fuels your empire.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PriceCard
              title="The Enthusiast"
              price="0"
              features={["50k chars/day", "Local Voices", "Global Hotkeys"]}
            />
            <PriceCard
              title="The Executive"
              price="19"
              highlight
              features={["500k chars/day", "ElevenLabs Cloud Voices", "OCR Fallback Support", "Priority Updates"]}
            />
            <PriceCard
              title="The Empire"
              price="99"
              features={["Unlimited Chars", "Voice Cloning", "Site-wide Licensing", "24/7 Dedicated Architect"]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PriceCard({ title, price, features, highlight = false }: any) {
  return (
    <div className={`p-8 rounded-3xl border ${highlight ? 'border-primary bg-primary/5' : 'border-white/5 glass'} relative overflow-hidden flex flex-col`}>
      {highlight && (
        <div className="absolute top-0 right-0 bg-primary text-background text-[10px] font-black px-3 py-1 uppercase tracking-tighter">
          Best ROI
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="text-4xl font-black">${price}</span>
        <span className="text-muted-foreground">/mo</span>
      </div>
      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm text-slate-300">
            <Check size={16} className="text-primary shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-xl font-bold transition-all ${highlight ? 'bg-primary text-background' : 'glass hover:bg-white/5'}`}>
        Choose {title}
      </button>
    </div>
  );
}
