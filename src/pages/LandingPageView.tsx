import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { LandingPage, Property, Development } from '../types';
import {
  MessageCircle,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Send,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

interface LandingPageViewProps {
  slug: string;
  navigate: (route: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ slug, navigate }) => {
  const { landingPages, properties, developments, settings, submitLead } = useSettings();

  const landingPage = landingPages.find((l) => l.slug === slug) || landingPages[0];

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (landingPage) {
      trackEvent('page_view', {
        targetId: landingPage.id,
        targetTitle: landingPage.title,
        pageUrl: `/oferta/${landingPage.slug}`,
      });
    }
  }, [slug, landingPage]);

  if (!landingPage) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 pt-32 px-4 text-center">
        <h2 className="text-2xl font-cinzel font-bold text-amber-400 mb-4">Oferta não encontrada</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
        >
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  // Linked target (property or dev)
  let linkedProperty: Property | undefined;
  let linkedDev: Development | undefined;
  if (landingPage.targetType === 'property' && landingPage.targetId) {
    linkedProperty = properties.find((p) => p.id === landingPage.targetId);
  } else if (landingPage.targetType === 'development' && landingPage.targetId) {
    linkedDev = developments.find((d) => d.id === landingPage.targetId);
  }

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappText = `Olá Sávio! Estou acessando a página especial da oferta "${landingPage.title}" e gostaria de receber a tabela e agendar uma visita.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(directWhatsappText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    setLeadSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const campaign = urlParams.get('utm_campaign') || urlParams.get('campaign') || 'Campanha Landing Page';
      const utmSource = urlParams.get('utm_source') || 'Instagram/Ads';

      await submitLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim() || undefined,
        interestType: 'visita',
        propertyId: landingPage.id,
        propertyTitle: landingPage.title,
        message: `Interesse registrado na landing page exclusiva: ${landingPage.title}`,
        origin: `Landing Page / ${utmSource}`,
        campaign,
        pageUrl: window.location.href,
      });

      trackEvent('lead_submit', {
        targetId: landingPage.id,
        targetTitle: landingPage.title,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981']
      });

      setLeadSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* 1. LANDING PAGE HERO */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 px-4">
        <div className="absolute inset-0 z-0">
          <img
            src={landingPage.bannerImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=80'}
            alt={landingPage.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/85 to-[#080c14]/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>Condição Exclusiva • Assessoria @imoveiscomsavio</span>
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            {landingPage.headline || landingPage.title}
          </h1>

          <p className="font-serif-luxury text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            {landingPage.subheadline}
          </p>

          {/* Quick CTA */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#formulario"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              Garantir Condição Exclusiva
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { targetId: landingPage.id, targetTitle: landingPage.title })}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600/30 border border-emerald-500/50 hover:bg-emerald-600/40 text-emerald-300 font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-300" />
              <span>Falar no WhatsApp</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link copiado!' : 'Copiar link da oferta'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HIGHLIGHTS & SPECS */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block mb-2">
              Diferenciais da Oportunidade
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 mb-6">
              Por que esta propriedade é ímpar no mercado:
            </h2>

            <div className="space-y-4">
              {landingPage.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0d121f] border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-200">{h}</span>
                </div>
              ))}
            </div>

            {linkedProperty && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs space-y-2">
                <div className="text-amber-400 font-bold uppercase tracking-wider">Ficha Rápida do Imóvel:</div>
                <div className="text-slate-300">
                  {linkedProperty.area} m² • {linkedProperty.bedrooms} Quartos ({linkedProperty.suites} Suítes) • {linkedProperty.parkingSpots} Vagas
                </div>
                <div className="text-slate-400">
                  Localização: {linkedProperty.neighborhood}, {linkedProperty.city}
                </div>
              </div>
            )}
          </div>

          {/* Form Box */}
          <div id="formulario" className="bg-[#0d121f] rounded-2xl border border-amber-500/40 p-6 sm:p-8 shadow-2xl">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 mb-2">
              Solicitar Condições Exclusivas
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Apenas os cadastros registrados nesta página terão acesso às condições especiais de negociação e atendimento com Sávio.
            </p>

            {!leadSuccess ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{leadSubmitting ? 'Registrando...' : 'Quero Receber as Condições'}</span>
                </button>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
                <h4 className="font-cinzel text-xl font-bold text-slate-100">
                  Cadastro Confirmado!
                </h4>
                <p className="text-xs text-slate-300">
                  O corretor Sávio entrará em contato via WhatsApp para apresentar o material exclusivo.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Falar Agora com Sávio no WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. GALLERY IF PRESENT */}
      {landingPage.gallery && landingPage.gallery.length > 0 && (
        <section className="py-12 bg-slate-950/60 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="font-cinzel text-xl font-bold text-center text-slate-100 mb-8">
              Perspectivas & Imagens da Propriedade
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {landingPage.gallery.map((img, i) => (
                <div key={i} className="h-64 rounded-xl overflow-hidden border border-slate-800">
                  <img src={img} alt="Foto da landing page" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
