import { Accordion, AccordionItem, Button, Input } from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addCategory as addCategoryApi,
  getCategories,
} from "../service/categories";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const WikiSidebar = () => {
  const { gameId } = useParams();
  const queryClient = useQueryClient();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState({});

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
      reset({
        categoryName: "",
      });
      queryClient.invalidateQueries(["categories", gameId]);
      setShowAddCategory(false);
      setShowAddSubcategory({});
    },
    onError: (error) => {
      console.error("Error adding category:", error);
    },
  });

  const onSubmit = useCallback(
    (data, parentId) => {
      addCategory({ ...data, parentId });
    },
    [addCategory]
  );

  if (isLoadingCategories) return <p>Loading categories...</p>;

  const topLevelCategories = categories?.categories.filter(
    (cat) => !cat.parentId
  );

  const toggleAddSubcategoryVisibility = (categoryId) => {
    setShowAddSubcategory((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <>
      <h2>Index</h2>
      <Button
        variant="light"
        onClick={() => setShowAddCategory(!showAddCategory)}
      >
        {showAddCategory ? "Cancel Adding Category" : "Add New Category"}
      </Button>
      {showAddCategory && (
        <form
          onSubmit={handleSubmit((data) => onSubmit(data, null))}
          className="space-y-6"
        >
          <Controller
            name="categoryName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Input
                {...field}
                size="sm"
                label="Category Name"
                fullWidth
                clearable
                status={errors.categoryName ? "error" : "default"}
                helperColor="error"
                helperText={errors.categoryName?.message}
              />
            )}
          />
          <Button
            auto
            type="submit"
            color="primary"
            size="sm"
            isLoading={isPending}
          >
            Add Category
          </Button>
        </form>
      )}
      {isLoadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <Accordion isCompact itemClasses={{ title: "font-bold" }}>
          {topLevelCategories.map((category) => (
            
              <AccordionItem
                key={category.id}
                aria-label={category.name}
                title={category.name}
              >
                <div className="ml-4">
                  <ul>
                    {category.gameInfos.map((info) => (
                      <li key={info.id}>{info.title}</li>
                    ))}
                  </ul>
                  <Accordion isCompact>
                    {category?.children.map((subcategory) => (
                      <AccordionItem
                        key={subcategory.id}
                        title={subcategory.name}
                        classNames={{ title: "font-bold" }}
                      >
                        <ul className="ml-4">
                          {subcategory.gameInfos.map((info) => (
                            <li key={info.id}>{info.title}</li>
                          ))}
                        </ul>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  <Button variant="light"
                    onClick={() => toggleAddSubcategoryVisibility(category.id)}
                  >
                    {showAddSubcategory[category.id]
                      ? "Cancel Adding Subcategory"
                      : "Add Subcategory"}
                  </Button>
                  {showAddSubcategory[category.id] && (
                    <form
                      onSubmit={handleSubmit((data) =>
                        onSubmit(data, category.id)
                      )}
                      className="space-y-6"
                    >
                      <Controller
                        name="categoryName"
                        control={control}
                        rules={{ required: "This field is required" }}
                        render={({ field }) => (
                          <Input
                            {...field}
                            size="sm"
                            label="Subcategory Name"
                            fullWidth
                            clearable
                            status={
                              errors[`subcategoryName-${category.id}`]
                                ? "error"
                                : "default"
                            }
                            helperColor="error"
                            helperText={
                              errors[`subcategoryName-${category.id}`]?.message
                            }
                          />
                        )}
                      />
                      <Button
                        auto
                        type="submit"
                        color="primary"
                        size="sm"
                        loading={isPending}
                      >
                        Add Subcategory
                      </Button>
                    </form>
                  )}
                </div>
              </AccordionItem>
            
          ))}
        </Accordion>
      )}
    </>
  );
};
