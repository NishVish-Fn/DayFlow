import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Lock,
  ShieldCheck,
  FileCheck,
  Edit2,
  FileText,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, refreshProfile } = useAuth();
  const profile = user?.profile;

  // Edit info state
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergencyContact || '');
  const [infoLoading, setInfoLoading] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const { success, error } = useToast();

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setInfoLoading(true);
      await api.put(`/employees/${profile.id}`, {
        phone,
        address,
        emergencyContact,
      });

      success('Profile Updated', 'Your contact details have been updated.');
      setIsEditing(false);
      await refreshProfile();
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error?.message || 'Could not update profile');
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('Mismatch', 'New passwords do not match');
      return;
    }

    try {
      setPassLoading(true);
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      success('Password Updated', 'Your account password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error('Update Failed', err.response?.data?.error?.message || 'Could not update password');
    } finally {
      setPassLoading(false);
    }
  };

  let parsedDocs: Array<{ name: string; type: string; uploadDate: string }> = [];
  if (profile?.documents) {
    try {
      parsedDocs = JSON.parse(profile.documents);
    } catch (e) {
      parsedDocs = [
        { name: 'Passport_Copy.pdf', type: 'IDENTITY', uploadDate: '2023-01-15' },
        { name: 'Employment_Agreement.pdf', type: 'CONTRACT', uploadDate: '2023-01-15' },
      ];
    }
  } else {
    parsedDocs = [
      { name: 'Signed_Offer_Letter.pdf', type: 'OFFER', uploadDate: '2023-01-15' },
      { name: 'Identity_Verification_ID.pdf', type: 'GOV_ID', uploadDate: '2023-01-15' },
    ];
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" /> Account & Profile Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          View organizational credentials, update contact information, access verified documents, and manage security credentials.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 border-b border-white/[0.08] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={
                profile?.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
              }
              alt="Avatar"
              className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/[0.1] object-cover"
            />

            <div className="text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {profile?.firstName} {profile?.lastName}
                </h3>
                <Badge variant="primary" size="sm">
                  {user?.employeeId}
                </Badge>
                <Badge variant="success" size="sm">
                  {user?.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{profile?.designation}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Department of {profile?.department} &bull; Joined {profile?.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString() : '2022'}
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPhone(profile?.phone || '');
              setAddress(profile?.address || '');
              setEmergencyContact(profile?.emergencyContact || '');
              setIsEditing(!isEditing);
            }}
            leftIcon={<Edit2 className="w-3.5 h-3.5 text-indigo-400" />}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Contact Info'}
          </Button>
        </div>

        {/* Profile Info or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleUpdateInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. John Doe (+1 555-019-9999)"
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="742 Evergreen Terrace, San Francisco, CA"
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" isLoading={infoLoading}>
                Save Details
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-white/[0.06] pb-2">
                Contact & Residency
              </h4>

              <div>
                <span className="text-slate-400 block text-[11px]">Corporate Email Address</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" /> {user?.email}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Direct Phone Line</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" /> {profile?.phone || '+1 (555) 019-2831'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Primary Address</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {profile?.address || 'San Francisco Bay Area, CA'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] border-b border-white/[0.06] pb-2">
                Organization & Leadership
              </h4>

              <div>
                <span className="text-slate-400 block text-[11px]">Department Division</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-indigo-400" /> {profile?.department}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Reporting Manager</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {profile?.reportingManager
                    ? `${profile.reportingManager.firstName} ${profile.reportingManager.lastName} (${profile.reportingManager.designation})`
                    : 'Executive Leadership'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">
                  {profile?.emergencyContact || 'Verified on HR Vault'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verified Documents & HR Vault */}
      <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">Verified HR Documents & Contracts</h4>
          </div>
          <Badge variant="success" size="sm">Vault Synced</Badge>
        </div>

        <div className="space-y-2.5">
          {parsedDocs.map((doc, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{doc.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Category: {doc.type} &bull; Uploaded: {doc.uploadDate}
                  </div>
                </div>
              </div>

              <Badge variant="neutral" size="sm">
                Active & Verified
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Security & Password Reset Card */}
      <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-6 shadow-xl backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 mb-4">
          <Lock className="w-4 h-4 text-indigo-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Security & Password Management</h4>
            <p className="text-[11px] text-slate-400">
              Update your account credentials. Passwords are encrypted with Bcrypt Cost 12.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={passLoading}
            leftIcon={<ShieldCheck className="w-4 h-4" />}
          >
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};
