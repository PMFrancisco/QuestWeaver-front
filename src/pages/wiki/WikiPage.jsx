import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGameInfo } from "../../service/gameInfo";
import { Button, Spinner } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherPointed, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const WikiPage = () => {
  const { gameId } = useParams();
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
      <div className="flex mt-2 gap-2">
              <Button
                as={Link}
                to={`/games/${gameId}/wiki/${gameInfoId}/edit`}
                color="secondary"
                size="md"
                className="shadow-lg grow"
                style={{ maxWidth: "calc(50% - 4px)" }}
              >
                <FontAwesomeIcon icon={faFeatherPointed} />
                Edit
              </Button>
              <Button
                to={Link}
                href="/"
                color="secondary"
                size="md"
                className="shadow-lg grow"
                style={{ maxWidth: "calc(50% - 4px)" }}
              >
                <FontAwesomeIcon icon={faTrashCan} />
                Delete
              </Button>
            </div>
    </div>
  );
};
