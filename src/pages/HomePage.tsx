import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
};

// Animated Section Wrapper
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const { ref, isVisible } = useScrollAnimation();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const HomePage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Stats with animated counters
  const stat1 = useCountUp(2500);
  const stat2 = useCountUp(50);
  const stat3 = useCountUp(15000);
  const stat4 = useCountUp(99);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          stat1.setIsVisible(true);
          stat2.setIsVisible(true);
          stat3.setIsVisible(true);
          stat4.setIsVisible(true);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      title: 'Project Management',
      description: 'Track every project from initial quote to final completion with detailed stages, tasks, and real-time progress tracking.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      title: 'Smart Quoting',
      description: 'Generate professional, accurate quotes in minutes with automatic material calculations and dynamic pricing rules.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Financial Tracking',
      description: 'Monitor costs, revenue, and profit margins with real-time dashboards and comprehensive financial reporting.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Team Coordination',
      description: 'Assign tasks, track worker hours, and coordinate your entire team with an intuitive scheduling system.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Material Calculator',
      description: 'Automatically calculate exact material quantities based on project area with built-in wastage factors.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Mobile Access',
      description: 'Access your entire business from anywhere with our fully responsive design optimized for all devices.',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const roles = [
    { role: 'System Owner', desc: 'Complete business oversight with financial controls, team management, and strategic analytics.', features: ['Revenue & Profit Analytics', 'Pricing Configuration', 'User Management', 'Business Reports'] },
    { role: 'Sales Admin', desc: 'Drive growth with lead management, site visit scheduling, and customer relationship tools.', features: ['Lead Pipeline', 'Site Visit Calendar', 'Customer Communications', 'Follow-up Automation'] },
    { role: 'Quantity Surveyor', desc: 'Precise calculations and professional quotes with our intelligent estimation tools.', features: ['Material Calculator', 'Quote Builder', 'Cost Analysis', 'Specification Management'] },
    { role: 'Designer', desc: 'Bring visions to life with design management, client collaboration, and revision tracking.', features: ['Design Upload', 'Version History', 'Client Approval Flow', '3D Visualization Support'] },
    { role: 'Project Manager', desc: 'Deliver projects on time with comprehensive planning, task management, and team coordination.', features: ['Gantt Timeline', 'Task Assignment', 'Progress Tracking', 'Resource Allocation'] },
    { role: 'Field Worker', desc: 'Stay productive on-site with daily task lists, time tracking, and easy photo documentation.', features: ['Daily Schedule', 'Time Logging', 'Photo Upload', 'Task Completion'] },
  ];

  const steps = [
    { number: '01', title: 'Set Up Your Business', description: 'Configure your services, pricing rules, and team members in minutes with our guided setup wizard.' },
    { number: '02', title: 'Win More Projects', description: 'Create professional quotes, manage site visits, and convert leads into customers effortlessly.' },
    { number: '03', title: 'Deliver Excellence', description: 'Execute projects flawlessly with real-time coordination, progress tracking, and quality control.' },
  ];

  const testimonials = [
    { quote: "GreenScape has revolutionized our operations. We've reduced admin time by 60% and increased our project capacity by 40% in just six months.", author: 'James Wilson', role: 'Managing Director', company: 'Wilson Landscapes Ltd', rating: 5 },
    { quote: "The quoting system alone has transformed our business. What took hours now takes minutes, and our win rate has improved dramatically.", author: 'Sarah Mitchell', role: 'Operations Manager', company: 'Garden Masters UK', rating: 5 },
    { quote: "Finally, software that understands landscaping. The material calculator has saved us thousands in over-ordering and waste.", author: 'David Thompson', role: 'Founder', company: 'Elite Groundworks', rating: 5 },
  ];

  const LeafLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L12 22l8.7-5c.8-1.5 1.3-3.2 1.3-5 0-5.5-4.5-10-10-10z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20M12 6c-2 2-3 5-3 8M12 6c2 2 3 5 3 8" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-sage-900/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center shadow-lg shadow-sage-500/30 group-hover:shadow-sage-500/50 group-hover:scale-105 transition-all duration-300">
                <LeafLogo className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${scrolled ? 'text-sage-900' : 'text-white'}`}>GreenScape</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'How It Works', 'Testimonials'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`font-medium transition-all duration-300 hover:scale-105 ${scrolled ? 'text-gray-600 hover:text-sage-600' : 'text-white/90 hover:text-white'}`}>
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/login" className={`font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:scale-105 ${scrolled ? 'text-sage-700 hover:bg-sage-50' : 'text-white hover:bg-white/10'}`}>
                Sign In
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-sage-600 to-sage-700 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-sage-700 hover:to-sage-800 transition-all duration-300 shadow-lg shadow-sage-600/30 hover:shadow-sage-600/50 hover:scale-105">
                Get Started
              </Link>
            </div>

            <button className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-sage-50' : 'hover:bg-white/10'}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <svg className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className={`w-6 h-6 ${scrolled ? 'text-gray-700' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
            
          </div>
        </div>

        <div className={`lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="bg-white border-t border-sage-100 px-4 py-6 space-y-4 shadow-xl">
            <a href="#features" className="block text-gray-700 hover:text-sage-600 font-medium py-2">Features</a>
            <a href="#how-it-works" className="block text-gray-700 hover:text-sage-600 font-medium py-2">How It Works</a>
            <a href="#testimonials" className="block text-gray-700 hover:text-sage-600 font-medium py-2">Testimonials</a>
            <div className="pt-4 border-t border-sage-100 space-y-3">
              <Link to="/login" className="block text-center text-sage-700 font-semibold py-2">Sign In</Link>
              <Link to="/register" className="block text-center bg-gradient-to-r from-sage-600 to-sage-700 text-white py-3 rounded-xl font-semibold">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Full Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&h=1080&fit=crop"
            alt="Beautiful landscaped garden"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-sage-900/95 via-sage-900/80 to-sage-900/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-sage-950/50 via-transparent to-sage-900/30"></div>
        </div>

        {/* Animated Particles/Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Shapes */}
        <div
          className="absolute w-96 h-96 bg-sage-500/10 rounded-full blur-3xl transition-transform duration-1000"
          style={{
            left: '10%',
            top: '20%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl transition-transform duration-1000"
          style={{
            right: '15%',
            bottom: '25%',
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px)`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-semibold mb-8">
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in-up">
              Transform Your
              <span className="block mt-2 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-sage-300 via-emerald-300 to-sage-300 animate-gradient">
                Landscaping Business
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-sage-100/90 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              The all-in-one platform for quotes, projects, teams, and finances. Built specifically for landscaping professionals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-300">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-3 bg-white text-sage-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sage-50 transition-all duration-300 shadow-2xl shadow-black/20 hover:shadow-black/30 hover:scale-105"
              >
                Start Free Trial
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="group inline-flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM1ZjdhNWYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        {/* Top and bottom borders */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { count: stat1.count, suffix: '+', label: 'Active Users', sublabel: 'UK landscaping professionals' },
              { count: stat2.count, prefix: '£', suffix: 'M+', label: 'Quotes Generated', sublabel: 'Total value processed' },
              { count: stat3.count, suffix: '+', label: 'Projects Completed', sublabel: 'Successfully delivered' },
              { count: stat4.count, suffix: '.9%', label: 'Uptime', sublabel: 'Enterprise reliability' },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl sm:text-5xl font-bold text-sage-800 mb-2 group-hover:scale-110 group-hover:text-sage-600 transition-all duration-300">
                  {stat.prefix}{stat.count.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-sage-700 font-semibold mb-1">{stat.label}</div>
                <div className="text-sage-500 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-sage-50 to-sage-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white text-sage-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-700"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Purpose-built tools designed specifically for the unique challenges of running a landscaping business.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group relative bg-white border border-sage-100 rounded-2xl p-8 hover:shadow-2xl hover:shadow-sage-900/10 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-14 h-14 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-sage-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sage-700 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sage-500 to-sage-600 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-sage-50 to-sage-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white text-sage-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get Started in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-700"> Three Steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From signup to success in minutes, not months. Our intuitive platform gets you productive from day one.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-sage-300 to-sage-200"></div>
                  )}
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-sage-900/5 border border-sage-100 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-sage-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sage-500/30">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section - Same icon color for all */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Role-Based Access
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-sage-700"> Entire Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored dashboards and permissions for every role, from business owners to field workers.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((item, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:shadow-sage-900/10 transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sage-500/30 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-sage-700 transition-colors">{item.role}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-sage-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sage-800 text-sage-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Customer Stories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Trusted by Landscaping
              <span className="text-sage-300"> Professionals</span>
            </h2>
            <p className="text-xl text-sage-300 max-w-2xl mx-auto">
              See why over 2,500 UK businesses have chosen GreenScape to power their growth.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="bg-sage-800/50 backdrop-blur-sm rounded-2xl p-8 border border-sage-700/50 hover:bg-sage-800/70 transition-all duration-500 hover:-translate-y-1 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <svg className="w-10 h-10 text-sage-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-sage-100 mb-6 leading-relaxed text-lg">{testimonial.quote}</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <p className="text-sage-400 text-sm">{testimonial.role}</p>
                      <p className="text-sage-500 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-sage-600 via-sage-700 to-sage-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sage-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <AnimatedSection className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Landscaping Business?
          </h2>
          <p className="text-xl text-sage-100 mb-10 max-w-2xl mx-auto">
            Join 2,500+ landscaping professionals who have streamlined their operations and grown their business with GreenScape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="group inline-flex items-center justify-center gap-2 bg-white text-sage-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sage-50 transition-all duration-300 shadow-xl hover:scale-105">
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </Link>
          </div>
          <p className="text-sage-200 text-sm mt-8">
            Complete workflow management • Photo uploads • Expense tracking • Mobile apps
          </p>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="bg-sage-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <div className="w-11 h-11 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <LeafLogo className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">GreenScape</span>
              </Link>
              <p className="text-sage-400 mb-6 max-w-sm">
                The complete landscaping management platform trusted by over 2,500 UK businesses to streamline operations and drive growth.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'instagram'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-sage-800 rounded-lg flex items-center justify-center text-sage-400 hover:bg-sage-700 hover:text-white transition-all duration-300 hover:scale-110">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />}
                      {social === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                      {social === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Workflow', 'Mobile Apps', 'Updates'] },
              { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3 text-sage-400">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-sage-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sage-500 text-sm">
              © 2025 GreenScape. All rights reserved. Made with 💚 in the UK
            </p>
            <div className="flex items-center gap-6 text-sage-500 text-sm">
              <span>🇬🇧 United Kingdom</span>
              <span>£ GBP</span>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  );
};

export default HomePage;