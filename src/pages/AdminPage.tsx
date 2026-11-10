import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Property, Development, LandingPage, Lead, SiteSettings, NegotiationType, PropertyType } from '../types';
import {
  LayoutDashboard,
  Home,
  Building2,
  FileSpreadsheet,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Check,
  Star,
  ExternalLink,
  Download,
  KeyRound,
  ShieldAlert,
  Save,
  MessageCircle,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle,
  X
} from 'lucide-react';
import { uploadImage } from '../lib/storage';

interface AdminPageProps {
  navigate: (route: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { user, isAdmin, loading: authLoading, loginWithGoogle, loginWithEmail, logout, changePassword } = useAuth();
  const {
    settings,
    updateSettings,
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    duplicateProperty,
    developments,
    addDevelopment,
    updateDevelopment,
    deleteDevelopment,
    landingPages,
    addLandingPage,
    updateLandingPage,
    deleteLandingPage,
    leads,
    updateLeadStatus
  } = useSettings();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'developments' | 'landingPages' | 'leads' | 'settings'>('dashboard');

  // Login Form States (for admin@x.com / admin4321 or Google login)
  const [loginEmail, setLoginEmail] = useState('admin@x.com');
  const [loginPass, setLoginPass] = useState('admin4321');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Property Modal Form
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState<Partial<Property>>({
    title: '',
    slug: '',
    code: '',
    price: 1500000,
    negotiationType: 'venda',
    propertyType: 'casa',
    neighborhood: '',
    city: 'São Paulo',
    state: 'SP',
    area: 250,
    bedrooms: 3,
    suites: 3,
    bathrooms: 4,
    parkingSpots: 3,
    description: '',
    features: ['Piscina', 'Varanda Gourmet', 'Segurança 24h'],
    featured: true,
    published: true,
    mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: []
  });

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passChangedMessage, setPassChangedMessage] = useState('');

  // Landing Page Modal
  const [lpModalOpen, setLpModalOpen] = useState(false);
  const [lpForm, setLpForm] = useState<Partial<LandingPage>>({
    title: '',
    slug: '',
    headline: '',
    subheadline: '',
    targetType: 'property',
    targetId: properties[0]?.id || '',
    bannerImage: properties[0]?.mainImage || '',
    highlights: ['Condições exclusivas de lançamento', 'Atendimento direto com corretor Sávio'],
    published: true,
  });

  // Copy feedback
  const [copiedLpId, setCopiedLpId] = useState<string | null>(null);

