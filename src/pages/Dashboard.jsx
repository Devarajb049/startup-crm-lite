import React, { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { Users, DollarSign, Percent, TrendingUp, IndianRupee } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import AddLeadModal from '../components/leads/AddLeadModal';

/**
 * Dashboard Page Component
 * Renders the CRM analytics workspace by aggregating and mounting:
 * 1. 4 Key Stats Cards (Total Leads, Pipeline, Conversion, and Revenue) in a responsive grid
 * 2. Pipeline Segment progress bar overview
 * 3. Recent leads table view
 * 4. Workspace Quick Actions toolbar (including inline lead registration modal trigger)
 */
const Dashboard = () => {
  const { leads, formatCurrency, currency, loadDemoLeads } = useLeads();

  // State to manage opening of local AddLeadModal for quick action buttons
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 1. Calculate stats dynamically from context leads database
  const totalLeads = leads.length;
  
  const pipelineValue = useMemo(() => {
    return leads
      .filter((l) => l.status !== 'Lost')
      .reduce((sum, l) => sum + l.value, 0);
  }, [leads]);

  const wonLeads = useMemo(() => leads.filter((l) => l.status === 'Won'), [leads]);
  const lostLeads = useMemo(() => leads.filter((l) => l.status === 'Lost'), [leads]);
  
  const closedLeadsCount = useMemo(() => wonLeads.length + lostLeads.length, [wonLeads, lostLeads]);

  const winRate = useMemo(() => {
    return closedLeadsCount > 0 
      ? Math.round((wonLeads.length / closedLeadsCount) * 100) 
      : 0;
  }, [closedLeadsCount, wonLeads.length]);

  const closedWonRevenue = useMemo(() => {
    return wonLeads.reduce((sum, l) => sum + l.value, 0);
  }, [wonLeads]);

  const PipelineIcon = currency === '₹' ? IndianRupee : DollarSign;

  return (
    <div className="space-y-6">
      
      {/* Page Welcome Intro Block */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
          Dashboard Overview
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor your startup sales velocity, leads distribution, and core revenue KPIs.
        </p>
      </div>

      {totalLeads === 0 ? (
        <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs animate-fade-in my-10 select-none">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 text-primary flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Users className="w-7 h-7" />
          </div>
          
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200">
            Welcome to your sales workspace! 🚀
          </h3>
          
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            Your sales pipeline is currently empty. Get started by seeding sample opportunities or adding a new lead manually.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <button
              type="button"
              onClick={loadDemoLeads}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <span>Seed Sample Leads</span>
            </button>
            
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <span>Add Custom Lead</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Key Metrics Bar: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Leads */}
            <StatsCard
              title="Total Leads"
              value={totalLeads}
              icon={Users}
              change={8.2}
              color="primary"
            />

            {/* Metric 2: Active Pipeline Value */}
            <StatsCard
              title="Active Pipeline"
              value={formatCurrency(pipelineValue)}
              icon={PipelineIcon}
              change={12.4}
              color="warning"
            />

            {/* Metric 3: Conversion Win Rate */}
            <StatsCard
              title="Win Rate"
              value={`${winRate}%`}
              icon={Percent}
              change={-1.5}
              color="success"
            />

            {/* Metric 4: Closed Revenue Won */}
            <StatsCard
              title="Closed Revenue"
              value={formatCurrency(closedWonRevenue)}
              icon={TrendingUp}
              change={24.1}
              color="danger"
            />

          </div>

          {/* 3. Pipeline Segment Progress bar card */}
          <PipelineOverview leads={leads} />

          {/* 4. Bottom Grid layout containing Recent leads and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left column spanning 2 spaces on desktop: Recent Leads datatable */}
            <div className="lg:col-span-2">
              <RecentLeads leads={leads} />
            </div>

            {/* Right column: Action Board */}
            <div>
              <QuickActions onAddLeadClick={() => setIsAddModalOpen(true)} />
            </div>

          </div>
        </>
      )}

      {/* Local Add Lead modal instance linked to Dashboard Quick Actions */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};

export default Dashboard;
