import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Mail, Phone, MapPin, MessageCircle, Clock, Instagram, Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { trackEvent } from '../lib/analytics';

export const ContactPage: React.FC = () => {
  const { settings, submitLead } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cleanWhatsapp = (settings.whatsapp || '').replace(/\D/g, '');
  const directWhatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    'Olá Sávio! Entrei em contato pela página Fale Conosco do site oficial.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        interestType: 'informacao',
        message: message.trim(),
        origin: 'Página de Contato Oficial',
        pageUrl: window.location.href,
      });

      trackEvent('lead_submit', { targetTitle: 'Formulário Contato' });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-2">
            Canais Oficiais de Atendimento
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-100 mb-4">
            Entre em Contato
          </h1>
          <p className="text-sm text-slate-400">
            Estamos prontos para atender você com exclusividade, discrição e agilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Info cards (Left) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0d121f] border border-slate-800 space-y-4">
              <h3 className="font-cinzel text-lg font-bold text-slate-100">
                Atendimento Direto
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all font-semibold"
                >
                  <MessageCircle className="w-5 h-5 fill-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider">WhatsApp Prioritário</div>
                    <div>{settings.whatsapp || '(Defina no Painel)'}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Telefone Comercial</div>
                    <div>{settings.phone || '(Configure no Painel Admin)'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">E-mail Comercial</div>
                    <div className="truncate">{settings.email || 'contato@imoveiscomsavio.com.br'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Endereço / Região</div>
                    <div className="text-xs">{settings.address || 'Atendimento com horário agendado'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">Horários</div>
                    <div className="text-xs">Segunda a Sábado, das 08h às 20h (Plantão sob demanda)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Siga o perfil oficial:</span>
              <a
                href={settings.instagramUrl || 'https://www.instagram.com/imoveiscomsavio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@imoveiscomsavio</span>
              </a>
            </div>
          </div>

          {/* Form (Right) */}
          <div className="lg:col-span-7 bg-[#0d121f] rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <h3 className="font-cinzel text-xl font-bold text-slate-100 mb-2">
              Envie uma Mensagem
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Preencha os campos abaixo e entraremos em contato com a brevidade que seu tempo exige.
            </p>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 outline-none focus:border-amber-500 transition-colors"
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
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      E-mail (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Como podemos lhe ajudar?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Descreva seu interesse, região desejada ou perfil do imóvel..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 outline-none focus:border-amber-500 transition-colors resize-none placeholder:text-slate-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando dados...' : 'Enviar Mensagem'}</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                <h4 className="font-cinzel text-2xl font-bold text-slate-100">
                  Mensagem Enviada!
                </h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Agradecemos seu contato. O corretor Sávio responderá em breve através do WhatsApp fornecido.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
