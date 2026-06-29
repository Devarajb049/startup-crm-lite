import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../context/LeadContext';
import { User, Lock, Sliders, Eye, EyeOff, Save, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { leads, addLead, deleteLead, notifications, clearNotifications, currency, changeCurrency } = useLeads();

  // Active sub-tab state
  const [activeTab, setActiveTab] = useState('profile');

  // Form states for profile edit
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState(user?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(user?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // CRM preferences local state synced to context currency
  const [localCurrency, setLocalCurrency] = useState(currency);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Sync preference local state with context if context changes
  React.useEffect(() => {
    setLocalCurrency(currency);
  }, [currency]);

  // Profile Save handler
  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsSavingProfile(true);

    setTimeout(() => {
      try {
        updateProfile({ name, password });
        toast.success('Profile updated successfully!', {
          style: { background: '#22C55E', color: '#FFFFFF', fontWeight: 'bold' }
        });
      } catch (err) {
        toast.error('Failed to update profile.');
      } finally {
        setIsSavingProfile(false);
      }
    }, 600);
  };

  // Preference Save handler
  const handleSavePrefs = (e) => {
    e.preventDefault();
    setIsSavingPrefs(true);

    setTimeout(() => {
      changeCurrency(localCurrency);
      toast.success('Workspace preferences saved!', {
        style: { background: '#22C55E', color: '#FFFFFF', fontWeight: 'bold' }
      });
      setIsSavingPrefs(false);
    }, 500);
  };



  const getInitials = (n) => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Settings & Configurations
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, account credentials, and workspace preferences.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Tabs List Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-2">
          
          {/* Tabs controls */}
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl text-left transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <User size={15} />
            <span>Account Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl text-left transition-all cursor-pointer ${
              activeTab === 'workspace'
                ? 'bg-primary text-white shadow-md shadow-primary/10'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800'
            }`}
          >
            <Sliders size={15} />
            <span>CRM Preferences</span>
          </button>

          {/* Quick Profile Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center select-none mt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-xl text-white mx-auto shadow-md border border-white/10">
              {getInitials(user?.name)}
            </div>
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-white mt-3 truncate">
              {user?.name}
            </h4>
            <p className="text-[9px] font-mono text-slate-500 truncate mt-0.5">
              {user?.email}
            </p>
            <span className="inline-block mt-3 text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700/60">
              {user?.email === 'admin@auracrm.com' ? 'Super Administrator' : 'Workspace Agent'}
            </span>
          </div>

        </div>

        {/* Action Panel Column */}
        <div className="md:col-span-3">
          
          {/* TAB 1: PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs animate-fade-in">
              <div className="border-b border-slate-150 dark:border-slate-800 pb-4 mb-5">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Account Details
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Update your contact details and active workspace security credentials.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="block w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-hidden focus:border-primary focus:bg-white dark:focus:bg-slate-950/40 transition-all duration-150"
                    />
                  </div>

                  {/* Registered Email field (Read Only) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 flex items-center gap-1">
                      <span>Email Address</span>
                      <span className="text-[8px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded-sm border border-slate-200 dark:border-slate-700">READONLY</span>
                    </label>
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={user?.email || ''}
                      className="block w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-400 dark:text-slate-500 select-none cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* New Password field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                      Change Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="block w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-hidden focus:border-primary focus:bg-white dark:focus:bg-slate-950/40 transition-all duration-150"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 hover:text-slate-650 dark:text-slate-500 dark:hover:text-slate-350 focus:outline-hidden"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="block w-full pl-3.5 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-hidden focus:border-primary focus:bg-white dark:focus:bg-slate-950/40 transition-all duration-150"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSavingProfile ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={13} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CRM WORKSPACE PREFERENCES */}
          {activeTab === 'workspace' && (
            <div className="space-y-6">
              {/* Workspace General Config Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs animate-fade-in">
                <div className="border-b border-slate-150 dark:border-slate-800 pb-4 mb-5">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Workspace Preferences
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customize localized attributes and display currencies for reports.
                  </p>
                </div>

                <form onSubmit={handleSavePrefs} className="space-y-4">
                  {/* Currency Selection dropdown */}
                  <div className="space-y-1.5 max-w-md">
                    <label htmlFor="currency" className="text-[10px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                      Display Currency
                    </label>
                    <select
                      id="currency"
                      value={localCurrency}
                      onChange={(e) => setLocalCurrency(e.target.value)}
                      className="block w-full px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-hidden focus:border-primary transition-all duration-150 cursor-pointer"
                    >
                      <option value="₹">Indian Rupee (₹)</option>
                      <option value="$">US Dollar ($)</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingPrefs}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isSavingPrefs ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Check size={13} />
                          <span>Save Preferences</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>



            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Settings;
