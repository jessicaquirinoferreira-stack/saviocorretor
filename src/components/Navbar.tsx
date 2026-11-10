import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { MessageCircle, Menu, X, Building2, PhoneCall, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Início', route: '/' },
    { label: 'Imóveis', route: '/imoveis' },
    { label: 'Lançamentos', route: '/lancamentos' },
    { label: 'Sobre Sávio', route: '/sobre' },
    { label: 'Contato', route: '/contato' },
  ];

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Acessei o site oficial e gostaria de atendimento sobre imóveis de alto padrão.'
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080c14]/90 backdrop-blur-md border-b border-amber-500/15 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-[#080c14]/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.commercialName || 'Sávio Imóveis'}
              className="h-11 sm:h-12 w-auto object-contain bg-transparent group-hover:scale-105 transition-transform drop-shadow-[0_2px_12px_rgba(217,119,6,0.25)]"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-cinzel text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
          )}
          <div>
            <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-slate-100 block">
              {settings.commercialName || 'SÁVIO IMÓVEIS'}
            </span>
            <span className="text-[10px] tracking-widest uppercase text-amber-400/90 font-medium block">
              Alto Padrão & Investimentos
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className={`px-3 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium tracking-wide transition-all ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Direct Action */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-4 py-2 rounded-full text-xs lg:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Falar com Sávio</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d121f] border-b border-amber-500/20 overflow-hidden px-4 py-4"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => {
                    navigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === link.route
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold py-3 rounded-lg text-sm shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atendimento WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
