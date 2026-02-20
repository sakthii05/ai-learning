'use client'

import React from 'react'
import { RiGithubLine, RiLinkedinLine, RiTwitterXLine, RiArrowRightUpLine } from 'react-icons/ri'

// --- Components ---

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'progress' | 'rd' }) => {
  const styles = {
    default: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    progress: 'bg-orange-50 text-orange-700 border-orange-100',
    rd: 'bg-blue-50 text-blue-700 border-blue-100',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[variant]}`}>
      {children}
    </span>
  )
}

const ProjectCard = ({ title, description, status, tags, href }: {
  title: string
  description: string
  status: 'Live' | 'In Progress' | 'R&D' | 'Upcoming'
  tags: string[]
  href: string
}) => {
  const statusVariant = status === 'Live' ? 'default' : status === 'In Progress' ? 'progress' : 'rd'

  return (
    <div className="group relative p-6 bg-white border border-neutral-200 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <Badge variant={statusVariant}>{status}</Badge>
        <RiArrowRightUpLine className="text-neutral-400 group-hover:text-emerald-600 transition-colors" size={20} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-emerald-700 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            {tag}
          </span>
        ))}
      </div>
      <a href={href} className="absolute inset-0 z-10" />
    </div>
  )
}

// --- Sections ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="text-sm font-mono font-bold tracking-tighter text-neutral-900">
        AI_ENGINEER<span className="text-emerald-600">.</span>
      </div>
      <div className="flex gap-8 text-xs font-medium text-neutral-500">
        <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
        <a href="#projects" className="hover:text-emerald-600 transition-colors">Projects</a>
        <a href="https://x.com/sakthi_ld" target='_blank' className="hover:text-emerald-600 transition-colors">Connect</a>
      </div>
    </div>
  </nav>
)

const Hero = () => (
  <section className="pt-32 pb-20 px-6">
    <div className="max-w-4xl mx-auto text-center md:text-left">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700">Available for Collaborate</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 tracking-tight">
        Frontend Developer <br className="hidden md:block" />
        <span className="text-emerald-600">→</span> AI Builder
      </h1>
      <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mb-10 leading-relaxed">
        Transitioning from pixel-perfect UI craftsmanship to engineering intelligent systems.
        Bridging the gap between modern frontends and LLM capabilities.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <a
          href="#projects"
          className="px-8 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all text-center"
        >
          View Projects
        </a>
        <a
          href="https://x.com/sakthi_ld" 
          target="_blank"
          className="px-8 py-3 bg-white border border-neutral-200 text-neutral-900 rounded-lg font-medium hover:border-emerald-600 hover:text-emerald-600 transition-all text-center"
        >
          Connect
        </a>
      </div>
    </div>
  </section>
)

const About = () => (
  <section id="about" className="py-24 px-6 bg-neutral-50">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Background</h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-3xl font-bold text-neutral-900 mb-6">Mastering the shift to AI Engineering.</h3>
          <p className="text-neutral-600 leading-relaxed mb-6">
            With a strong foundation in React and Tailwind CSS, I&#39;m now specializing in building production-ready AI applications.
            I focus on implementing Retrieval Augmented Generation (RAG), fine-tuning system prompts, and architecting structured outputs for seamless integration.
          </p>
        </div>
        <div className="space-y-6">
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h4 className="font-semibold text-neutral-900 mb-1">Modern AI Stack</h4>
            <p className="text-sm text-neutral-500">AI SDK, LangChain, OpenAI, Vector DBs (Pinecone/Supabase)</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg bg-white">
            <h4 className="font-semibold text-neutral-900 mb-1">Frontend Excellence</h4>
            <p className="text-sm text-neutral-500">Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Projects = () => (
  <section id="projects" className="py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-4">Selected Works</h2>
          <h3 className="text-4xl font-bold text-neutral-900 italic tracking-tight">Public Labs & Projects</h3>
        </div>
        <p className="text-neutral-500 max-w-sm text-sm">
          A collection of experiments combining cognitive models with high-end user experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProjectCard
          title="Fitness Plan Generator"
          description="Generate personalized fitness plans based on user inputs. Share your essentials and we will craft a high-performance fitness and nutrition plan calibrated to you."
          status="Live"
          tags={['LangChain', 'Zod', "System-Prompt", "Structured-utput"]}
          href="/fitnessplan"
        />
        <ProjectCard
          title="Chat Bot"
          description="Creating Chatgpt style chatbot with streaming response. Using gemini-2.5-flash model with markdown output"
          status="In Progress"
          tags={['AI-sdk', 'React-markdown', 'System-Prompt', 'LLM']}
          href="/aichat"
        />
        <ProjectCard
          title="RAG"
          description="Retrieval Augmented Generation (RAG) is a technique that allows you to use external knowledge to improve the accuracy of your AI models."
          status="Upcoming"
          tags={['Langchain', 'AI-sdk', 'Vector-DB']}
          href="#"
        />
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="py-12 border-t border-neutral-100 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
        © 2026 AI_LEARNING / ALL RIGHTS RESERVED
      </div>
      <div className="flex gap-6">
        <a href="https://linkedin.com/in/sakthivel-2022-webdev" target='_blank' className="text-neutral-400 hover:text-emerald-600 transition-colors"><RiTwitterXLine size={20} /></a>
        <a href="https://x.com/sakthi_ld" target='_blank' className="text-neutral-400 hover:text-emerald-600 transition-colors"><RiLinkedinLine size={20} /></a>
        <a href="https://github.com/sakthii05" target='_blank' className="text-neutral-400 hover:text-emerald-600 transition-colors"><RiGithubLine size={20} /></a>
      </div>
    </div>
  </footer>
)

export default function IndexPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Footer />
    </main>
  )
}