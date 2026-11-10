import React, { useState, useMemo, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyType, NegotiationType } from '../types';
import { Search, Filter, SlidersHorizontal, RotateCcw, Home, Sparkles } from 'lucide-react';

interface PropertiesPageProps {
  navigate: (route: string) => void;
  onOpenLeadModal: (property?: Property) => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ navigate, onOpenLeadModal }) => {
  const { properties } = useSettings();

  // URL search params sync
  const queryParams = new URLSearchParams(window.location.search);
  const initialPurpose = (queryParams.get('finalidade') as NegotiationType) || 'todos';
  const initialType = (queryParams.get('tipo') as PropertyType) || 'todos';
  const initialSearch = queryParams.get('busca') || '';

  const [purpose, setPurpose] = useState<string>(initialPurpose);
  const [propertyType, setPropertyType] = useState<string>(initialType);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minSuites, setMinSuites] = useState<number>(0);
  const [minParking, setMinParking] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [sortBy, setSortBy] = useState<string>('destaque');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Sync state if URL changes
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('finalidade')) setPurpose(q.get('finalidade')!);
    if (q.get('tipo')) setPropertyType(q.get('tipo')!);
    if (q.get('busca')) setSearchTerm(q.get('busca')!);
  }, []);

  const resetFilters = () => {
    setPurpose('todos');
    setPropertyType('todos');
    setSearchTerm('');
    setMinBedrooms(0);
    setMinSuites(0);
    setMinParking(0);
    setMaxPrice(25000000);
    setSortBy('destaque');
  };

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (!p.published) return false;

      // Negotiation purpose filter
      if (purpose !== 'todos' && p.negotiationType !== purpose) return false;

      // Property type filter
      if (propertyType !== 'todos' && p.propertyType !== propertyType) return false;

      // Search keyword filter (title, neighborhood, city, code, description)
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matches =
          p.title.toLowerCase().includes(term) ||
          p.neighborhood.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.code.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term);
        if (!matches) return false;
      }

      // Bedrooms
      if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;

      // Suites
      if (minSuites > 0 && p.suites < minSuites) return false;

      // Parking
      if (minParking > 0 && p.parkingSpots < minParking) return false;

      // Max price
      if (p.price > maxPrice) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'destaque') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'preco_desc') return b.price - a.price;
      if (sortBy === 'preco_asc') return a.price - b.price;
      if (sortBy === 'recentes') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [properties, purpose, propertyType, searchTerm, minBedrooms, minSuites, minParking, maxPrice, sortBy]);

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-widest font-semibold mb-2">
            <Home className="w-4 h-4" />
            <span>Portfólio Imobiliário</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-slate-100 mb-3">
            Catálogo de Imóveis Exclusivos
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Navegue por mansões, coberturas e residências de alto padrão disponíveis para aquisição e locação.
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-5 sm:p-6 mb-10 shadow-xl space-y-5">
          {/* Top Bar: Purpose Tabs + Search Input */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Purpose */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'venda', label: 'Venda' },
                { id: 'aluguel', label: 'Locação' },
                { id: 'lancamento', label: 'Lançamentos' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPurpose(item.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    purpose === item.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Keyword Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por bairro, condomínio, código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Toggle Advanced */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700/80 transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{showAdvancedFilters ? 'Menos Filtros' : 'Filtros Avançados'}</span>
            </button>
          </div>

          {/* Secondary Row: Type + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Tipo de Imóvel
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="casa">Casas & Mansões</option>
                <option value="apartamento">Apartamentos</option>
                <option value="cobertura">Coberturas</option>
                <option value="terreno">Terrenos em Condomínio</option>
                <option value="comercial">Comerciais</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Ordenar Por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-200 outline-none focus:border-amber-500"
              >
                <option value="destaque">Destaques Primeiro</option>
                <option value="preco_desc">Maior Preço</option>
                <option value="preco_asc">Menor Preço</option>
                <option value="recentes">Mais Recentes</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                <span>Preço Máx.</span>
                <span className="text-amber-400 font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={25000000}
                step={250000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            </div>
          </div>

          {/* Advanced Row (Bedrooms, Suites, Parking) */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Mínimo Quartos
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinBedrooms(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        minBedrooms === n
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {n === 0 ? 'Todos' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Mínimo Suítes
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinSuites(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        minSuites === n
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {n === 0 ? 'Todas' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Mínimo Vagas
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() => setMinParking(n)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        minParking === n
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {n === 0 ? 'Todas' : `${n}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span>
            Exibindo <strong className="text-amber-400 font-bold">{filteredProperties.length}</strong> {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </span>
          {filteredProperties.length > 0 && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prontos para visita</span>
            </span>
          )}
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(slug) => navigate(`/imovel/${slug}`)}
                onOpenLeadModal={(p) => onOpenLeadModal(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0d121f] rounded-2xl border border-slate-800 p-12 text-center max-w-xl mx-auto space-y-4">
            <Home className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-cinzel text-xl font-bold text-slate-200">
              Nenhum imóvel encontrado para os filtros selecionados
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tente ampliar a faixa de preço ou limpar os filtros de busca. O corretor Sávio também trabalha com captação ativa sob demanda.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors"
            >
              Restaurar Todos os Imóveis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
