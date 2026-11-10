import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { FinancingSimulator } from '../components/FinancingSimulator';
import { Property, LeadInterest } from '../types';
import {
  Maximize2,
  Bed,
  Bath,
  Car,
  MapPin,
  Calendar,
  Share2,
  MessageCircle,
  Check,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  PlayCircle,
  Copy,
  ChevronLeft,
  ChevronRight,
  Send,
  Building,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

interface PropertyDetailPageProps {
  slug: string;
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: Property, defaultInterest?: LeadInterest) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  slug,
  navigate,
  onOpenLeadModal
}) => {
  const { properties, settings, submitLead } = useSettings();

  const property = properties.find((p) => p.slug === slug) || properties[0];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Embedded Inquiry Form States
  const [leadName, setLeadName] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadEmail, setLeadEmail] = useState<string>('');
  const [leadMessage, setLeadMessage] = useState<string>(
    property ? `Olá Sávio, gostaria de agendar uma visita ao imóvel ${property.title} (Cód: ${property.code}).` : ''
  );
  const [leadSubmitting, setLeadSubmitting] = useState<boolean>(false);
  const [leadSuccess, setLeadSuccess] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (property) {
      trackEvent('property_view', {
        targetId: property.id,
        targetTitle: property.title,
        pageUrl: `/imovel/${property.slug}`,
      });
    }
  }, [slug, property]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 pt-32 px-4 text-center">
        <h2 className="text-2xl font-cinzel font-bold text-amber-400 mb-4">Imóvel não encontrado</h2>
        <button
          onClick={() => navigate('/imoveis')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
        >
          Voltar para o catálogo
        </button>
      </div>
    );
  }

  const galleryImages = [
    property.mainImage,
    ...(property.gallery || []).filter((img) => img !== property.mainImage),
  ].filter(Boolean);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappText = `Olá Sávio! Gostaria de agendar uma visita e saber mais sobre o imóvel "${property.title}" (Cód: ${property.code}) anunciado no seu site.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(directWhatsappText)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleShareWhatsapp = () => {
    const text = `Confira este imóvel espetacular em ${property.neighborhood}: ${property.title} - ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadPhone.trim()) return;

    setLeadSubmitting(true);
    try {
      await submitLead({
        name: leadName.trim(),
        phone: leadPhone.trim(),
        email: leadEmail.trim() || undefined,
        interestType: 'visita',
        propertyId: property.id,
        propertyTitle: property.title,
        message: leadMessage.trim(),
        origin: 'Formulário Detalhe do Imóvel',
        pageUrl: window.location.href,
      });

      trackEvent('lead_submit', {
        targetId: property.id,
        targetTitle: property.title,
      });

      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#d97706', '#10b981']
      });

      setLeadSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  // Similar properties
  const similarProperties = properties
    .filter((p) => p.id !== property.id && p.published)
    .slice(0, 3);

  const formatPrice = (val: number, type: Property['negotiationType']) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
    return type === 'aluguel' ? `${formatted} /mês` : formatted;
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/imoveis')}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao catálogo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link copiado!' : 'Copiar Link'}</span>
            </button>

            <button
              onClick={handleShareWhatsapp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-xs text-emerald-300 hover:bg-emerald-600/30 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        {/* 1. PHOTO GALLERY (Main + Thumbnails) */}
        <div className="space-y-3 mb-10">
          <div className="relative h-[360px] sm:h-[500px] lg:h-[580px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={galleryImages[activeImageIndex] || property.mainImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900/90 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                {property.negotiationType === 'venda' ? 'Venda Exclusiva' : property.negotiationType === 'aluguel' ? 'Locação de Alto Padrão' : 'Lançamento'}
              </span>
              {property.featured && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Destaque</span>
                </span>
              )}
            </div>

            {/* Code */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/70 backdrop-blur-md text-slate-200 border border-white/10">
                Código: {property.code}
              </span>
            </div>

            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Photo Counter */}
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs text-slate-200">
              Foto {activeImageIndex + 1} de {galleryImages.length}
            </div>
          </div>

          {/* Thumbnails row */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 sm:w-28 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. MAIN DETAILS & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Left Column (Specs, Description, Features) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 uppercase tracking-widest font-semibold mb-2">
                <MapPin className="w-4 h-4" />
                <span>{property.neighborhood}, {property.city} — {property.state}</span>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-slate-100 leading-snug mb-3">
                {property.title}
              </h1>
              {property.address && (
                <p className="text-sm text-slate-400">
                  {property.address}
                </p>
              )}
            </div>

            {/* Technical Specifications Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#0d121f] border border-slate-800 text-center">
              <div className="p-2 border-r border-slate-800 last:border-none">
                <Maximize2 className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-lg text-slate-100 block">{property.area} m²</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Área Total</span>
              </div>
              <div className="p-2 border-r border-slate-800 last:border-none">
                <Bed className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-lg text-slate-100 block">{property.bedrooms}</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Dormitórios</span>
              </div>
              <div className="p-2 border-r border-slate-800 last:border-none">
                <Bath className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-lg text-slate-100 block">{property.suites}</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Suítes</span>
              </div>
              <div className="p-2">
                <Car className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <span className="font-bold text-lg text-slate-100 block">{property.parkingSpots}</span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400">Vagas Cobertas</span>
              </div>
            </div>

            {/* Full Commercial Description */}
            <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
              <h3 className="font-cinzel text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
                Descrição do Imóvel
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line font-serif-luxury">
                {property.description}
              </p>
            </div>

            {/* Features & Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <h3 className="font-cinzel text-xl font-bold text-slate-100 border-b border-slate-800 pb-3">
                  Diferenciais e Infraestrutura
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financing Simulator */}
            <FinancingSimulator
              propertyPrice={property.price}
              propertyTitle={property.title}
              onOpenLeadModal={() => onOpenLeadModal(property, 'visita')}
            />
          </div>

          {/* Right Column (Fixed Sticky Card: Price, Fast Actions, Lead Form) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0d121f] rounded-2xl border border-amber-500/30 p-6 shadow-2xl space-y-6">
              {/* Price Box */}
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                  Valor de {property.negotiationType === 'aluguel' ? 'Locação' : 'Venda'}
                </span>
                <div className="font-cinzel text-3xl sm:text-4xl font-bold text-amber-400 tracking-wide">
                  {formatPrice(property.price, property.negotiationType)}
                </div>
                {(property.condoFee || property.iptu) && (
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    {property.condoFee && <div>Condomínio: R$ {property.condoFee.toLocaleString('pt-BR')} /mês</div>}
                    {property.iptu && <div>IPTU: R$ {property.iptu.toLocaleString('pt-BR')} /ano</div>}
                  </div>
                )}
              </div>

              {/* Direct WhatsApp Action */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { targetId: property.id, targetTitle: property.title })}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Atendimento WhatsApp Sávio</span>
              </a>

              {/* Fast Form */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="font-cinzel text-base font-bold text-slate-100 mb-1">
                  Agendar Visita com Sávio
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Preencha para receber contato direto e prioritário do corretor.
                </p>

                {!leadSuccess ? (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Seu Nome Completo"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                    />

                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp (com DDD)"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                    />

                    <input
                      type="email"
                      placeholder="E-mail (opcional)"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
                    />

                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-lg text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                    >
                      {leadSubmitting ? <span>Enviando...</span> : <span>Solicitar Agendamento</span>}
                    </button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h5 className="font-bold text-sm text-emerald-300">Solicitação Enviada!</h5>
                    <p className="text-xs text-slate-300">
                      O corretor Sávio entrará em contato em breve para confirmar seu horário.
                    </p>
                  </div>
                )}
              </div>

              {/* Safety notice */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Atendimento confidencial e seguro.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SIMILAR PROPERTIES */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-800">
            <h2 className="font-cinzel text-2xl font-bold text-slate-100 mb-6">
              Outras Oportunidades Selecionadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onSelect={(s) => navigate(`/imovel/${s}`)}
                  onOpenLeadModal={() => onOpenLeadModal(p)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
