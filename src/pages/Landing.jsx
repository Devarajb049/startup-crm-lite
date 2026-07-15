import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../components/common/DarkModeToggle';
import Logo from '../components/common/Logo';
import ShimmerButton from '../components/common/ShimmerButton';
import {
  Users,
  BarChart3,
  MessageSquare,
  Mail,
  TrendingUp,
  Shield,
  Zap,
  FileSpreadsheet,
  Layers,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  ChevronDown,
  Play,
  ArrowRight,
  Star,
  Check,
  MapPin,
  Phone,
  Globe,
  ExternalLink,
  MessageCircle,
  FolderLock,
  Target,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import useDocumentMetadata from '../hooks/useDocumentMetadata';

const Landing = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useDocumentMetadata(
    'AuraCRM | Premium Lead Management Platform',
    'AuraCRM is a premium customer relationship management workspace for modern startup teams to track leads, contacts, pipelines, and revenue analytics.'
  );

  // Navigation active link highlights & mobile menu controls
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Accordion faq control state
  const [openFaq, setOpenFaq] = useState(null);

  // Showcase layout selector state
  const [showcaseTab, setShowcaseTab] = useState('Dashboard');

  // Contact form submission state
  const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Active workflow step loop for sequential line animation
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 7);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Detect scroll offset to update sticky navbar styles & active scroll spy link
  useEffect(() => {
    const handleScroll = () => {
      // Background scroll blur
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll spy active tab detection
      const sections = ['home', 'features', 'workflow', 'showcase', 'pricing', 'faq', 'contact'];
      const scrollPos = window.scrollY + 120; // 120px offset for header height

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            const label = section.charAt(0).toUpperCase() + section.slice(1);
            setActiveTab(label === 'Workflow' ? 'Workflow' : label === 'Showcase' ? 'Showcase' : label);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    toast.success('Your message has been sent successfully!');
    setContactForm({ name: '', email: '', company: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  // Scroll to section helper
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70; // Header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Core CRM modules data (13 modules)
  const features = [
    { icon: BarChart3,      title: 'KPI Dashboard',           desc: 'Real-time overview of leads, revenue, win rates, and team activity in one place.' },
    { icon: Users,          title: 'Lead Management',          desc: 'Capture, qualify, assign, and track every sales opportunity through the pipeline.' },
    { icon: Globe,          title: 'Contact Management',       desc: 'Maintain a rich, searchable directory of prospects, customers, and stakeholders.' },
    { icon: Layers,         title: 'Customer Database',        desc: 'Centralize interaction history, deal values, and relationship context per client.' },
    { icon: TrendingUp,     title: 'Sales Pipeline',           desc: 'Visualize deal progression across stages with real-time funnel conversion metrics.' },
    { icon: MessageSquare,  title: 'WhatsApp CRM',             desc: 'Initiate WhatsApp conversations directly from a lead record with one click.' },
    { icon: Target,         title: 'Source Channel Analytics', desc: 'Measure which acquisition channels — Ads, Referral, Website — drive the most ROI.' },
    { icon: BarChart3,      title: 'Reports & Analytics',      desc: 'Deep pipeline reports, monthly revenue trends, and conversion velocity analytics.' },
    { icon: Users,          title: 'Team Management',          desc: 'Assign leads by owner, coordinate follow-ups, and track team performance metrics.' },
    { icon: Calendar,       title: 'Task Management',          desc: 'Create tasks, set deadlines, and ensure no follow-up or meeting gets missed.' },
    { icon: FileSpreadsheet,title: 'CSV Export',               desc: 'Export filtered lead lists to CSV in one click for offline reporting or migration.' },
    { icon: FolderLock,     title: 'Role-Based Access',        desc: 'Restrict data views by user role to maintain security and workspace isolation.' },
    { icon: Shield,         title: 'Secure Authentication',    desc: 'JWT-secured sessions with encrypted credentials and automatic session management.' },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-bg text-slate-800 dark:text-slate-350 transition-colors duration-200 overflow-x-hidden">

      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 dark:bg-blue-650/8 blur-[150px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 dark:bg-purple-650/6 blur-[180px] pointer-events-none animate-float-reverse" />
      <div className="absolute top-[40%] left-[5%] w-[40%] h-[40%] rounded-full bg-pink-500/3 dark:bg-pink-650/4 blur-[130px] pointer-events-none animate-float-alternate" />

      {/* 1. STICKY NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-border/40 dark:border-border/10 py-4 shadow-xs'
        : 'bg-transparent py-4'
        }`}>
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer shrink-0 whitespace-nowrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Logo className="w-8 h-8 text-primary shrink-0" />
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase shrink-0">
              AURA<span className="text-primary">CRM</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-400">
            {['Home', 'Features', 'Workflow', 'Showcase', 'Pricing', 'FAQ', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveTab(item);
                  scrollToSection(item.toLowerCase());
                }}
                className={`hover:text-primary dark:hover:text-white transition-colors cursor-pointer ${activeTab === item ? 'text-primary dark:text-white' : ''
                  }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action buttons + dark toggle */}
          <div className="hidden lg:flex items-center gap-3">
            <DarkModeToggle />

            {token ? (
              <Link to="/dashboard">
                <ShimmerButton px="px-4.5" py="py-2.5" className="border border-blue-400/20 shadow-md">
                  <span>Dashboard</span>
                  <ArrowRight size={14} />
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2.5 text-xs font-bold text-slate-650 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register">
                  <ShimmerButton px="px-4.5" py="py-2.5" className="border border-blue-400/20 shadow-md">
                    <span>Get Started</span>
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-3 lg:hidden shrink-0">
            <DarkModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl border border-border dark:border-border/30 text-slate-500 dark:text-slate-400 shrink-0"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu drawer backdrop */}
        <div 
          className={`lg:hidden fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-xs transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setMobileMenuOpen(false)} 
        />

        {/* Mobile menu drawer panel */}
        <div 
          className={`lg:hidden fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/50 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between">
              <div 
                className="flex items-center gap-2.5 cursor-pointer shrink-0 whitespace-nowrap" 
                onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <Logo className="w-8 h-8 text-primary shrink-0" />
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white uppercase shrink-0">
                  AURA<span className="text-primary">CRM</span>
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col gap-1.5 pt-4">
              {['Home', 'Features', 'Workflow', 'Showcase', 'Pricing', 'FAQ', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    scrollToSection(item.toLowerCase());
                  }}
                  className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-900 min-h-[44px] flex items-center ${activeTab === item ? 'bg-primary/10 text-primary dark:text-white' : 'text-slate-650 dark:text-slate-400'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4 flex flex-col gap-3">
            {token ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full min-h-[44px] bg-primary text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-98">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full min-h-[44px] text-center text-xs font-bold text-slate-750 dark:text-slate-400 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center">
                    Sign In
                  </button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <button className="w-full min-h-[44px] bg-primary text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center hover:bg-opacity-90 transition-all active:scale-98">
                    Get Started Free
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="home" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 lg:flex lg:items-center lg:gap-10">
        {/* LHS Details */}
        <div className="lg:w-1/2 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full select-none">
            <Zap size={10} className="fill-primary" />
            <span>The CRM Built for Modern Sales Teams</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-905 dark:text-white leading-none tracking-tight">
            Close More Deals.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">Grow Faster.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400 leading-relaxed max-w-xl">
            AURA CRM is a full-featured customer relationship management platform — manage leads, contacts, sales pipelines, WhatsApp conversations, and revenue analytics from one powerful workspace.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {token ? (
              <Link to="/dashboard">
                <ShimmerButton px="px-6" py="py-3" className="border border-blue-400/20 text-xs shadow-lg">
                  <span>Enter Dashboard</span>
                  <ArrowRight size={15} />
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <ShimmerButton px="px-6" py="py-3" className="border border-blue-400/20 text-xs shadow-lg">
                    <span>Get Started Free</span>
                  </ShimmerButton>
                </Link>
                <Link to="/login">
                  <button className="px-5 py-3 text-xs font-bold rounded-xl border border-border/80 dark:border-border/10 text-slate-800 dark:text-white bg-surface dark:bg-card hover:bg-hover active:scale-97 transition-all cursor-pointer shadow-xs">
                    Login
                  </button>
                </Link>
              </>
            )}
            <button
              onClick={() => scrollToSection('showcase')}
              className="px-5 py-3 text-xs font-bold rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Play size={14} className="fill-slate-500" />
              <span>Request Demo</span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-6 text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wide border-t border-border/40 dark:border-border/10 select-none">
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              <span>JWT Secured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              <span>Cloud Hosted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check size={14} className="text-success" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>

        {/* RHS: Dashboard Preview Card */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 relative flex items-center justify-center select-none">
          {/* Soft glow behind card */}
          <div className="absolute w-[70%] h-[70%] rounded-full bg-blue-500/10 dark:bg-blue-550/15 blur-3xl -z-10" />

          {/* Dashboard Preview Card */}
          <div className="w-full max-w-lg glass-card border border-border/40 dark:border-border/10 rounded-2xl shadow-2xl text-left bg-white/80 dark:bg-card/80 overflow-hidden">

            {/* Window title bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/20 dark:border-border/10 bg-slate-50/80 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">AURA CRM — Live Dashboard</span>
              <span className="w-2 h-2 rounded-full bg-success" />
            </div>

            <div className="p-5 space-y-5">

              {/* KPI Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/30 dark:border-white/5">
                  <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Revenue Won</p>
                  <p className="text-sm font-black text-success mt-1">₹4,85,200</p>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-success w-[72%] h-full rounded-full" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/30 dark:border-white/5">
                  <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Active Leads</p>
                  <p className="text-sm font-black text-primary mt-1">145</p>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-primary w-[90%] h-full rounded-full" />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/30 dark:border-white/5">
                  <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Win Rate</p>
                  <p className="text-sm font-black text-accent mt-1">32.4%</p>
                  <div className="w-full bg-slate-200 dark:bg-white/10 h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-accent w-[32%] h-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Pipeline Funnel */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Sales Pipeline Funnel</h3>
                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Live conversion stages</p>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/15">+14.2% MoM</span>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: 'New Leads', value: 145, pct: '90%', color: 'bg-primary' },
                    { label: 'Qualified', value: 94, pct: '65%', color: 'bg-accent' },
                    { label: 'Won Deals', value: 32, pct: '25%', color: 'bg-success' },
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-white/5 h-2 rounded-xl overflow-hidden">
                        <div className={`${row.color} h-full rounded-xl`} style={{ width: row.pct }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom row: Source leader + WhatsApp activity */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/30 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Top Source</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white">LinkedIn Ads</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5">ROI: <span className="text-accent font-bold">87%</span></p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/30 dark:border-white/5 flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle size={12} className="text-success fill-success" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight">Priya Patel</p>
                    <p className="text-[8px] text-slate-400 dark:text-slate-500 truncate mt-0.5">"Share the final proposal..."</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section >

      {/* 3. TRUSTED BY SECTION */}
      <section className="bg-bg/40 dark:bg-surface/20 border-y border-border/40 dark:border-border/10 py-10 select-none" >
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">Trusted by Sales Teams at Fast-Growing Companies</p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 text-sm font-black text-slate-400 dark:text-slate-650 tracking-widest uppercase">
            <span>Startups</span>
            <span>Agencies</span>
            <span>SaaS Companies</span>
            <span>E-Commerce</span>
            <span>Enterprises</span>
          </div>
        </div>
      </section >

      {/* 4. FEATURES / CORE CRM MODULES SECTION */}
      <section id="features" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Core CRM Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Every tool your sales team needs — from lead capture to revenue analytics — in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 glass-card border border-border/40 dark:border-border/10 rounded-2xl text-left hover:border-primary/30 dark:hover:border-primary/20 hover:scale-102 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section >

      {/* 5. WORKFLOW SECTION */}
      <section id="workflow" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Your CRM Workflow, Automated
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            From the first lead touch to customer conversion — AURA CRM manages every step of your sales process.
          </p>
        </div>

        {/* Workflow steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-5 relative select-none">
          {[
            { step: '1', title: 'Lead Capture',        desc: 'Collect leads from Web, Ads, Referrals, WhatsApp, or manual entry.' },
            { step: '2', title: 'Lead Qualification',  desc: 'Score and qualify leads by value, source, and conversion potential.' },
            { step: '3', title: 'Team Assignment',     desc: 'Assign qualified leads to the right sales rep automatically.' },
            { step: '4', title: 'Follow-up Mgmt',      desc: 'Schedule and log calls, messages, and meetings with every lead.' },
            { step: '5', title: 'Sales Pipeline',      desc: 'Track deal stages: New → Contacted → Proposal → Negotiation.' },
            { step: '6', title: 'Conversion',          desc: 'Mark deals as Won or Lost and update your revenue dashboard.' },
            { step: '7', title: 'Analytics',           desc: 'Analyze performance, source ROI, and team productivity reports.' },
          ].map((item, idx) => {
            const isActive = activeWorkflowStep === idx;
            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-5 glass-card border rounded-2xl text-left transition-all duration-500 transform ${isActive
                  ? 'border-primary/80 dark:border-primary/50 shadow-md shadow-primary/5 bg-primary/[0.03] dark:bg-primary/[0.02] scale-102 -translate-y-1'
                  : 'border-border/40 dark:border-border/10 bg-surface/50 dark:bg-surface/5 opacity-75'
                  }`}
              >
                {/* Connecting arrow (only for desktop, omit for last item) */}
                {idx < 6 && (
                  <>
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 pointer-events-none">
                      <span className={`text-sm font-black transition-colors duration-500 ${isActive ? 'text-primary' : 'text-slate-300 dark:text-slate-800'}`}>➔</span>
                    </div>
                    <div className="block md:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
                      <span className={`text-sm font-black transition-colors duration-500 ${isActive ? 'text-primary' : 'text-slate-300 dark:text-slate-800'}`}>↓</span>
                    </div>
                  </>
                )}
                <span className={`text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center mb-3.5 select-none transition-all duration-550 border ${isActive
                  ? 'bg-primary border-primary text-white scale-110 shadow-sm shadow-primary/20'
                  : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>{item.step}</span>
                <div>
                  <h4 className={`text-xs font-bold tracking-tight transition-colors duration-500 ${isActive ? 'text-primary dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>{item.title}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section >

      {/* 6. SHOWCASE SECTION */}
      <section id="showcase" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10" >
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Explore the AURA CRM Workspace
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Tour each module of the platform before you sign up — no commitment required.
          </p>
        </div>

        {/* Showcase Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {['Dashboard', 'Lead Management', 'Analytics', 'System Settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setShowcaseTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${showcaseTab === tab
                ? 'bg-primary border-primary text-white shadow-md'
                : 'bg-surface dark:bg-card border-border/70 dark:border-border/10 text-slate-650 dark:text-slate-400 hover:bg-hover'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Preview Box */}
        <div className="w-full glass-card border border-border/40 dark:border-border/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden bg-surface/50 dark:bg-slate-900/40 text-left min-h-[320px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/20 dark:border-border/10 pb-4 mb-4 select-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module Preview: {showcaseTab}</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/10" />
            </div>
          </div>

          {showcaseTab === 'Dashboard' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Main KPI Dashboard</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Get a real-time overview of your entire CRM — active leads, revenue won, win rates, unread alerts, team tasks, and WhatsApp activity — all on one screen.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">Active Leads</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">128</span>
                </div>
                <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">Win Rate</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">32.4%</span>
                </div>
                <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">Revenue Won</span>
                  <span className="text-lg font-black text-success">₹4.85L</span>
                </div>
                <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl">
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">Open Tasks</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">14</span>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === 'Lead Management' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Lead Management Control Center</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add, search, filter, and update leads in a clean table or card grid. Assign owners, set statuses, log notes, initiate WhatsApp chats, and export to CSV — all in one view.</p>
              <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl flex flex-wrap items-center gap-2 text-xs mt-2">
                <span className="font-semibold text-slate-900 dark:text-white">Quick Actions:</span>
                <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md font-bold text-[10px]">+ Add Lead</span>
                <span className="px-2 py-1 bg-surface/50 text-body border border-border dark:border-border/10 rounded-md font-bold text-[10px]">Download CSV</span>
                <span className="px-2 py-1 bg-surface/50 text-body border border-border dark:border-border/10 rounded-md font-bold text-[10px]">Filter by Status</span>
                <span className="px-2 py-1 bg-surface/50 text-body border border-border dark:border-border/10 rounded-md font-bold text-[10px]">WhatsApp Chat</span>
              </div>
            </div>
          )}


          {showcaseTab === 'Analytics' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Reports & Business Analytics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Deep analytics dashboards with pipeline funnels, monthly revenue trends, source channel ROI, conversion rate breakdowns, and team performance reports rendered with interactive charts.</p>
              <div className="grid grid-cols-3 gap-3 text-[10px] mt-2">
                <div className="p-3 bg-bg/85 dark:bg-surface/20 border border-border/30 dark:border-border/10 rounded-xl">
                  <span className="block text-slate-400">Top Channel</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-1 block">LinkedIn Ads</span>
                </div>
                <div className="p-3 bg-bg/85 dark:bg-surface/20 border border-border/30 dark:border-border/10 rounded-xl">
                  <span className="block text-slate-400">Conversion Rate</span>
                  <span className="font-bold text-success mt-1 block">12.4%</span>
                </div>
                <div className="p-3 bg-bg/85 dark:bg-surface/20 border border-border/30 dark:border-border/10 rounded-xl">
                  <span className="block text-slate-400">MoM Growth</span>
                  <span className="font-bold text-primary mt-1 block">+24%</span>
                </div>
              </div>
            </div>
          )}

          {showcaseTab === 'System Settings' && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Profile & Workspace Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manage your profile, update business details, configure preferred currency, set notification preferences, and control workspace data — all protected by confirmation modals.</p>
              <div className="p-4 bg-bg/80 dark:bg-surface/30 border border-border/40 dark:border-border/10 rounded-xl flex items-center justify-between text-xs mt-2">
                <span className="font-semibold">Active Currency:</span>
                <span className="font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg border border-primary/25">INR (₹)</span>
              </div>
            </div>
          )}

        </div>
      </section >

      {/* 7. BUSINESS INSIGHTS / WHY CHOOSE SECTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Why Sales Teams Choose AURA CRM
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Built for speed, built for scale — everything a modern sales team needs to close more deals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Faster Lead Management',    desc: 'Add and qualify new leads in under 10 seconds with our streamlined input forms.' },
            { title: 'Centralized Customer Data', desc: 'Every contact, deal, note, and conversation in one searchable workspace.' },
            { title: 'Automated Follow-ups',      desc: 'Never miss a follow-up — schedule tasks, log calls, and set reminders per lead.' },
            { title: 'Secure Authentication',     desc: 'JWT-based sessions with encrypted credentials and per-user workspace isolation.' },
            { title: 'Team Collaboration',        desc: 'Assign leads, share notes, and coordinate pipeline tasks across your sales team.' },
            { title: 'Mobile Responsive',         desc: 'Fully responsive UI — access your CRM from any device, anywhere, anytime.' },
            { title: 'Powerful Analytics',        desc: 'Real-time reports on pipeline health, revenue, source ROI, and team activity.' },
            { title: 'Enterprise Performance',    desc: '99.9% uptime, cloud-hosted infrastructure, and sub-second page load times.' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 glass-card border border-border/40 dark:border-border/10 rounded-2xl text-left bg-surface/40 dark:bg-card/30 flex items-start gap-4">
              <span className="w-5 h-5 rounded-full bg-success/10 border border-success/20 text-success flex items-center justify-center shrink-0 mt-0.5 select-none font-bold text-[10px]">✓</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section >

      {/* 8. STATISTICS SECTION */}
      <section className="bg-gradient-to-r from-primary via-indigo-650 to-purple-650 text-white py-14 select-none" >
        <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-2 lg:grid-cols-6 gap-8 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black block">500+</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Active Businesses</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">10,000+</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Leads Managed</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">1M+</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Messages Processed</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">32.4%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Avg. Conversion Rate</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block">98%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Customer Satisfaction</span>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <span className="text-2xl sm:text-3xl font-black block">99.9%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/70 block mt-1.5">Platform Uptime</span>
          </div>
        </div>
      </section >

      {/* 9. TESTIMONIALS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Trusted by Sales Leaders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            See how startup founders and sales managers use AURA CRM to scale their revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Arjun Mehta',
              role: 'Head of Sales',
              company: 'NovaTech Solutions',
              rating: 5,
              review: 'AURA CRM completely transformed how we manage our pipeline. The WhatsApp integration saves our team 2 hours daily, and the source analytics help us double down on channels that actually convert.'
            },
            {
              name: 'Riya Sharma',
              role: 'Founder & CEO',
              company: 'GrowthBridge Agency',
              rating: 5,
              review: 'We evaluated HubSpot and Zoho, but AURA CRM\'s interface is faster and easier for our team. The lead qualification workflow and CSV export are exactly what a growing agency needs.'
            },
            {
              name: 'Daniel Okafor',
              role: 'Sales Manager',
              company: 'Velocity Retail',
              rating: 5,
              review: 'The pipeline funnel analytics are outstanding. I can see exactly where deals are stalling, who is following up, and which channels drive the best ROI — all in real time.'
            }
          ].map((test, idx) => (
            <div key={idx} className="p-6 glass-card border border-border/40 dark:border-border/10 rounded-3xl text-left bg-surface/50 dark:bg-card/40 flex flex-col justify-between min-h-[190px]">
              <div>
                <div className="flex gap-1 mb-3.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={13} className="text-warning fill-warning shrink-0" />
                  ))}
                </div>
                <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed italic">"{test.review}"</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border/40 dark:border-border/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary select-none shrink-0">{test.name.charAt(0)}</div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-900 dark:text-white truncate">{test.name}</p>
                  <p className="text-[8px] text-slate-450 dark:text-slate-500 truncate">{test.role} · {test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section >

      {/* 10. PRICING SECTION */}
      <section id="pricing" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Start free and scale as your sales team grows. No hidden fees, no long-term contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Plan 1: Starter */}
          <div className="p-8 glass-card border border-border/40 dark:border-border/10 rounded-3xl text-left bg-surface/50 dark:bg-card/20 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Starter Plan</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Free <span className="text-xs text-slate-450 font-semibold font-mono">/ Month</span></p>
              <p className="text-[11px] text-slate-500">Perfect for solo founders and small sales teams getting started.</p>
              <div className="h-px bg-border/40 dark:bg-white/10 my-4" />
              <ul className="space-y-2.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Up to 100 leads</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>KPI Dashboard access</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>WhatsApp CRM integration</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>CSV export</span></li>
                <li className="flex items-center gap-2 text-slate-400"><X size={12} className="text-error" /><span>Source Channel Analytics</span></li>
                <li className="flex items-center gap-2 text-slate-400"><X size={12} className="text-error" /><span>Team collaboration tools</span></li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 block">
              <button className="w-full py-2.5 text-xs font-bold rounded-xl border border-border dark:border-border/20 text-slate-800 dark:text-white hover:bg-hover transition-all cursor-pointer">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Plan 2: Professional */}
          <div className="p-8 glass-card border-2 border-primary rounded-3xl text-left bg-surface/90 dark:bg-card/45 flex flex-col justify-between relative shadow-xl">
            <span className="absolute top-4 right-4 bg-primary text-white text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Most Popular</span>
            <div className="space-y-4">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest block">Professional</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹1,499 <span className="text-xs text-slate-450 font-semibold font-mono">/ Month</span></p>
              <p className="text-[11px] text-slate-500">For growing sales teams and agencies scaling their pipeline.</p>
              <div className="h-px bg-border/40 dark:bg-white/10 my-4" />
              <ul className="space-y-2.5 text-[10px] font-medium text-slate-650 dark:text-slate-350">
                <li className="flex items-center gap-2"><Check size={12} className="text-success animate-pulse" /><span>Unlimited leads</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Full Analytics & Reports</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Source Channel Analytics</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Team collaboration tools</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Priority email support</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Advanced CSV exports</span></li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 block">
              <ShimmerButton className="w-full border border-blue-400/20 shadow-md">
                <span>Start Free Trial</span>
              </ShimmerButton>
            </Link>
          </div>

          {/* Plan 3: Enterprise */}
          <div className="p-8 glass-card border border-border/40 dark:border-border/10 rounded-3xl text-left bg-surface/50 dark:bg-card/20 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Enterprise</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">₹4,999 <span className="text-xs text-slate-450 font-semibold font-mono">/ Month</span></p>
              <p className="text-[11px] text-slate-500">Custom capabilities for large sales organizations and enterprises.</p>
              <div className="h-px bg-border/40 dark:bg-white/10 my-4" />
              <ul className="space-y-2.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Unlimited workspaces & users</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Full Analytics Suite</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Role-based access control</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Dedicated account manager</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>24/7 priority support</span></li>
                <li className="flex items-center gap-2"><Check size={12} className="text-success" /><span>Custom onboarding & training</span></li>
              </ul>
            </div>
            <Link to="/register" className="mt-8 block">
              <button className="w-full py-2.5 text-xs font-bold rounded-xl border border-border dark:border-border/20 text-slate-800 dark:text-white hover:bg-hover transition-all cursor-pointer">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </section >

      {/* 11. FAQ ACCORDION SECTION */}
      <section id="faq" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10" >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5">
            Common questions from sales teams evaluating AURA CRM.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 text-left">
          {[
            { q: 'What is AURA CRM?', a: 'AURA CRM is a full-featured customer relationship management platform designed for startup sales teams. It helps you manage leads, contacts, sales pipelines, WhatsApp conversations, source analytics, and revenue reporting from a single, modern workspace.' },
            { q: 'How secure is my CRM data?', a: 'All data is protected with JSON Web Token (JWT) authentication, encrypted credentials, and per-user workspace isolation. Your data is stored on cloud infrastructure with strict access controls — no other user can access your records.' },
            { q: 'Can I export my leads and contacts?', a: 'Yes. You can instantly export your currently filtered lead list to CSV directly from the Lead Management dashboard with a single click — no setup or additional tools required.' },
            { q: 'Does AURA CRM support WhatsApp?', a: 'Yes. AURA CRM includes a WhatsApp CRM integration that lets you initiate a WhatsApp conversation with any lead directly from their record. It links the contact\'s phone number to wa.me for instant, one-click outreach.' },
            { q: 'Can multiple team members collaborate?', a: 'Yes. The Professional and Enterprise plans include team collaboration tools — assign leads to specific sales reps, coordinate follow-up tasks, share notes, and monitor individual team performance from the analytics dashboard.' },
            { q: 'Is my data backed up automatically?', a: 'Yes. Your CRM data is hosted on cloud infrastructure with automated daily backups, 99.9% uptime SLA, and redundant storage to protect against data loss.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card border border-border/40 dark:border-border/10 rounded-2xl overflow-hidden bg-surface/50 dark:bg-card/25">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-slate-909 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-all duration-300 shrink-0 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-5 pb-5 pt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-border/20 dark:border-border/5">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section >

      {/* 12. CONTACT SECTION */}
      <section id="contact" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 dark:border-border/10 lg:flex lg:gap-12" >
        {/* LHS contacts */}
        <div className="lg:w-1/2 text-left space-y-6" >
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
            Get in Touch
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
            Have questions about AURA CRM features, pricing, or enterprise integrations? Our product team will respond within 12 hours.
          </p>

          <div className="space-y-4 pt-4 text-xs font-medium text-slate-650 dark:text-slate-350 select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Mail size={14} />
              </div>
              <span>support@auracrm.dev</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Phone size={14} />
              </div>
              <span>+91 9876543210</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <MapPin size={14} />
              </div>
              <span>Madnapalle, India</span>
            </div>
          </div>
        </div >

        {/* RHS form */}
        <div className="lg:w-1/2 mt-10 lg:mt-0" >
          <div className="glass-card border border-border/40 dark:border-border/10 rounded-3xl p-6 sm:p-8 bg-surface/75 dark:bg-card/75 shadow-xl text-left">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-5">Send a Message</h4>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="contact-name" className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your full name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="block w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="contact-email" className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="block w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-company" className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Company</label>
                <input
                  id="contact-company"
                  type="text"
                  placeholder="Your company or startup name"
                  value={contactForm.company}
                  onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                  className="block w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="contact-message" className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Tell us about your sales team size, current CRM challenges, or questions..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="block w-full px-3 py-2.5 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all mt-2"
              >
                {formSubmitted ? 'Message Sent! ✓' : 'Send Message'}
              </button>
            </form>
          </div>
        </div >
      </section >

      {/* 13. FINAL CTA */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20" >
        <div className="glass-card border-2 border-primary/20 dark:border-primary/10 rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-500/5 via-primary/5 to-purple-500/5 dark:bg-slate-900/30 relative overflow-hidden shadow-2xl">

          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-905 dark:text-white tracking-tight">
              Ready to Grow Your Sales Pipeline?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Join 500+ businesses already using AURA CRM to manage leads, close deals, and grow revenue. Start free — no credit card required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              {token ? (
                <Link to="/dashboard">
                  <ShimmerButton px="px-6" py="py-3" className="border border-blue-400/20 text-xs shadow-lg">
                    <span>Enter Dashboard</span>
                  </ShimmerButton>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <ShimmerButton px="px-6" py="py-3" className="border border-blue-400/20 text-xs shadow-lg">
                      <span>Create Free Account</span>
                    </ShimmerButton>
                  </Link>
                  <Link to="/login">
                    <button className="px-5 py-3 text-xs font-bold rounded-xl border border-border/80 dark:border-border/10 text-slate-805 dark:text-white bg-surface dark:bg-card hover:bg-hover transition-all cursor-pointer">
                      Login Now
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section >

      {/* 14. FOOTER */}
      <footer className="border-t border-border/40 dark:border-border/10 bg-bg/60 dark:bg-slate-950/40 py-12 relative select-none" >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Logo className="w-8 h-8 text-primary" />
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">AURA<span className="text-primary">CRM</span></span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed max-w-xs">
              A premium CRM platform for modern sales teams — manage leads, contacts, pipelines, and analytics from one powerful workspace.
            </p>
          </div>

          <div>
            <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Product</h5>
            <ul className="space-y-2 text-[10px] font-semibold text-slate-500 dark:text-slate-450">
              <li><button onClick={() => scrollToSection('features')} className="hover:text-primary transition-colors cursor-pointer">Features</button></li>
              <li><button onClick={() => scrollToSection('showcase')} className="hover:text-primary transition-colors cursor-pointer">Live Showcase</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary transition-colors cursor-pointer">Pricing Plans</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Legal</h5>
            <ul className="space-y-2 text-[10px] font-semibold text-slate-500 dark:text-slate-450">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="hover:text-primary transition-colors">Security Details</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">Company</h5>
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-relaxed">
              &copy; 2026 AuraCRM Systems, Inc. All rights reserved.
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-2 leading-relaxed">
              Developed by <a href="https://bhojanapudevaraj.dev" target="_blank" rel="noopener noreferrer" className="font-extrabold hover:text-primary hover:underline">Deva Raj Bhojanapu</a>
            </p>
          </div>

        </div>
      </footer >

    </div >
  );
};

export default Landing;
