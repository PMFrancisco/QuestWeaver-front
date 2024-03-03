import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  editProfileImage,
  editUserProfile,
  getUserProfile,
} from "../service/profile";
import { Input } from "@nextui-org/input";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", currentUser.uid],
    queryFn: () => getUserProfile(currentUser.uid),
  });

  const [isEditingImage, setIsEditingImage] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: updateProfile, isPending: isPendingProfile } = useMutation({
    mutationFn: (userData) => editUserProfile(currentUser.uid, userData),
    onSuccess: () => {
      console.log("Profile updated successfully");
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const { mutate: updateProfileImage, isPending: isPendingImage } = useMutation(
    {
      mutationFn: (formData) => editProfileImage(currentUser.uid, formData),
      onSuccess: () => {
        console.log("Profile image updated successfully");
        navigate("/profile");
      },
      onError: (error) => {
        console.error("Failed to update profile image:", error);
      },
    }
  );

  const onSubmit = (data) => {
    if (isEditingImage) {
      const formData = new FormData();
      formData.append("profileImage", data.profileImage[0]);
      updateProfileImage(formData);
    } else {
      updateProfile(data);
    }
  };

  const toggleForm = () => setIsEditingImage(!isEditingImage);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center align-center">
      <div className="p-4 mt-4 md:p-8 bg-white shadow-md rounded-lg max-w-7xl w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {isEditingImage ? "Edit Profile Image" : "Edit Profile"}
        </h1>
        <div className="relative mb-4 justify-center flex">
          <Image
            src={profileData.profileImage}
            alt="Profile Image"
            radius="full"
            className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
          />
          <FontAwesomeIcon
            icon={faPencil}
            className="absolute bottom-100 right-10 text-gray-600 cursor-pointer fa-xl"
            onClick={toggleForm}
          />
        </div>

        {isEditingImage ? (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="profileImage"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field: { onChange, value, ref } }) => (
                <div className="fileInputContainer">
                  <label className="fileInputLabel">
                    Select Profile Image:
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    ref={ref}
                    onChange={(e) => onChange(e.target.files)}
                    className="w-full h-full bg-transparent text-sm font-normal "
                  />
                </div>
              )}
            />

            <Button
              type="submit"
              value="uploadImage"
              isLoading={isPendingImage}
              fullWidth
              color="primary"
              size="lg"
              className="shadow-lg"
            >
              Upload Image
            </Button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="displayName"
              control={control}
              render={({ field: { onChange } }) => (
                <Input
                  onChange={onChange}
                  label="Username"
                  labelPlacement="inside"
                  variant="faded"
                  placeholder={profileData.displayName}
                  isInvalid={!!errors.displayName}
                  color={errors.displayName ? "danger" : "default"}
                  errorMessage={
                    errors.displayName && errors.displayName.message
                  }
                  classNames={{
                    label: "text-sm font-medium text-black",
                    inputWrapper: ["shadow-lg", "border-gray-300"],
                  }}
                />
              )}
            />

            <Controller
              name="firstName"
              control={control}
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

            <Button
              type="submit"
              value="updateProfile"
              isLoading={isPendingProfile}
              fullWidth
              color="primary"
              size="lg"
              className="shadow-lg"
            >
              Update profile
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
