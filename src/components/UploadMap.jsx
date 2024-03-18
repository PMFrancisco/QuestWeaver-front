import { Button } from "@nextui-org/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createMap } from "../service/map";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export const UploadMap = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: createMapMutation, isPending } = useMutation({
    mutationFn: (formData) => createMap(gameId, formData),
    onSuccess: () => {
      console.log("Map image updated successfully");
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Failed to update profile image:", error);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("mapImage", data.mapImage[0]);
    createMapMutation(formData);
  };

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">Map</h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <p className="text-center">
            Upload a map to start your new adventure!
          </p>
          <Controller
            name="mapImage"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange, value, ref } }) => (
              <div className="fileInputContainer">
                <label className="fileInputLabel">Select Map Image:</label>
                <input
                  type="file"
                  id="mapImage"
                  name="mapImage"
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
            isLoading={isPending}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Upload Image
          </Button>
        </form>
      </div>
    </div>
  );
};
