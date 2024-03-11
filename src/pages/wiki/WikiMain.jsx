import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getOneGame } from "../../service/games";
import { Spinner } from "@nextui-org/react";

export const WikiMain = () => {
  const { currentUser } = useAuth();
  const { gameId } = useParams();

  const { data: gameData, isPending } = useQuery({
    queryKey: ["game", currentUser.uid, gameId],
    queryFn: () => getOneGame(gameId, currentUser.uid),
  });

  if (isPending) {
    return (
      <Spinner
        label="Loading..."
        color="primary"
        size="lg"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  return (
    <div className="flex-2 p-5 justify-items-center w-full">
      <h1 className="cardHeader">{gameData?.name}</h1>
      <p className="text-justify">{gameData?.description}</p>
    </div>
  );
};
