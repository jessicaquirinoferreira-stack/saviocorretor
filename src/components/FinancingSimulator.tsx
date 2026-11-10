import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';

interface FinancingSimulatorProps {
  propertyPrice: number;
  propertyTitle?: string;
  onOpenLeadModal?: () => void;
}

export const FinancingSimulator: React.FC<FinancingSimulatorProps> = ({
  propertyPrice,
  propertyTitle,
  onOpenLeadModal
}) => {
  const [price, setPrice] = useState<number>(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termYears, setTermYears] = useState<number>(30); // 360 months
  const [interestRateYearly, setInterestRateYearly] = useState<number>(9.8); // 9.8% a.a.

  const downPayment = (price * downPaymentPercent) / 100;
  const financedAmount = Math.max(0, price - downPayment);
  const totalMonths = termYears * 12;
  const monthlyRate = interestRateYearly / 100 / 12;

  // SAC Calculation:
  // Amortization = Financed / Months
  // First month interest = Financed * monthlyRate
  const monthlyAmortization = totalMonths > 0 ? financedAmount / totalMonths : 0;
  const firstInterest = financedAmount * monthlyRate;
  const firstInstallment = monthlyAmortization + firstInterest;
  const lastInstallment = monthlyAmortization + (monthlyAmortization * monthlyRate);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-[#0d121f] border border-amber-500/20 rounded-2xl p-6 sm:p-8 text-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-cinzel text-xl font-bold text-slate-100">
            Simulador de Financiamento Imobiliário
          </h3>
          <p className="text-xs text-slate-400">
            Estime as condições de aquisição bancária para este imóvel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
              <span>Valor do Imóvel</span>
              <span className="text-amber-400 text-sm font-bold">{formatBRL(price)}</span>
            </div>
            <input
              type="range"
              min={price * 0.5}
              max={price * 1.5}
              step={50000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
              <span>Entrada ({downPaymentPercent}%)</span>
              <span className="text-amber-400 text-sm font-bold">{formatBRL(downPayment)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Prazo do Financiamento</label>
              <select
                value={termYears}
                onChange={(e) => setTermYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 outline-none"
              >
                <option value={15}>15 anos (180 meses)</option>
                <option value={20}>20 anos (240 meses)</option>
                <option value={25}>25 anos (300 meses)</option>
                <option value={30}>30 anos (360 meses)</option>
                <option value={35}>35 anos (420 meses)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Taxa Estimada (% a.a.)</label>
              <input
                type="number"
                step="0.1"
                min="6"
                max="16"
                value={interestRateYearly}
                onChange={(e) => setInterestRateYearly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-slate-400 block font-medium">
            Parcela Inicial Estimada (Sistema SAC)
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-cinzel text-amber-400">
            {formatBRL(firstInstallment)}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ mês</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 py-3 border-y border-slate-800">
            <div>
              <span className="block text-slate-500">Valor Financiado:</span>
              <strong className="text-slate-200">{formatBRL(financedAmount)}</strong>
            </div>
            <div>
              <span className="block text-slate-500">Última Parcela (Est.):</span>
              <strong className="text-slate-200">{formatBRL(lastInstallment)}</strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            *Valores referenciais. Taxas e aprovação sujeitas a análise de crédito pelos bancos parceiros (Itaú, Bradesco, Santander, Caixa).
          </p>

          <button
            onClick={onOpenLeadModal}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-xs tracking-wider uppercase transition-all shadow-md shadow-amber-500/20"
          >
            <span>Analisar Crédito com Sávio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
