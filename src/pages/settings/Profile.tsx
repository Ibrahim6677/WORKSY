import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Camera, Edit3, Save, X } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store/store';
import { 
  fetchUserProfile, 
  updateProfile, 
  uploadAvatar, 
  deleteAvatar,
  clearUpdateSuccess 
} from '../../features/profile/profileSlice';
import { InputProfile } from "../../components/atoms/input/Input";

export default function Profile() {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    profile, 
    loading, 
    uploading, 
    error, 
    updateSuccess 
  } = useSelector((state: RootState) => state.profile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    jobTitle: profile?.jobTitle || "",
    status: profile?.status || "",
    timeZone: profile?.timeZone || "",
    phoneNumber: profile?.phoneNumber || "",
    location: profile?.location || "",
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update form data when user data changes
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        jobTitle: profile.jobTitle || "",
        status: profile.status || "",
        timeZone: profile.timeZone || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
      });
    }
  }, [profile]);

  // Handle update success
  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      // Show success message (you can replace this with a proper toast notification)
      const timer = setTimeout(() => {
        // Reset success state after showing message
        dispatch(clearUpdateSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || "",
        email: profile.email || "",
        jobTitle: profile.jobTitle || "",
        status: profile.status || "",
        timeZone: profile.timeZone || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
      });
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await dispatch(uploadAvatar(file)).unwrap();
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await dispatch(deleteAvatar()).unwrap();
    } catch (error) {
      console.error('Failed to delete avatar:', error);
    }
  };
  const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M12.6519 3.05175C13.9537 1.75 16.064 1.75 17.3658 3.05175C18.6673 4.35346 18.6673 6.46295 17.3658 7.76464L8.52692 16.6035C8.01708 17.1134 7.35592 17.4448 6.64216 17.5469L4.44196 17.8603C3.3421 18.0175 2.39927 17.0754 2.55622 15.9756L2.8697 13.7754C2.9717 13.0616 3.30332 12.4005 3.81306 11.8906L12.6519 3.05175ZM4.99177 13.0684C4.73677 13.3233 4.57109 13.6547 4.52009 14.0117L4.20661 16.2109L6.40583 15.8965C6.76273 15.8454 7.09425 15.6807 7.34919 15.4258L15.0718 7.70312L12.7144 5.3457L4.99177 13.0684ZM16.1881 4.22948C15.5583 3.59972 14.5504 3.58099 13.8961 4.16991L16.2467 6.5205C16.8355 5.86625 16.8176 4.85926 16.1881 4.22948Z"
      fill="#667185"
    />
  </svg>
);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-full mx-auto p-6 bg-white rounded-md shadow-sm">
        <div className="text-red-600 text-center">
          <p>Error loading profile: {error}</p>
          <button 
            onClick={() => dispatch(fetchUserProfile())}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="max-w-full mx-auto p-6 bg-white rounded-md shadow-sm">
        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Profile updated successfully!
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">User Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={loading}
              >
                <Save size={16} />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                disabled={loading}
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
        <hr className="mb-6 relative top-0 -left-2 text-[#D0D0D0] w-30" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profile?.avatar || "https://randomuser.me/api/portraits/women/44.jpg"}
                alt="Profile"
                className="w-29 h-26 rounded-full object-cover stroke-5 stroke-white"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
                      disabled={uploading}
                      title="Upload Avatar"
                    >
                      <Camera size={16} />
                    </button>
                    {profile?.avatar && (
                      <button
                        onClick={handleAvatarDelete}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                        disabled={uploading}
                        title="Delete Avatar"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-bold text-Montserrat text-xl">{profile?.fullName || 'User Name'}</h3>
              <p className="text-[#A1A1A1] text-xl font-normal text-inter">{profile?.jobTitle || 'Job Title'}</p>
              <p className="text-[#A1A1A1] text-[16px] font-normal text-inter">
                {profile?.timeZone || 'Eastern European Time (EET), Cairo UTC +3'}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button className="p-4 text-white bg-[#6629DE] hover:bg-[#6529dedf] mr-10 rounded-lg font-bold leading-5 text-xs md:text-sm cursor-pointer">
              Upload New Photo
            </button>
            <button className="py-4 px-10 border border-[#6629DE] text-[#6629DE] hover:bg-purple-50 font-bold rounded-lg text-xs md:text-sm cursor-pointer">
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Full Name
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Full Name"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email Address"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Job Title
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Product Design"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Status
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Working Remotly"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Time Zone
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <select
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
                className="flex-1 outline-none bg-transparent"
                disabled={!isEditing}
              >
                <option value="">Select Time Zone</option>
                <option>Eastern European Time (EET)</option>
                <option>Central European Time (CET)</option>
                <option>Greenwich Mean Time (GMT)</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="124566677777"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm mb-1 font-medium capitalize">
              Location
            </label>
            <div className="flex items-center border border-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <InputProfile
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Cairo"
                disabled={!isEditing}
              />
              {isEditing && icon}
            </div>
          </div>
        </div>
      </div>
  );
}