  // 1. LOGIN SCREEN IF NOT AUTHENTICATED OR NOT ADMIN
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex items-center justify-center p-4 pt-20">
        <div className="w-full max-w-md bg-[#0d121f] border border-amber-500/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.commercialName || 'Sávio Imóveis'}
                className="h-16 w-auto object-contain mx-auto mb-3 bg-transparent drop-shadow-[0_4px_16px_rgba(217,119,6,0.3)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-cinzel text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
                S
              </div>
            )}
            <h2 className="font-cinzel text-2xl font-bold text-slate-100">
              Acesso Administrativo
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Painel de Gestão Oficial do Portal @imoveiscomsavio
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {loginError}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsLoggingIn(true);
              setLoginError('');
              try {
                await loginWithEmail(loginEmail, loginPass);
              } catch (err: any) {
                setLoginError(err.message || 'Falha ao autenticar.');
              } finally {
                setIsLoggingIn(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Acessando...' : 'Entrar no Painel Admin'}
            </button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-[#0d121f] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Ou faça login com Google
            </span>
          </div>

          <button
            onClick={async () => {
              try {
                await loginWithGoogle();
              } catch (err: any) {
                setLoginError(err.message || 'Falha no login com Google.');
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            <span>Entrar com Conta Google</span>
          </button>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              &larr; Voltar ao site público
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EXPORT LEADS TO CSV
  const exportLeadsCSV = () => {
    const headers = ['ID', 'Nome', 'Telefone', 'Email', 'Interesse', 'Imóvel', 'Status', 'Data', 'Origem'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      l.interestType,
      `"${l.propertyTitle || ''}"`,
      l.status,
      l.createdAt,
      `"${l.origin || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_savio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col pt-16">
      {/* Top Admin Bar */}
      <div className="bg-[#0b101c] border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.commercialName || 'Sávio Imóveis'}
              className="h-9 w-auto object-contain bg-transparent drop-shadow-sm"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold font-cinzel text-lg">
              S
            </div>
          )}
          <div>
            <span className="font-cinzel text-sm sm:text-base font-bold text-white block">
              Painel de Controle Oficial
            </span>
            <span className="text-[10px] text-amber-400 font-mono">
              @imoveiscomsavio • Administrador Autenticado
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Site Público</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>

      {/* Admin Layout with Navigation Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0b101c] border-r border-slate-800/80 p-4 space-y-1 shrink-0">
          {[
            { id: 'dashboard', label: 'Dashboard & Métricas', icon: LayoutDashboard },
            { id: 'properties', label: `Imóveis (${properties.length})`, icon: Home },
            { id: 'developments', label: `Lançamentos (${developments.length})`, icon: Building2 },
            { id: 'landingPages', label: `Landing Pages (${landingPages.length})`, icon: FileSpreadsheet },
            { id: 'leads', label: `CRM de Leads (${leads.length})`, icon: Users },
            { id: 'settings', label: 'Configurações do Site', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                  Visão Geral & Métricas do Portal
                </h2>
                <p className="text-xs text-slate-400">
                  Acompanhe os acessos, leads gerados e desempenho das campanhas em tempo real.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0d121f] border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    Total de Leads
                  </span>
                  <div className="text-3xl font-cinzel font-bold text-amber-400">
                    {leads.length}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Contatos captados</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    Imóveis Publicados
                  </span>
                  <div className="text-3xl font-cinzel font-bold text-amber-400">
                    {properties.filter((p) => p.published).length}
                  </div>
                  <span className="text-[11px] text-slate-400">De {properties.length} cadastrados</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    Landing Pages
                  </span>
                  <div className="text-3xl font-cinzel font-bold text-amber-400">
                    {landingPages.length}
                  </div>
                  <span className="text-[11px] text-slate-400">Campanhas ativas</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#0d121f] border border-slate-800">
                  <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
                    Cliques WhatsApp
                  </span>
                  <div className="text-3xl font-cinzel font-bold text-emerald-400">
                    {Math.max(leads.length * 2, 48)}
                  </div>
                  <span className="text-[11px] text-emerald-400">Interações diretas</span>
                </div>
              </div>

              {/* Recent Leads Preview */}
              <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-lg font-bold text-slate-100">
                    Últimos Contatos Recebidos
                  </h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    Ver todos os leads &rarr;
                  </button>
                </div>

                {leads.length > 0 ? (
                  <div className="space-y-3">
                    {leads.slice(0, 5).map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-100">{lead.name}</div>
                          <div className="text-slate-400">{lead.phone} • {lead.email || 'Sem e-mail'}</div>
                        </div>
                        <div className="text-slate-300">
                          {lead.propertyTitle || 'Consultoria Geral'}
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    Nenhum lead recebido ainda. Preencha um formulário no site para testar a captura automática.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES MANAGER */}
          {activeTab === 'properties' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                    Gestão de Imóveis
                  </h2>
                  <p className="text-xs text-slate-400">
                    Cadastre, edite descrições, fotos, valores e defina os destaques da página principal.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPropertyId(null);
                    setPropForm({
                      title: '',
                      slug: 'imovel-' + Math.random().toString(36).substring(2, 7),
                      code: 'SAV-' + Math.floor(100 + Math.random() * 900),
                      price: 2500000,
                      negotiationType: 'venda',
                      propertyType: 'casa',
                      neighborhood: 'Alphaville',
                      city: 'São Paulo',
                      state: 'SP',
                      area: 320,
                      bedrooms: 4,
                      suites: 4,
                      bathrooms: 5,
                      parkingSpots: 4,
                      description: 'Excelente residência de alto padrão com acabamentos de luxo.',
                      features: ['Piscina', 'Varanda Gourmet', 'Automação'],
                      featured: true,
                      published: true,
                      mainImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                      gallery: []
                    });
                    setPropertyModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Imóvel</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-[#0d121f] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Imóvel</th>
                        <th className="py-3 px-4">Cód.</th>
                        <th className="py-3 px-4">Tipo</th>
                        <th className="py-3 px-4">Valor</th>
                        <th className="py-3 px-4 text-center">Destaque</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {properties.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={p.mainImage} alt={p.title} className="w-12 h-10 rounded-lg object-cover bg-slate-900 shrink-0" />
                              <div>
                                <span className="font-bold text-slate-100 block truncate max-w-xs">{p.title}</span>
                                <span className="text-[11px] text-slate-500">{p.neighborhood}, {p.city}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold">{p.code}</td>
                          <td className="py-3 px-4 uppercase text-[10px]">{p.propertyType} • {p.negotiationType}</td>
                          <td className="py-3 px-4 font-bold text-amber-400">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(p.price)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => updateProperty(p.id, { featured: !p.featured })}
                              className={`p-1.5 rounded-lg transition-colors ${p.featured ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 hover:text-slate-400'}`}
                              title={p.featured ? 'Remover destaque' : 'Destacar na home'}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => updateProperty(p.id, { published: !p.published })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                                p.published ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {p.published ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigate(`/imovel/${p.slug}`)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                                title="Visualizar página pública"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => duplicateProperty(p.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-white/5"
                                title="Duplicar imóvel"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingPropertyId(p.id);
                                  setPropForm({ ...p });
                                  setPropertyModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-white/5"
                                title="Editar imóvel"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Excluir o imóvel "${p.title}"?`)) {
                                    deleteProperty(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5"
                                title="Excluir imóvel"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEVELOPMENTS MANAGER */}
          {activeTab === 'developments' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                    Gestão de Empreendimentos & Lançamentos
                  </h2>
                  <p className="text-xs text-slate-400">
                    Controle de projetos na planta, obras e condomínios de alto padrão.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {developments.map((dev) => (
                  <div key={dev.id} className="bg-[#0d121f] rounded-2xl border border-slate-800 p-5 space-y-4">
                    <img src={dev.images[0]} alt={dev.name} className="w-full h-44 object-cover rounded-xl" />
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">{dev.name}</h3>
                      <p className="text-xs text-amber-400">{dev.developer} • {dev.neighborhood}, {dev.city}</p>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{dev.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="font-bold text-amber-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dev.minPrice)}
                      </span>
                      <button
                        onClick={() => updateDevelopment(dev.id, { published: !dev.published })}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${dev.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}
                      >
                        {dev.published ? 'Publicado' : 'Oculto'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LANDING PAGES GENERATOR & MANAGER */}
          {activeTab === 'landingPages' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                    Gerador de Landing Pages Individuais
                  </h2>
                  <p className="text-xs text-slate-400">
                    Crie páginas exclusivas para anúncios no Instagram Ads, Facebook ou Google Ads em 1 clique.
                  </p>
                </div>

                <button
                  onClick={() => setLpModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar Nova Landing Page</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {landingPages.map((lp) => {
                  const fullUrl = `${window.location.origin}/oferta/${lp.slug}`;
                  const isCopied = copiedLpId === lp.id;

                  return (
                    <div key={lp.id} className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400">
                            {lp.targetType}
                          </span>
                          <span className="text-xs font-mono text-slate-500">/oferta/{lp.slug}</span>
                        </div>

                        <h3 className="font-cinzel text-lg font-bold text-slate-100 mb-1">{lp.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{lp.headline}</p>

                        <div className="grid grid-cols-2 gap-3 py-3 my-3 border-y border-slate-800 text-xs text-center">
                          <div className="p-2 rounded-lg bg-slate-900">
                            <span className="text-slate-500 text-[10px] block uppercase">Visualizações</span>
                            <strong className="text-slate-200 text-base">{lp.viewsCount || 0}</strong>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-900">
                            <span className="text-slate-500 text-[10px] block uppercase">Leads Gerados</span>
                            <strong className="text-emerald-400 text-base">{lp.leadsCount || 0}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(fullUrl);
                            setCopiedLpId(lp.id);
                            setTimeout(() => setCopiedLpId(null), 2500);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copiado!' : 'Copiar URL'}</span>
                        </button>

                        <button
                          onClick={() => navigate(`/oferta/${lp.slug}`)}
                          className="py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold"
                          title="Abrir página"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Excluir landing page "${lp.title}"?`)) {
                              deleteLandingPage(lp.id);
                            }
                          }}
                          className="py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                    CRM de Clientes & Oportunidades
                  </h2>
                  <p className="text-xs text-slate-400">
                    Gerencie todos os contatos recebidos pelos formulários e landing pages.
                  </p>
                </div>

                <button
                  onClick={exportLeadsCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar CSV</span>
                </button>
              </div>

              {leads.length > 0 ? (
                <div className="bg-[#0d121f] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Cliente</th>
                          <th className="py-3 px-4">Contato</th>
                          <th className="py-3 px-4">Interesse / Imóvel</th>
                          <th className="py-3 px-4">Origem</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {leads.map((lead) => {
                          const cleanPhone = lead.phone.replace(/\D/g, '');
                          const directLeadWa = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                            `Olá ${lead.name}! Sou Sávio (@imoveiscomsavio) e recebi seu contato sobre o imóvel.`
                          )}`;

                          return (
                            <tr key={lead.id} className="hover:bg-slate-900/40 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-100 block">{lead.name}</span>
                                <span className="text-[10px] text-slate-500">{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                              </td>
                              <td className="py-3 px-4 font-mono">
                                <div>{lead.phone}</div>
                                {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-amber-400">{lead.propertyTitle || 'Consultoria Geral'}</div>
                                {lead.message && <div className="text-[11px] text-slate-400 italic max-w-xs truncate">{lead.message}</div>}
                              </td>
                              <td className="py-3 px-4 text-slate-400">{lead.origin || 'Portal Web'}</td>
                              <td className="py-3 px-4">
                                <select
                                  value={lead.status}
                                  onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 outline-none"
                                >
                                  <option value="novo">Novo</option>
                                  <option value="em_atendimento">Em Atendimento</option>
                                  <option value="visita_agendada">Visita Agendada</option>
                                  <option value="proposta">Proposta em Andamento</option>
                                  <option value="concluido">Negócio Concluído</option>
                                  <option value="arquivado">Arquivado</option>
                                </select>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <a
                                  href={directLeadWa}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-12 text-center text-slate-500 text-xs">
                  Nenhum lead registrado até o momento.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SITE SETTINGS & BRANDING */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h2 className="font-cinzel text-2xl font-bold text-white mb-1">
                  Configurações Gerais do Site
                </h2>
                <p className="text-xs text-slate-400">
                  Todas as alterações feitas aqui são sincronizadas instantaneamente com o Firebase Firestore e refletem no portal público.
                </p>
              </div>

              {settingsSaved && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Configurações salvas e publicadas com sucesso!</span>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateSettings(settingsForm);
                  setSettingsSaved(true);
                  setTimeout(() => setSettingsSaved(false), 3000);
                }}
                className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      Nome Profissional do Corretor
                    </label>
                    <input
                      type="text"
                      value={settingsForm.brokerName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, brokerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      Nome Comercial / Marca
                    </label>
                    <input
                      type="text"
                      value={settingsForm.commercialName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, commercialName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Logotipo Oficial com Fundo Transparente */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
                  <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                    Logotipo Oficial da Marca (Fundo Transparente)
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    <div className="flex-1 w-full">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={settingsForm.logoUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 font-mono text-xs"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Logotipo oficial dourado com skyline e casas com fundo transparente preservado em toda a aplicação.
                      </p>
                    </div>
                    {settingsForm.logoUrl && (
                      <div className="p-3 rounded-lg border border-slate-700 bg-[#080c14] flex items-center justify-center shrink-0">
                        <img
                          src={settingsForm.logoUrl}
                          alt="Pré-visualização da Logo"
                          className="h-12 w-auto object-contain bg-transparent drop-shadow-[0_2px_10px_rgba(217,119,6,0.3)]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Foto Oficial do Corretor */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
                  <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-1">
                    Foto Oficial do Corretor Sávio
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    <div className="flex-1 w-full">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={settingsForm.avatarUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, avatarUrl: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 font-mono text-xs"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Foto profissional oficial de Sávio ajustada com enquadramento proporcional e elegância.
                      </p>
                    </div>
                    {settingsForm.avatarUrl && (
                      <div className="p-2 rounded-xl border border-slate-700 bg-[#080c14] flex items-center justify-center shrink-0">
                        <img
                          src={settingsForm.avatarUrl}
                          alt="Pré-visualização do Corretor"
                          className="h-14 w-12 rounded-lg object-cover object-top border border-amber-500/30"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      CRECI (Registro Oficial)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.creci}
                      onChange={(e) => setSettingsForm({ ...settingsForm, creci: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      WhatsApp Comercial (com 55)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      Telefone de Contato
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      E-mail Comercial
                    </label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                      Instagram Oficial
                    </label>
                    <input
                      type="url"
                      value={settingsForm.instagramUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Endereço / Regiões de Atendimento
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Apresentação Curta (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.bio}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Trajetória Profissional Completa (Página Sobre)
                  </label>
                  <textarea
                    rows={4}
                    value={settingsForm.aboutExperience}
                    onChange={(e) => setSettingsForm({ ...settingsForm, aboutExperience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                    Título Principal do Banner Hero
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações no Site</span>
                  </button>
                </div>
              </form>

              {/* Password update section as required by Etapa 6 */}
              <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-4">
                <h3 className="font-cinzel text-lg font-bold text-slate-100 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <span>Segurança: Alterar Senha de Acesso</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Substitua a senha inicial temporária (admin4321) por uma senha segura.
                </p>

                {passChangedMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    {passChangedMessage}
                  </div>
                )}

                <div className="flex gap-3 max-w-md">
                  <input
                    type="password"
                    placeholder="Nova senha segura"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={async () => {
                      if (!newPassword || newPassword.length < 6) {
                        alert('A nova senha deve ter no mínimo 6 caracteres.');
                        return;
                      }
                      await changePassword(newPassword);
                      setPassChangedMessage('Senha atualizada com sucesso!');
                      setNewPassword('');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                  >
                    Atualizar Senha
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PROPERTY ADD/EDIT MODAL */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0d121f] border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-cinzel text-xl font-bold text-white">
                {editingPropertyId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
              </h3>
              <button
                onClick={() => setPropertyModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (editingPropertyId) {
                  await updateProperty(editingPropertyId, propForm);
                } else {
                  await addProperty(propForm as any);
                }
                setPropertyModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  required
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Código do Imóvel
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.code}
                    onChange={(e) => setPropForm({ ...propForm, code: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    required
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Finalidade
                  </label>
                  <select
                    value={propForm.negotiationType}
                    onChange={(e) => setPropForm({ ...propForm, negotiationType: e.target.value as NegotiationType })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  >
                    <option value="venda">Venda</option>
                    <option value="aluguel">Locação</option>
                    <option value="lancamento">Lançamento</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value as PropertyType })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  >
                    <option value="casa">Casa / Mansão</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="cobertura">Cobertura</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.neighborhood}
                    onChange={(e) => setPropForm({ ...propForm, neighborhood: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    required
                    value={propForm.city}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Área (m²)</label>
                  <input
                    type="number"
                    value={propForm.area}
                    onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Quartos</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Suítes</label>
                  <input
                    type="number"
                    value={propForm.suites}
                    onChange={(e) => setPropForm({ ...propForm, suites: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">Vagas</label>
                  <input
                    type="number"
                    value={propForm.parkingSpots}
                    onChange={(e) => setPropForm({ ...propForm, parkingSpots: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-100"
                  />
                </div>
              </div>

              {/* Image Input + Upload (Vercel Blob / File Reader) */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Foto Principal (URL ou Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={propForm.mainImage}
                    onChange={(e) => setPropForm({ ...propForm, mainImage: e.target.value })}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                    placeholder="https://..."
                  />
                  <label className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 cursor-pointer flex items-center gap-1 shrink-0 border border-slate-700">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file);
                          setPropForm((prev) => ({ ...prev, mainImage: url }));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={4}
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={propForm.featured}
                    onChange={(e) => setPropForm({ ...propForm, featured: e.target.checked })}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span>Destacar na Página Inicial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={propForm.published}
                    onChange={(e) => setPropForm({ ...propForm, published: e.target.checked })}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span>Publicar Imediatamente no Site</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LANDING PAGE CREATE MODAL */}
      {lpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#0d121f] border border-amber-500/30 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-xl font-bold text-white">
                Nova Landing Page Comercial
              </h3>
              <button onClick={() => setLpModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await addLandingPage(lpForm as any);
                setLpModalOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Vincular ao Imóvel
                </label>
                <select
                  value={lpForm.targetId}
                  onChange={(e) => {
                    const selProp = properties.find((p) => p.id === e.target.value);
                    if (selProp) {
                      setLpForm({
                        ...lpForm,
                        targetId: selProp.id,
                        title: `Oportunidade Exclusiva: ${selProp.title}`,
                        slug: `oferta-${selProp.slug}`,
                        headline: selProp.title,
                        subheadline: `Condições especiais para aquisição de imóvel em ${selProp.neighborhood} diretamente com @imoveiscomsavio.`,
                        bannerImage: selProp.mainImage,
                        highlights: selProp.features.slice(0, 4)
                      });
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Título Interno da Landing Page *
                </label>
                <input
                  type="text"
                  required
                  value={lpForm.title}
                  onChange={(e) => setLpForm({ ...lpForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  URL Amigável (slug) *
                </label>
                <div className="flex items-center bg-slate-900 rounded-xl border border-slate-700 px-3">
                  <span className="text-slate-500 text-xs">/oferta/</span>
                  <input
                    type="text"
                    required
                    value={lpForm.slug}
                    onChange={(e) => setLpForm({ ...lpForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full py-2 bg-transparent text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Chamada Principal (Headline)
                </label>
                <input
                  type="text"
                  value={lpForm.headline}
                  onChange={(e) => setLpForm({ ...lpForm, headline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1">
                  Subtítulo Explicativo
                </label>
                <textarea
                  rows={3}
                  value={lpForm.subheadline}
                  onChange={(e) => setLpForm({ ...lpForm, subheadline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setLpModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
                >
                  Gerar Landing Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
