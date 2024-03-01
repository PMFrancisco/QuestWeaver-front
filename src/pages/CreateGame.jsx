import React from "react";
import { Controller, useForm } from "react-hook-form";
import { createGame } from "../service/games";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useNavigate } from "react-router-dom";

export const CreateGame = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: createGameMutation, isLoading } = useMutation({
    mutationKey: "createGame",
    mutationFn: async (formData) => {
      const id = currentUser.uid;
      const { name, description } = formData;
      const { data } = await createGame(id, { name, description });
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Create new game
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          />{" "}
          <Controller
            name="description"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
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
            isDisabled={isLoading}
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
