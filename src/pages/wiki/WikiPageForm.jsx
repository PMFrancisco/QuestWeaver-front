import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import {
  addGameInfo,
  getGameInfo,
  updateGameInfo,
} from "../../service/gameInfo";
import { useGameDataContext } from "../../context/GameDataProvider";

export const WikiPageForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { gameId, gameInfoId } = useParams();
  const isEdit = Boolean(gameInfoId);
  const { categories } = useGameDataContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      categoryId: "",
      title: "",
      content: "",
    },
  });

  const { data: existingGameInfo, isFetching } = useQuery({
    queryKey: ["gameInfo", gameInfoId],
    queryFn: () => getGameInfo(gameInfoId),
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingGameInfo) {
      reset(existingGameInfo);
    }
  }, [existingGameInfo, reset]);

  const { mutate: updateGameInfoMutation, isPending } = useMutation({
    mutationFn: isEdit
      ? (formData) => updateGameInfo(gameInfoId, formData)
      : async (formData) => addGameInfo({ ...formData, gameId }),
    onSuccess: (data) => {
      navigate(`/games/${gameId}/wiki/${isEdit ? gameInfoId : data.id}`);
      queryClient.invalidateQueries(["gameInfo", gameInfoId]);
      queryClient.invalidateQueries(["categories", gameId]);
    },
    onError: (error) => {
      console.error("Failed to update game info:", error);
    }
  });

  useEffect(() => {
    if (!isEdit) {
      reset({ categoryId: "", title: "", content: "" });
    }
  }, [isEdit, reset]);

  const onSubmit = (data) => {
    updateGameInfoMutation(data);
  };

  if (isFetching) return <Spinner label="Loading..." />;

  return (
    <div className="flexCardContainer w-full">
      <div className="cardInside">
        <h1 className="cardHeader">
          {isEdit ? "Edit Game Entry" : "Create New Entry"}
        </h1>
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
                initialValue={existingGameInfo?.categoryId}
                fullWidth
              >
                <SelectItem value="">Select a Category</SelectItem>
                {categories?.map((category) => [
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    textValue={category.name}
                  >
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
            render={({ field: { onChange, value } }) => (
              <Input
                fullWidth
                onChange={onChange}
                label="Title"
                value={value}
              />
            )}
          />
          <Controller
            name="content"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange, value } }) => (
              <Textarea
                fullWidth
                onChange={onChange}
                label="Content"
                value={value}
              />
            )}
          />
          <Button type="submit" isPending={isPending} fullWidth color="primary">
            {isEdit ? "Update" : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};
