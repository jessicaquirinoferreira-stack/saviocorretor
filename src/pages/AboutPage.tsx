import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Shield, Award, Users, CheckCircle, Instagram, MessageCircle, MapPin, Phone, Mail, Sparkles } from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Gostaria de conversar sobre uma consultoria imobiliária personalizada.'
  )}`;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Perfil Profissional Oficial</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-100">
            Sobre o Corretor {settings.brokerName || 'Sávio'}
          </h1>
          <p className="font-serif-luxury text-base sm:text-xl text-slate-300 max-w-2xl mx-auto italic leading-relaxed">
            "A excelência no mercado imobiliário não está apenas no metro quadrado, mas na confiança construída e na exclusividade de cada negociação."
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-2xl">
          <div className="md:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl bg-slate-900 aspect-[3/4] max-h-[480px]">
              <img
                src={settings.avatarUrl || 'https://i.postimg.cc/7ZfPHyFy/Whats-App-Image-2026-11-10-at-09-09-47.jpg'}
                alt={settings.brokerName}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                {settings.creci || 'CRECI em homologação'}
              </span>
              <span className="text-[11px] text-slate-400">Registro Profissional</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-slate-100">
              Posicionamento & Filosofia de Trabalho
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {settings.bio}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.aboutExperience}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold hover:bg-pink-500/20 transition-all"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram Oficial @imoveiscomsavio</span>
              </a>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Contato Direto no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="space-y-6">
          <h2 className="font-cinzel text-2xl font-bold text-slate-100 text-center">
            Nossos Pilares de Atuação
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">Sigilo & Discrição</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tratamento estritamente confidencial para todas as informações financeiras e patrimoniais de nossos clientes e famílias.
              </p>
            </div>

            <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">Seleção Ativa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filtramos o mercado exaustivamente para apresentar apenas propriedades com valor arquitetônico singular e documentação cristalina.
              </p>
            </div>

            <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-lg font-bold text-slate-100">Assessoria Completa</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acompanhamento jurídico, bancário e notarial de ponta a ponta, assegurando uma transação pacífica e juridicamente perfeita.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
