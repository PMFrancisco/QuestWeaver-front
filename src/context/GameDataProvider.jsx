import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../service/categories";
const GameDataContext = createContext();

export const useGameDataContext = () => useContext(GameDataContext);

export const GameDataProvider = ({ children, gameId }) => {
  const { data, isFetching } = useQuery({
    queryKey: ["categories", gameId],
    queryFn: () => getCategories(gameId),
    onSuccess: (data) => console.log("Categories fetched successfully:", data),
    onError: (err) => console.error("Error fetching categories:", err),
  });

  return (
    <GameDataContext.Provider
      value={{ categories: data?.categories, isLoadingCategories: isFetching }}
    >
      {children}
    </GameDataContext.Provider>
  );
};
