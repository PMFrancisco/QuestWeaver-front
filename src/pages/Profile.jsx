import React from "react";
import { handleSignOut } from "../service/authService";
import { getUserProfile } from "../service/profile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { Button, Image, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";

export const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { data: profileData, isPending } = useQuery({
    queryKey: ["profile", currentUser?.uid],
    queryFn: () => getUserProfile(currentUser?.uid),
  });

  if (isPending) {
    return (
      <Spinner
        label="Loading..."
        color="primary"
        size="lg"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">Profile</h1>
        <div className="mb-4 justify-center flex">
          <Image
            src={profileData.profileImage}
            alt="Profile Image"
            radius="full"
            width={300}
            height={300}
          />
        </div>
        <p className="text-center text-sm font-medium text-gray-700">
          Username: {profileData.displayName}
        </p>
        <div className="space-y-6 mt-8">
          <Button
            as={Link}
            to="/profile/edit"
            value="Edit Profile"
            isDisabled={isPending}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Edit Profile
          </Button>
          <Button
            value="Sign out"
            isDisabled={isPending}
            fullWidth
            color="secondary"
            size="lg"
            className="shadow-lg"
            onClick={() => handleSignOut(navigate)}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
