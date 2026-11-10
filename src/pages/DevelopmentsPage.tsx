import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Development, LeadInterest } from '../types';
import { Building2, MapPin, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

interface DevelopmentsPageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: any, defaultInterest?: LeadInterest) => void;
}

export const DevelopmentsPage: React.FC<DevelopmentsPageProps> = ({ navigate, onOpenLeadModal }) => {
  const { developments, settings } = useSettings();
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');

  const filteredDevelopments = developments.filter((dev) => {
    if (!dev.published) return false;
    if (selectedStatus !== 'todos' && dev.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>Lançamentos & Plantas</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-100 mb-4">
            Empreendimentos de Alto Padrão
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-serif-luxury">
            Projetos arquitetônicos icônicos desenvolvidos pelas incorporadoras mais prestigiadas do Brasil, com assessoria exclusiva de Sávio.
          </p>

          {/* Status Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[
              { id: 'todos', label: 'Todos os Projetos' },
              { id: 'lancamento', label: 'Lançamentos' },
              { id: 'em_obras', label: 'Em Construção' },
              { id: 'pronto', label: 'Prontos para Morar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedStatus === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Developments List */}
        <div className="space-y-12">
          {filteredDevelopments.map((dev) => {
            const devWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Olá Sávio! Gostaria de receber a apresentação completa e tabela do empreendimento "${dev.name}".`
            )}`;

            return (
              <div
                key={dev.id}
                className="bg-[#0d121f] rounded-2xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl hover:border-amber-500/30 transition-all"
              >
                {/* Image */}
                <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
                  <img
                    src={dev.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-transparent to-transparent lg:hidden" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950">
                    {dev.status === 'lancamento' ? 'Lançamento Exclusivo' : dev.status === 'em_obras' ? 'Em Obras' : 'Pronto'}
                  </span>
                </div>

                {/* Content */}
                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 uppercase tracking-widest font-semibold mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{dev.neighborhood}, {dev.city} — Incorporação: {dev.developer}</span>
                    </div>

                    <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100 mb-3">
                      {dev.name}
                    </h2>

                    <p className="text-sm text-slate-300 leading-relaxed mb-4">
                      {dev.description}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-medium space-y-1 mb-4">
                      <div className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">Tipologias Disponíveis:</div>
                      <div>{dev.typologies}</div>
                    </div>

                    {/* Features */}
                    {dev.features && dev.features.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                        {dev.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Valores a partir de</span>
                      <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(dev.minPrice)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <a
                        href={devWhatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Tabela no WhatsApp</span>
                      </a>

                      <button
                        onClick={() => onOpenLeadModal(undefined, 'visita')}
                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all"
                      >
                        Agendar Apresentação
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
