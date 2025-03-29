'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
export default function UserProfile() {
  const { user, logout, updateUserDetails,checkAuth } = useAuth();
  const [name, setName] = useState(user?.profile?.[0]?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-serif text-gray-800 mb-4">Profile</h2>
      
      {error && (
        <div className="bg-red-50 text-red-800 rounded-md p-3 mb-6 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-800 rounded-md p-3 mb-6 text-sm">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <div className="text-sm text-gray-500">Email</div>
        <div className="font-medium text-gray-800">{user.email}</div>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-[#973B00]"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setName(user.profile[0].full_name || '');
              }}
              className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium text-gray-800">{user?.profile?.[0]?.full_name || 'Not set'}</div>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#973B00] hover:bg-[#BA4D00] text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Edit Profile
            </button>
            
            <button
              onClick={logout}
              className="border border-red-300 text-red-700 font-medium py-2 px-4 rounded hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}