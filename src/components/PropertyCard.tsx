import React from 'react';
import { Property } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { Bed, Bath, Car, Maximize2, MapPin, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { trackEvent } from '../lib/analytics';

interface PropertyCardProps {
  property: Property;
  onSelect: (slug: string) => void;
  onOpenLeadModal?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onOpenLeadModal
}) => {
  const { settings } = useSettings();

  const formatPrice = (val: number, type: Property['negotiationType']) => {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);

    return type === 'aluguel' ? `${formatted} /mês` : formatted;
  };

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappText = `Olá Sávio! Gostaria de mais informações sobre o imóvel "${property.title}" (Cód: ${property.code}) anunciado no site.`;
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(directWhatsappText)}`;

  const handleCardClick = () => {
    trackEvent('property_view', {
      targetId: property.id,
      targetTitle: property.title,
    });
    onSelect(property.slug);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-[#0d121f] rounded-2xl overflow-hidden border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col"
    >
      {/* Image Container with Badges */}
      <div
        onClick={handleCardClick}
        className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer bg-slate-900"
      >
        <img
          src={property.mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-black/20 to-transparent" />

        {/* Badges Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-amber-400 border border-amber-500/30">
            {property.negotiationType === 'venda' ? 'Venda' : property.negotiationType === 'aluguel' ? 'Locação' : 'Lançamento'}
          </span>
          {property.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
              <Sparkles className="w-3 h-3" />
              <span>Destaque</span>
            </span>
          )}
        </div>

        {/* Property Code Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
            {property.code}
          </span>
        </div>

        {/* Location Overlay Bottom Left */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300 z-10">
          <div className="flex items-center gap-1 drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium truncate">{property.neighborhood}, {property.city}</span>
          </div>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price */}
          <div className="mb-2">
            <span className="text-xl sm:text-2xl font-bold font-cinzel text-amber-400 tracking-wide block">
              {formatPrice(property.price, property.negotiationType)}
            </span>
            {(property.condoFee || property.iptu) && (
              <span className="text-[11px] text-slate-400">
                {property.condoFee ? `Cond.: R$ ${property.condoFee.toLocaleString('pt-BR')}` : ''}
                {property.condoFee && property.iptu ? ' • ' : ''}
                {property.iptu ? `IPTU: R$ ${property.iptu.toLocaleString('pt-BR')}` : ''}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={handleCardClick}
            className="font-serif-luxury text-base sm:text-lg font-semibold text-slate-100 line-clamp-2 hover:text-amber-400 transition-colors cursor-pointer mb-3"
          >
            {property.title}
          </h3>

          {/* Specs Grid */}
          <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-800/80 text-slate-400 text-xs">
            <div className="flex flex-col items-center justify-center text-center">
              <Maximize2 className="w-4 h-4 text-amber-400/90 mb-1" />
              <span className="font-semibold text-slate-200">{property.area} m²</span>
              <span className="text-[10px] text-slate-500">Área</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Bed className="w-4 h-4 text-amber-400/90 mb-1" />
              <span className="font-semibold text-slate-200">{property.bedrooms}</span>
              <span className="text-[10px] text-slate-500">Quartos</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Bath className="w-4 h-4 text-amber-400/90 mb-1" />
              <span className="font-semibold text-slate-200">{property.suites}</span>
              <span className="text-[10px] text-slate-500">Suítes</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <Car className="w-4 h-4 text-amber-400/90 mb-1" />
              <span className="font-semibold text-slate-200">{property.parkingSpots}</span>
              <span className="text-[10px] text-slate-500">Vagas</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 mt-auto grid grid-cols-2 gap-2">
          <button
            onClick={handleCardClick}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-200 hover:text-amber-400 transition-all"
          >
            <span>Ver Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('whatsapp_click', { targetId: property.id, targetTitle: property.title })}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};
