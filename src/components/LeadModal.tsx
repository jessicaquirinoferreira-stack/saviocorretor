import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { LeadInterest } from '../types';
import { X, CheckCircle2, MessageCircle, Send, ShieldAlert, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyId?: string;
  propertyCode?: string;
  defaultInterest?: LeadInterest;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
  propertyId,
  propertyCode,
  defaultInterest = 'visita'
}) => {
  const { submitLead, settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState<LeadInterest>(defaultInterest);
  const [message, setMessage] = useState(
    propertyTitle
      ? `Olá Sávio, tenho interesse no imóvel "${propertyTitle}"${propertyCode ? ` (Cód: ${propertyCode})` : ''} e gostaria de receber mais detalhes.`
      : 'Olá Sávio, gostaria de agendar uma consulta sobre imóveis de alto padrão.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        interestType,
        propertyId,
        propertyTitle,
        message: message.trim(),
        origin: 'Formulário Modal de Interesse',
        pageUrl: window.location.href,
        campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
      });

      trackEvent('lead_submit', {
        targetId: propertyId,
        targetTitle: propertyTitle || 'Lead Form',
      });

      // Celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981', '#ffffff']
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Olá Sávio! Sou ${name || 'um cliente do site'}. ${message}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#0d121f] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Atendimento Personalizado
              </span>
            </div>

            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-100 mb-1">
              Agendar Visita ou Consultoria
            </h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {propertyTitle
                ? `Preencha para receber atendimento prioritário sobre: ${propertyTitle}`
                : 'Converse com Sávio para ter acesso às melhores oportunidades imobiliárias de alto padrão.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Roberto Albuquerque"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    WhatsApp ou Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Objetivo Principal
                </label>
                <select
                  value={interestType}
                  onChange={(e) => setInterestType(e.target.value as LeadInterest)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 outline-none transition-all"
                >
                  <option value="visita">Agendar Visita ao Imóvel</option>
                  <option value="comprar">Comprar Imóvel de Alto Padrão</option>
                  <option value="alugar">Alugar Imóvel de Luxo</option>
                  <option value="vender">Quero Vender Meu Imóvel com Sávio</option>
                  <option value="investir">Investimento Imobiliário</option>
                  <option value="informacao">Apenas tirar dúvidas gerais</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Mensagem Adicional
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-lg text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registrando solicitação...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Solicitação Prioritária</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-slate-100 mb-2">
              Solicitação Recebida com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Obrigado, <strong className="text-amber-400">{name}</strong>. Seus dados foram encaminhados com prioridade para o corretor Sávio, que entrará em contato em breve.
            </p>

            <div className="space-y-3">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Conversar Agora no WhatsApp de Sávio</span>
              </a>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-colors"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
