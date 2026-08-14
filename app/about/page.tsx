import React from "react";
import Link from "next/link";
import { GraduationCap, Sparkles, Terminal, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Developer Showcase
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            About the <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Creator</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pioneering digital ecosystems that bridge campus governance with next-generation developer tooling.
          </p>
        </div>

        {/* Creator Profile Spotlight */}
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 dark:bg-primary/10 rounded-bl-full pointer-events-none" />
          
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0">
            RA
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Raj Aryan</h2>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Full-Stack Architect & Founder</p>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              I am a passionate software engineer focused on building clean, high-performance, and student-first web applications. Driven by the recent campus events, I designed **SLIETVoice** to provide transparency and accountability in college systems, drawing inspiration from my other platform **InterviewX**.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Terminal className="w-4 h-4 text-primary" /> Next.js / React / Prisma
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Globe className="w-4 h-4 text-primary" /> Neon PostgreSQL
              </span>
            </div>
          </div>
        </div>

        {/* Project Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* SLIETVoice Card */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            <div className="flex items-center gap-2.5 mb-4">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">SLIETVoice</h3>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              A transparent, community-led campus grievance portal. Empowers students to file complaints (anonymously or publicly), rally support through solidarity votes, and track the live administrative triage workflow.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              <span>Status: Active Deploy</span>
              <Link href="/" className="text-primary hover:underline">Launch App &rarr;</Link>
            </div>
          </div>

          {/* InterviewX Card */}
          <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-violet-600" />
            <div className="flex items-center gap-2.5 mb-4">
              <Terminal className="w-6 h-6 text-violet-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">InterviewX</h3>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed mb-6">
              An AI-powered technical mock interview simulator. Helps developers practice real-world coding questions, resolve behavioral scenarios, and receive instant granular reports detailing how to excel in placement drives.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              <span>Status: Featured Project</span>
              <a href="https://interviewx.in" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                Explore Website &rarr;
              </a>
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground pt-4 flex items-center justify-center gap-1.5">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Raj Aryan.
        </div>

      </div>
    </div>
  );
}
