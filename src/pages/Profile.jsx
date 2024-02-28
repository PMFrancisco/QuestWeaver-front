import React from "react";
import { handleSignOut } from "../service/authService";
import { getUserProfile } from "../service/profile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { Button } from "@nextui-org/button";

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
          src={
            profileData.profileImage
          }
          alt="Profile Image"
          className="mx-auto h-32 w-32 rounded-full mb-4"
        />
        <p className="text-center text-sm font-medium text-gray-700">
          Username: {profileData.displayName}
        </p>
        <div className="space-y-6 mt-8">
          <a href="/profile/edit">
            <Button
              value="Edit Profile"
              isDisabled={isLoading}
              fullWidth
              color="primary"
              size="lg"
              className="shadow-lg"
            >
              Edit Profile
            </Button>
          </a>
          <Button
            value="Sign out"
            isDisabled={isLoading}
            fullWidth
            color="secondary"
            size="lg"
            className="shadow-lg"
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
