import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property, LeadInterest } from '../types';
import {
  Search,
  Building,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Home,
  CheckCircle,
  MapPin,
  TrendingUp,
  KeyRound,
  FileCheck2,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { trackEvent } from '../lib/analytics';

interface HomePageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: Property, defaultInterest?: LeadInterest) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenLeadModal }) => {
  const { settings, properties, developments } = useSettings();

  // Quick Search States
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterPurpose, setFilterPurpose] = useState<string>('venda');
  const [filterLocation, setFilterLocation] = useState<string>('');

  const featuredProperties = properties.filter((p) => p.published && p.featured);
  const showcaseProperties = featuredProperties.length > 0 ? featuredProperties : properties.filter(p => p.published);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Vi seu site oficial e gostaria de agendar uma consultoria exclusiva para aquisição de imóveis de alto padrão.'
  )}`;

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filterPurpose && filterPurpose !== 'todos') params.set('finalidade', filterPurpose);
    if (filterType && filterType !== 'todos') params.set('tipo', filterType);
    if (filterLocation.trim()) params.set('busca', filterLocation.trim());
    navigate(`/imoveis?${params.toString()}`);
  };

  // Dynamic Hero Slides from Developments and Properties
  const heroSlides = React.useMemo(() => {
    const list: Array<{
      image: string;
      title: string;
      location: string;
      tag: string;
      link: string;
    }> = [];

    // Add developments first
    developments.forEach((dev) => {
      if (dev.images && dev.images.length > 0) {
        list.push({
          image: dev.images[0],
          title: dev.name,
          location: `${dev.neighborhood}, ${dev.city} • ${dev.developer}`,
          tag: dev.status === 'lancamento' ? 'Lançamento Exclusivo' : 'Empreendimento de Luxo',
          link: '/lancamentos',
        });
      }
    });

    // Add featured properties
    properties.filter((p) => p.published).forEach((prop) => {
      list.push({
        image: prop.mainImage,
        title: prop.title,
        location: `${prop.neighborhood}, ${prop.city}`,
        tag: prop.propertyType === 'casa' ? 'Mansão de Alto Padrão' : prop.propertyType === 'cobertura' ? 'Cobertura Duplex' : 'Residência Nobre',
        link: `/imovel/${prop.slug}`,
      });
    });

    // Fallback if empty
    if (list.length === 0) {
      list.push({
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
        title: 'Mansão Contemporânea com Borda Infinita',
        location: 'Alphaville, São Paulo',
        tag: 'Empreendimento de Luxo',
        link: '/imoveis',
      });
    }

    return list;
  }, [developments, properties]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide rotation every 4.5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* 1. CINEMATIC HERO SLIDESHOW */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
        {/* Animated Background Slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          <AnimatePresence mode="sync">
            <motion.div
              key={heroSlides[currentSlide]?.image || currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={heroSlides[currentSlide]?.image}
                alt={heroSlides[currentSlide]?.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Vignette and overlays for optimal text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/75 to-[#080c14]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

          {/* Slide Navigation Arrows */}
          <div className="absolute inset-y-0 left-2 sm:left-6 flex items-center z-20">
            <button
              onClick={() => setCurrentSlide((prev) => (prev > 0 ? prev - 1 : heroSlides.length - 1))}
              className="p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"
              aria-label="Foto anterior do empreendimento"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-2 sm:right-6 flex items-center z-20">
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110"
              aria-label="Próxima foto do empreendimento"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Floating Pill on bottom with current active development name */}
          <div className="absolute bottom-4 left-4 sm:left-8 z-20 hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate(heroSlides[currentSlide]?.link || '/lancamentos')}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/30 text-xs text-slate-200 hover:border-amber-400 hover:bg-slate-900 transition-all group"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 font-semibold">{heroSlides[currentSlide]?.tag}:</span>
              <span className="font-medium text-slate-100 group-hover:text-amber-300 transition-colors">
                {heroSlides[currentSlide]?.title}
              </span>
              <span className="text-[10px] text-slate-400">({heroSlides[currentSlide]?.location})</span>
              <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Slide Indicator Dots on bottom right */}
          <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex items-center gap-1.5">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? 'w-6 bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{settings.heroBadge || 'Seleção Exclusiva de Alto Padrão • @imoveiscomsavio'}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
          >
            {settings.heroTitle || 'Imóveis Singulares para Vidas Extraordinárias'}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-serif-luxury text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed"
          >
            {settings.heroSubtitle || 'Casas de alto padrão, coberturas exclusivas e investimentos imobiliários com assessoria personalizada de Sávio.'}
          </motion.p>

          {/* QUICK SEARCH MODULE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-6 max-w-4xl mx-auto"
          >
            <form
              onSubmit={handleQuickSearch}
              className="bg-[#0d121f]/95 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-amber-500/30 shadow-2xl shadow-black/80 space-y-4"
            >
              {/* Negotiation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                {[
                  { id: 'venda', label: 'Comprar' },
                  { id: 'aluguel', label: 'Alugar' },
                  { id: 'lancamento', label: 'Lançamentos' },
                  { id: 'todos', label: 'Todos' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilterPurpose(item.id)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all ${
                      filterPurpose === item.id
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1 text-left">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 outline-none focus:border-amber-500 transition-colors"
                  >
                    <option value="todos">Todos os tipos</option>
                    <option value="casa">Casas & Mansões</option>
                    <option value="apartamento">Apartamentos</option>
                    <option value="cobertura">Coberturas</option>
                    <option value="terreno">Terrenos em Condomínio</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1 text-left">
                    Bairro ou Região
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alphaville, Jardins, Itaim..."
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-200 outline-none focus:border-amber-500 transition-colors placeholder:text-slate-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Search className="w-4 h-4" />
                    <span>Buscar Imóveis</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. NUMBERS & CREDIBILITY STRIP */}
      <section className="py-8 border-y border-slate-800/80 bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-slate-800/60 last:border-none">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block mb-1">
                {properties.length}+
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Imóveis Catalogados
              </span>
            </div>
            <div className="p-4 border-r border-slate-800/60 last:border-none">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block mb-1">
                100%
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Atendimento Personalizado
              </span>
            </div>
            <div className="p-4 border-r border-slate-800/60 last:border-none">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block mb-1">
                Exclusivo
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Alto Padrão & Segurança
              </span>
            </div>
            <div className="p-4">
              <span className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-400 block mb-1">
                Direto
              </span>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Com o Corretor Sávio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (IMÓVEIS EM DESTAQUE) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Seleção Criteriosa</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-100">
              Imóveis em Destaque
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Propriedades singulares que combinam localização nobre, acabamento impecável e valorização patrimonial garantida.
            </p>
          </div>

          <button
            onClick={() => navigate('/imoveis')}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold group self-start md:self-auto"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseProperties.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={(slug) => navigate(`/imovel/${slug}`)}
              onOpenLeadModal={(p) => onOpenLeadModal(p, 'visita')}
            />
          ))}
        </div>
      </section>

      {/* 4. DEVELOPMENTS HIGHLIGHT (LANÇAMENTOS) */}
      {developments.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-[#0a0f1d] to-[#080c14] border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-2">
                  Empreendimentos & Oportunidades
                </span>
                <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-100">
                  Lançamentos Imobiliários
                </h2>
              </div>
              <button
                onClick={() => navigate('/lancamentos')}
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-semibold group self-start md:self-auto"
              >
                <span>Conhecer Todos os Lançamentos</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {developments.slice(0, 2).map((dev) => (
                <div
                  key={dev.id}
                  className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0d121f] group hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <img
                      src={dev.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                      alt={dev.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-black/30 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                      {dev.status === 'lancamento' ? 'Lançamento Exclusivo' : dev.status === 'em_obras' ? 'Em Construção' : 'Pronto para Morar'}
                    </span>
                    <span className="absolute bottom-4 left-4 text-xs text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{dev.neighborhood}, {dev.city} — {dev.developer}</span>
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100">
                      {dev.name}
                    </h3>
                    <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {dev.description}
                    </p>
                    <div className="text-xs text-amber-300/90 font-medium">
                      {dev.typologies}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">A partir de</span>
                        <span className="font-cinzel text-lg sm:text-xl font-bold text-amber-400">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(dev.minPrice)}
                        </span>
                      </div>
                      <button
                        onClick={() => onOpenLeadModal(undefined, 'visita')}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all"
                      >
                        Receber Apresentação
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. ABOUT SÁVIO & METHODOLOGY */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photo & Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/10 bg-slate-900 aspect-[3/4] max-h-[500px]">
              <img
                src={settings.avatarUrl || 'https://i.postimg.cc/7ZfPHyFy/Whats-App-Image-2026-11-10-at-09-09-47.jpg'}
                alt={settings.brokerName || 'Sávio Corretor'}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block">
                  Corretor Responsável
                </span>
                <h4 className="font-cinzel text-lg font-bold text-white">
                  {settings.brokerName || 'Sávio'}
                </h4>
                <p className="text-xs text-slate-300">
                  {settings.creci || 'CRECI em homologação'} • @imoveiscomsavio
                </p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block">
              Assessoria & Credibilidade
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-slate-100">
              Mais que intermediar imóveis, conectamos projetos de vida.
            </h2>
            <p className="font-serif-luxury text-lg text-slate-300 leading-relaxed italic">
              "{settings.bio || 'Especialista em assessoria imobiliária de alto padrão, atuando com discrição, segurança jurídica e excelência técnica.'}"
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.aboutExperience}
            </p>

            {/* Differentials List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Segurança Jurídica</h5>
                  <p className="text-xs text-slate-400">Due diligence completa em cada certidão e contrato.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Seleção Rigorosa</h5>
                  <p className="text-xs text-slate-400">Apenas imóveis com arquitetura nobre e liquidez real.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Atendimento Concierge</h5>
                  <p className="text-xs text-slate-400">Flexibilidade de horários e assessoria 1 a 1.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Visão de Investimento</h5>
                  <p className="text-xs text-slate-400">Análise de rentabilidade e valorização de capital.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-3 rounded-full text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Conversar com Sávio no WhatsApp</span>
              </a>

              <button
                onClick={() => navigate('/sobre')}
                className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold transition-colors"
              >
                Conhecer Trajetória
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT CAPTURE TABS (QUERO COMPRAR / QUERO VENDER / INVESTIR) */}
      <section className="py-20 bg-[#0a0e18] border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-2">
            Como Podemos Ajudar Você?
          </span>
          <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
            Consultoria Sob Medida
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-10">
            Seja para encontrar sua nova residência de alto padrão ou disponibilizar seu patrimônio para compradores qualificados.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => onOpenLeadModal(undefined, 'comprar')}
              className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-amber-500/40 cursor-pointer text-left group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-2">Quero Comprar</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Receba uma seleção confidencial de imóveis compatíveis com seu estilo de vida.
              </p>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Iniciar Busca <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'vender')}
              className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-amber-500/40 cursor-pointer text-left group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-2">Quero Vender</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Anuncie seu imóvel com produção audiovisual premium e alcance clientes de alto poder aquisitivo.
              </p>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Cadastrar Imóvel <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'investir')}
              className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-amber-500/40 cursor-pointer text-left group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-2">Quero Investir</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Acesse oportunidades com alta taxa de valorização e renda de locação corporativa.
              </p>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Consultar Oportunidades <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div
              onClick={() => onOpenLeadModal(undefined, 'informacao')}
              className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 hover:border-amber-500/40 cursor-pointer text-left group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-2">Avaliar Meu Imóvel</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Estudo mercadológico comparativo de valor de venda baseado em transações reais.
              </p>
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Solicitar Estudo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
