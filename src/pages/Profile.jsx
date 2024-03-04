import React from "react";
import { handleSignOut } from "../service/authService";
import { getUserProfile } from "../service/profile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { Button, Image } from "@nextui-org/react";


export const Profile = () => {
  const { currentUser } = useAuth();
  const { data: profileData, isPending } = useQuery({
    queryKey: ["profile", currentUser?.uid],
    queryFn: () => getUserProfile(currentUser?.uid),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">
          Profile
        </h1>
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
            as={"a"}
            href="/profile/edit"
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
            onClick={() => handleSignOut()}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
