import React, { useMemo } from 'react';
import { getForecastRevenue } from '../../utils/analyticsHelpers';
import { ArrowUpRight, ArrowDownRight, Compass, ShieldCheck } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';

/**
 * ForecastCard Component
 * Predicts next month's revenue using historical run-rate analysis.
 * Includes confidence scores and growth trend indicators.
 */
const ForecastCard = ({ leads }) => {
  const { formatCurrency } = useLeads();
  const forecast = useMemo(() => getForecastRevenue(leads), [leads]);

  // Determine confidence descriptor
  const confidenceLevel = useMemo(() => {
    const score = forecast.confidence;
    if (score >= 85) return { label: 'Highly Confident', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30' };
    if (score >= 70) return { label: 'Moderate Confidence', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' };
    if (score >= 40) return { label: 'Low Confidence / Volatile', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' };
    return { label: 'Insufficient Data', color: 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900' };
  }, [forecast.confidence]);

  return (
    <div className="p-6 glass-card border border-slate-200/40 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      
      {/* Card Header */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
            Revenue Growth Forecast
          </h3>
          <div className="p-2 bg-green-50 dark:bg-green-950/20 text-success rounded-xl">
            <Compass size={16} />
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Data-driven sales forecast projected for the upcoming calendar month.
        </p>
      </div>

      {/* Primary Forecast Value */}
      <div className="my-3 py-1 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">
          Predicted Revenue Next Month
        </span>
        <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
          {formatCurrency(forecast.predictedRevenue)}
        </h4>

        {/* Growth Trend */}
        <div className="flex items-center gap-1.5 mt-2.5">
          {forecast.growthTrend !== 0 ? (
            <>
              <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                forecast.growthTrend >= 0 
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' 
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
              }`}>
                {forecast.growthTrend >= 0 ? '+' : ''}
                {forecast.growthTrend}%
                {forecast.growthTrend >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
              </span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
                forecasted run-rate change
              </span>
            </>
          ) : (
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
              Stable month-over-month run-rate
            </span>
          )}
        </div>
      </div>

      {/* Confidence Score Indicators */}
      <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={12} /> Forecast Confidence
          </span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${confidenceLevel.color}`}>
            {confidenceLevel.label}
          </span>
        </div>

        {/* Progress Bar of confidence */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-650 dark:text-slate-350">
            <span>Probability Score</span>
            <span>{forecast.confidence}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
            <div 
              className="h-full bg-success rounded-full transition-all duration-500" 
              style={{ width: `${forecast.confidence}%` }} 
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ForecastCard;
