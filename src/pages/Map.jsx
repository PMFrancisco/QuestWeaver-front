import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getMap } from "../service/map";
import { Spinner } from "@nextui-org/react";
import { UploadMap } from "../components/UploadMap";
import { CanvasMap } from "../components/CanvasMap";

export const Map = () => {
  const { gameId } = useParams();

  const { data: mapData, isFetching } = useQuery({
    queryKey: ["map", gameId],
    queryFn: () => getMap(gameId),
    retry: 0,
    refetchInterval: 5000
  });

/*   if (isFetching) {
    return (
      <Spinner
        label="Loading..."
        color="primary"
        size="lg"
        className="flex justify-center items-center h-screen"
      />
    );
  } */

  if (mapData) {
    return <CanvasMap mapData={mapData} />;
  }

  return <UploadMap />;
};
