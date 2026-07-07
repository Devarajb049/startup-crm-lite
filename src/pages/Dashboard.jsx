import React, { useState, useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { Users, DollarSign, Percent, TrendingUp, IndianRupee } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';
import AddLeadModal from '../components/leads/AddLeadModal';
import ShimmerButton from '../components/common/ShimmerButton';

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

      <>
        {/* 2. Key Metrics Bar: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Total Leads */}
          <StatsCard
            index={0}
            title="Total Leads"
            value={totalLeads}
            icon={Users}
            change={8.2}
          />

          {/* Metric 2: Active Pipeline Value */}
          <StatsCard
            index={1}
            title="Active Pipeline"
            value={formatCurrency(pipelineValue)}
            icon={PipelineIcon}
            change={12.4}
          />

          {/* Metric 3: Conversion Win Rate */}
          <StatsCard
            index={2}
            title="Win Rate"
            value={`${winRate}%`}
            icon={Percent}
            change={-1.5}
          />

          {/* Metric 4: Closed Revenue Won */}
          <StatsCard
            index={3}
            title="Closed Revenue"
            value={formatCurrency(closedWonRevenue)}
            icon={TrendingUp}
            change={24.1}
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

      {/* Local Add Lead modal instance linked to Dashboard Quick Actions */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

    </div>
  );
};

export default Dashboard;
