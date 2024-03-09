import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { addGameInfo } from "../../service/gameInfo";
import { useGameDataContext } from "../../context/GameDataProvider";

export const WikiNewPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { categories } = useGameDataContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: createGameInfoMutation, isPending } = useMutation({
    mutationKey: "createGameInfo",
 mutationFn: async (formData) => {
  const newGameInfo = { ...formData, gameId };
  const data = await addGameInfo(newGameInfo);
  return data;
},

    onSuccess: (data) => {
      navigate(`/games/${gameId}/wiki/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating game information:", error);
    },
  });

  const onSubmit = async (data) => {
    createGameInfoMutation(data);
  };

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">Create New Game Information</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Select
              aria-label="Category"

                label="Category"
                onChange={onChange}
                initialValue=""
                fullWidth
              >
                <SelectItem value="">Select a Category</SelectItem>
                {categories?.map((category) => [
                  <SelectItem key={category.id} value={category.id} textValue={category.name}>
                    {category.name}
                  </SelectItem>,
                  category.children.map((child) => (
                    <SelectItem
                      key={child.id}
                      value={child.id}
                      className="ml-2"
                      textValue={child.name}
                    >
                      - {child.name}
                    </SelectItem>
                  )),
                ])}
              </Select>
            )}
          />
          <Controller
            name="title"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input fullWidth onChange={onChange} label="Title" />
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Textarea fullWidth onChange={onChange} label="Content" />
            )}
          />
          <Button type="submit" isLoading={isPending} fullWidth color="primary">
            Create GameInfo
          </Button>
        </form>
      </div>
    </div>
  );
};
