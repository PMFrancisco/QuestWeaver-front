import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGameInfo } from "../../service/gameInfo";
import { Spinner } from "@nextui-org/react";

export const WikiPage = () => {
  const { gameInfoId } = useParams();
  const { data: gameInfo, isPending } = useQuery({
    queryKey: ["gameInfo", gameInfoId],
    queryFn: () => getGameInfo(gameInfoId),
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
      <h1 className="cardHeader">{gameInfo.title}</h1>
      <p className="text-justify">{gameInfo.content}</p>
    </div>
  );
};
