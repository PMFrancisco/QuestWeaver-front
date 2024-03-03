import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createGame } from "../service/games";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button, Input, Textarea } from "@nextui-org/react";

export const CreateGame = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: createGameMutation, isPending } = useMutation({
    mutationKey: "createGame",
    mutationFn: async (formData) => {
      const id = currentUser.uid;
      const formDataToSend = new FormData();
      if (formData.profileImage && formData.profileImage.length > 0) {
        formDataToSend.append("profileImage", formData.profileImage[0]);
      }
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      const { data } = await createGame(id, formDataToSend);
      return data;
    },

    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("New game error error:", error);
    },
  });
  const onSubmit = async (data) => {
    createGameMutation(data);
  };

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">
          Create new game
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="profileImage"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <div className="fileInputContainer">
                <label className="fileInputLabel">Select Game Image:</label>
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
          <Controller
            name="name"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="Game name"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.name}
                color={errors.name ? "danger" : "default"}
                errorMessage={errors.name && errors.name.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Textarea
                minRows={6}
                onChange={onChange}
                label="Game description"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.name}
                color={errors.name ? "danger" : "default"}
                errorMessage={errors.name && errors.name.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />
          <Button
            type="submit"
            value="createGame"
            isLoading={isPending}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Create Game
          </Button>
        </form>
      </div>
    </div>
  );
};
