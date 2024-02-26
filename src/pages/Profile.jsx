import React from "react";
import { handleSignOut } from "../service/authService";
import { getUserProfile } from "../service/profile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";

export const Profile = () => {
  const { currentUser } = useAuth();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", currentUser?.uid],
    queryFn: () => getUserProfile(currentUser?.uid),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Profile
        </h1>
        <img
          src={profileData.profileImage}
          alt="Profile Image"
          className="mx-auto h-32 w-32 rounded-full mb-4"
        />
        <p className="text-center text-sm font-medium text-gray-700">
          Username: {profileData.displayName}
        </p>
        <div className="space-y-6 mt-8">
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </button>
          <a
            href="/profile/edit"
            className="block text-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </div>
  );
};
