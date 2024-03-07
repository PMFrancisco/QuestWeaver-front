import { Accordion, AccordionItem, Button, Input } from "@nextui-org/react";
import React from "react";
import { Outlet, useParams } from "react-router-dom";
import {
  addCategory as addCategoryApi,
  getCategories,
} from "../service/categories";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WikiSidebar = () => {
  const { gameId } = useParams();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      categoryName: "",
    },
  });

  const { data: categories, isPending: isLoadingCategories } = useQuery({
    queryKey: ["categories", gameId],
    queryFn: () => getCategories(gameId),
  });

  const { mutate: addCategory, isPending } = useMutation({
    mutationFn: async (categoryData) =>
      addCategoryApi({
        ...categoryData,
        gameId,
      }),
    onSuccess: () => {
      console.log("Category added successfully");
      reset();
      queryClient.invalidateQueries(["categories", gameId]);
    },
    onError: (error) => {
      console.error("Error adding category:", error);
    },
  });

  const onSubmit = (data) => {
    addCategory(data);
  };

  return (
    <div className="flex flex-row">
      <div className="w-1/3">
        <h2>Index</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="categoryName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="Category Name"
                fullWidth
                clearable
                status={errors.categoryName ? "error" : "default"}
                helperColor="error"
                helperText={errors.categoryName?.message}
              />
            )}
          />
          <Button auto type="submit" color="primary" loading={isPending}>
            Add category
          </Button>
        </form>
        {isLoadingCategories ? (
          <p>Loading categories...</p>
        ) : (
          <Accordion isCompact>
            {categories?.categories.map((category) => (
              <AccordionItem
                key={category.id}
                aria-label={category.name}
                title={category.name}
              >
                <Controller
                  name="categoryName"
                  control={control}
                  rules={{ required: "This field is required" }}
                  render={({ field: { onChange } }) => (
                    <Input
                      onChange={onChange}
                      label="Category Name"
                      fullWidth
                      clearable
                      status={errors.categoryName ? "error" : "default"}
                      helperColor="error"
                      helperText={errors.categoryName?.message}
                    />
                  )}
                />
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
      <Outlet />
    </div>
  );
};
