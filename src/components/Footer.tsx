import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Instagram, Phone, Mail, MapPin, Shield, Lock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}`;

  return (
    <footer className="bg-[#05080e] border-t border-slate-800 text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.commercialName || 'Sávio Imóveis'}
                  className="h-12 w-auto object-contain bg-transparent drop-shadow-[0_2px_12px_rgba(217,119,6,0.25)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-cinzel text-lg shadow-md shadow-amber-500/20">
                  S
                </div>
              )}
              <span className="font-cinzel text-lg font-bold tracking-wider text-slate-100">
                {settings.commercialName || 'SÁVIO IMÓVEIS'}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              {settings.bio || 'Consultoria imobiliária de alto padrão e seleção arquitetônica exclusiva para clientes exigentes e investidores.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.creci || 'CRECI em homologação'}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-4">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Catálogo de Imóveis
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/lancamentos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Empreendimentos & Lançamentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/sobre'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Sobre o Corretor
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/contato'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-4">
              Tipologias
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=casa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Casas & Mansões em Condomínio
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=cobertura'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Coberturas com Piscina Privativa
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?tipo=apartamento'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Apartamentos de Alto Padrão
                </button>
              </li>
              <li>
                <button
                  onClick={() => { navigate('/imoveis?finalidade=aluguel'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Locações Corporativas e Mobiliadas
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-slate-200 font-semibold mb-4">
              Canais Oficiais
            </h4>
            <p className="flex items-center gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.phone || '(Configure no Painel Admin)'}</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{settings.email || 'contato@imoveiscomsavio.com.br'}</span>
            </p>
            <p className="flex items-start gap-2.5 text-sm">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">{settings.address || 'Atendimento com horário agendado'}</span>
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 hover:text-white hover:bg-pink-500/20 transition-all text-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>@imoveiscomsavio</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar with discreet Admin Link as specifically instructed in Etapa 6 */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col items-center justify-center gap-4 text-xs text-slate-500">
          <p className="text-center">
            &copy; {new Date().getFullYear()} {settings.commercialName || 'Imóveis com Sávio'}. Todos os direitos reservados.
            {settings.confirmationNotice && (
              <span className="block mt-1 text-[11px] text-slate-600">
                {settings.confirmationNotice}
              </span>
            )}
          </p>

          {/* Discreet Centered Admin Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                navigate('/admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-400/80 transition-colors text-[11px] py-1 px-3 rounded hover:bg-white/5"
            >
              <Lock className="w-3 h-3 opacity-60" />
              <span>Painel Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
