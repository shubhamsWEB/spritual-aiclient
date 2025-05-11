'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import Image from 'next/image';
import { FiEdit2, FiLogOut, FiCheck, FiX, FiClipboard, FiUsers, FiUser, FiCreditCard, FiGift } from 'react-icons/fi';

export default function UserProfile() {
  const { user, logout, updateUserDetails, checkAuth } = useAuth();
  const [name, setName] = useState(user?.profile?.[0]?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // Default tab is profile

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await updateUserDetails({...user, name });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      // Refresh the page to update user context
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if(!user?.profile?.[0]?.full_name){  
      checkAuth();
    }
  }, [user]);

  const getPlanName = (plan: string) => {
    switch(plan) {
      case 'devotee':
        return 'Devotee Plan';
      case 'guru':
        return 'Guru Plan';
      default:
        return 'Free Plan';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>;
      case 'expired':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Expired</span>;
      case 'cancelled':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Unknown</span>;
    }
  };

  // Function to copy referral code to clipboard
  const copyReferralCode = () => {
    if (user?.referral?.code) {
      navigator.clipboard.writeText(user.referral.code)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => console.error('Failed to copy:', err));
    }
  };

  // Function to get badge color for referral status
  const getReferralStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Pending</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Failed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16">
            <Image
              src="/logo.png"
              alt="Profile"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-gray-800">{user?.profile?.[0]?.full_name || 'User'}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <ul className="flex overflow-x-auto">
          <li className="mr-2">
            <button
              className={`inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'profile'
                  ? 'border-[#973B00] text-[#973B00]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser className="mr-2" />
              <span>Profile Info</span>
            </button>
          </li>
          {user?.subscription?.hasActiveSubscription && (
            <li className="mr-2">
              <button
                className={`inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'subscription'
                    ? 'border-[#973B00] text-[#973B00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('subscription')}
              >
                <FiCreditCard className="mr-2" />
                <span>Subscription</span>
              </button>
            </li>
          )}
          {user?.referral && (
            <li className="mr-2">
              <button
                className={`inline-flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'referral'
                    ? 'border-[#973B00] text-[#973B00]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('referral')}
              >
                <FiGift className="mr-2" />
                <span>Referrals</span>
                {user.referral.count > 0 && (
                  <span className="ml-2 bg-[#973B00] text-white rounded-full text-xs px-2 py-0.5">
                    {user.referral.count}
                  </span>
                )}
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {error && (
          <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-6 text-sm flex items-center">
            <FiX className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-800 rounded-lg p-4 mb-6 text-sm flex items-center">
            <FiCheck className="mr-2 flex-shrink-0" />
            {success}
          </div>
        )}

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h3>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setName(user?.profile?.[0]?.full_name || '');
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-800">{user?.profile?.[0]?.full_name || 'Not set'}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-[#973B00] hover:text-[#BA4D00] p-2 rounded-full hover:bg-amber-50 transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && user?.subscription?.hasActiveSubscription && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Subscription Details</h3>
            <div className="bg-amber-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Current Plan</p>
                  <p className="font-medium text-gray-800">{getPlanName(user?.subscription?.plan)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {getStatusBadge(user?.subscription?.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-medium text-gray-800">
                    {format(new Date(user?.subscription?.startDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="font-medium text-gray-800">
                    {format(new Date(user?.subscription?.endDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Auto Renewal</p>
                  <p className="font-medium text-gray-800">
                    {user?.subscription?.autoRenew ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Referral Tab */}
        {activeTab === 'referral' && user?.referral && (
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Referral Program</h3>
            <div className="bg-amber-50 rounded-lg p-6 space-y-6">
              {/* Referral Code */}
              <div className="border border-amber-200 rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
                    <p className="font-medium text-gray-800 text-lg">{user.referral.code}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className={`text-[#973B00] hover:text-[#BA4D00] p-2 rounded-full hover:bg-amber-100 transition-colors flex items-center ${copySuccess ? 'bg-green-100' : ''}`}
                    title="Copy to clipboard"
                  >
                    {copySuccess ? <FiCheck className="w-5 h-5" /> : <FiClipboard className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Share this code with friends to invite them to join our platform.
                </p>
              </div>
              
              {/* Referral Stats */}
              <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center">
                  <FiUsers className="text-[#973B00] w-6 h-6 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Referrals</p>
                    <p className="font-bold text-lg text-[#973B00]">{user.referral.count}</p>
                  </div>
                </div>
                <div className="bg-[#973B00] text-white px-3 py-1 rounded-full text-sm">
                  {user.referral.count} {user.referral.count === 1 ? 'person' : 'people'} joined
                </div>
              </div>
              
              {/* Referral List */}
              {user.referral.referrals && user.referral.referrals.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Your Referrals</h4>
                  <div className="border border-amber-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-amber-200">
                      <thead className="bg-amber-100">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Status
                          </th> */}
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-amber-100">
                        {user.referral.referrals.map((referral) => (
                          <tr key={referral.id} className="hover:bg-amber-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {referral.referee_name || 'Not Available'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {referral.referee_email}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              {getReferralStatusBadge(referral.status)}
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {format(new Date(referral.created_at), 'MMM dd, yyyy')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {user.referral.referrals.length === 0 && (
                <div className="text-center py-6 bg-white rounded-lg border border-amber-200">
                  <p className="text-gray-600">You haven't referred anyone yet.</p>
                  <p className="text-sm text-gray-500 mt-1">Share your code to start earning rewards!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Actions - always visible at the bottom of any tab */}
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 font-medium py-2 px-4 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}