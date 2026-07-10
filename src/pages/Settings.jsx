import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Shield, Save, KeyRound } from 'lucide-react';

/**
 * Settings Page Component
 * Allows authenticated users to change their profile Name and Password.
 * Email is set to read-only.
 * Persists modifications in the database via the PUT /api/auth/profile API.
 */
const Settings = () => {
  const { user, updateProfile } = useAuth();

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || ''); // Read-only email
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If attempting a password update, perform basic validation
    if (newPassword || oldPassword || confirmPassword) {
      if (!oldPassword) {
        toast.error('Current password is required to set a new password');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('New password must be at least 6 characters long');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Confirm password does not match new password');
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload = { name };
      if (newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }

      await updateProfile(payload);
      toast.success('Profile settings updated successfully!', {
        style: {
          background: '#22C55E',
          color: '#FFFFFF',
          fontWeight: 'bold',
        },
      });

      // Clear password fields on success
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile settings';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white sm:text-2xl tracking-tight">
          System Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Manage your personal account profile, authentication credentials, and workspace settings.
        </p>
      </div>

      {/* 2. Settings Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column info panel */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-border/40 dark:border-border/10 shadow-xs flex flex-col items-center text-center">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-extrabold text-xl text-white border border-white/10 select-none shadow-md mb-4">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-white dark:border-slate-900" />
            </div>
            
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {user?.name || 'User Name'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Workspace Administrator
            </p>
            
            <div className="w-full border-t border-border/40 dark:border-border/10 mt-5 pt-4 text-left space-y-3.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <Shield size={14} className="text-primary shrink-0" />
                <span className="truncate">Access Level: Admin</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <Mail size={14} className="text-primary shrink-0" />
                <span className="truncate" title={user?.email}>{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column editor form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8 rounded-2xl border border-border/40 dark:border-border/10 shadow-xs space-y-6">
            
            {/* Profile Section */}
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-border/40 dark:border-border/10 flex items-center gap-2">
                <User size={14} className="text-primary" />
                Profile Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                      <User size={15} />
                    </span>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Email (Read-Only) */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    Email Address
                    <span className="text-[8px] bg-slate-200/50 dark:bg-white/10 px-1.5 py-0.2 rounded font-semibold text-slate-500 dark:text-slate-400 normal-case select-none">
                      Read-only
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                      <Mail size={15} />
                    </span>
                    <input
                      id="email"
                      type="email"
                      readOnly
                      disabled
                      value={email}
                      className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-border/40 dark:border-border/10 text-slate-400 dark:text-slate-500 placeholder-slate-400 cursor-not-allowed select-none focus:outline-hidden"
                      title="Email address cannot be changed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {!user?.googleId ? (
              <div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-border/40 dark:border-border/10 flex items-center gap-2">
                  <KeyRound size={14} className="text-primary" />
                  Change Password
                </h3>
                
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="oldPassword" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Current Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                        <Lock size={15} />
                      </span>
                      <input
                        id="oldPassword"
                        type="password"
                        placeholder="Required to set new password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="newPassword" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                          <Lock size={15} />
                        </span>
                        <input
                          id="newPassword"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                          <Lock size={15} />
                        </span>
                        <input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10.5 pr-4 py-3 text-xs rounded-xl glass-input text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
                          autoComplete="new-password"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-primary/10 border border-primary/20 dark:border-primary/10 rounded-2xl flex items-center gap-3">
                <Shield size={16} className="text-primary shrink-0 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-650 dark:text-slate-350">
                  Your account is authenticated via Google. Password settings are managed directly by Google.
                </span>
              </div>
            )}

            {/* Form Footer Action */}
            <div className="flex justify-end pt-4 border-t border-border/40 dark:border-border/10 shrink-0">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all duration-150 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
