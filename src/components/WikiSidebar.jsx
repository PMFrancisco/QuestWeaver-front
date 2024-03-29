import React, { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addCategory as addCategoryApi } from "../service/categories";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionItem,
  Button,
  Input,
  Spinner,
} from "@nextui-org/react";
import { useGameDataContext } from "../context/GameDataProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export const WikiSidebar = () => {
  const { gameId } = useParams();
  const queryClient = useQueryClient();
  const { categories, isLoadingCategories } = useGameDataContext();
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddSubcategory, setShowAddSubcategory] = useState({});
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

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

  const { mutate: addCategory, isPending } = useMutation({
    mutationFn: async (categoryData) =>
      addCategoryApi({
        ...categoryData,
        gameId,
      }),
    onSuccess: () => {
      console.log("Category added successfully");
      reset({ categoryName: "" });
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

  const toggleAddSubcategoryVisibility = (categoryId) => {
    setShowAddSubcategory((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const topLevelCategories = categories?.filter((cat) => !cat.parentId);

  if (isLoadingCategories)
    return (
      <Spinner
        label="Loading..."
        color="primary"
        size="lg"
        className="flex justify-center items-center h-screen"
      />
    );

  return (
    <>
      <div className="flex justify-center">
        <h2 className="text-lg font-bold ">
          <FontAwesomeIcon
            className="md:hidden pr-2"
            onClick={toggleSidebar}
            icon={faBars}
          />
          <Link to={`/games/${gameId}/wiki`}>Index</Link>
        </h2>
      </div>
      <div className={`${isSidebarVisible ? "block" : "hidden"} md:block `}>
        <div className="flex flex-col gap-1">
          <Button variant="ghost" as={Link} to={`/games/${gameId}/wiki/new`}>
            New Entry
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowAddCategory(!showAddCategory)}
          >
            {showAddCategory ? "Cancel Adding Category" : "Add New Category"}
          </Button>
        </div>
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
                    <li key={info.id}>
                      <Link to={`/games/${gameId}/wiki/${info.id}`}>
                        {info.title}{" "}
                      </Link>
                    </li>
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
                          <li key={info.id}>
                            <Link to={`/games/${gameId}/wiki/${info.id}`}>
                              {info.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionItem>
                  ))}
                </Accordion>
                <Button
                  variant="light"
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
      </div>
    </>
  );
};
