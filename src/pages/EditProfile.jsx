import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { editUserProfile, getUserProfile } from "../service/profile";
import { Input } from "@nextui-org/input";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@nextui-org/button";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", currentUser.uid],
    queryFn: () => getUserProfile(currentUser.uid),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const updateProfile = useMutation({
    mutationFn: (userData) => editUserProfile(currentUser.uid, userData),
    onSuccess: () => {
      console.log("Profile updated successfully");
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const onSubmit = (data) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Edit Profile
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="First Name"
                labelPlacement="inside"
                variant="faded"
                placeholder={profileData.firstName}
                isInvalid={!!errors.firstName}
                color={errors.firstName ? "danger" : "default"}
                errorMessage={errors.firstName && errors.firstName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                label="Last Name"
                onChange={onChange}
                labelPlacement="inside"
                variant="faded"
                placeholder={profileData.lastName}
                isInvalid={!!errors.lastName}
                color={errors.lastName ? "danger" : "default"}
                errorMessage={errors.lastName && errors.lastName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Controller
            name="displayName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="Display Name"
                labelPlacement="inside"
                variant="faded"
                placeholder={profileData.displayName}
                isInvalid={!!errors.displayName}
                color={errors.displayName ? "danger" : "default"}
                errorMessage={errors.displayName && errors.displayName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Button
            type="submit"
            value="Login"
            isDisabled={isLoading}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Update profile
          </Button>
        </form>
      </div>
    </div>
  );
};
