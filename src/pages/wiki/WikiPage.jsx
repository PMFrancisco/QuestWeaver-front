import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteGameInfo, getGameInfo } from "../../service/gameInfo";
import { Button, Spinner } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeatherPointed,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export const WikiPage = () => {
  const { gameId } = useParams();
  const { gameInfoId } = useParams();
  const queryClient = useQueryClient()
  const navigate=useNavigate()

  const { data: gameInfo, isFetching } = useQuery({
    queryKey: ["gameInfo", gameInfoId],
    queryFn: () => getGameInfo(gameInfoId),
  });

  const { mutate: deleteGame, isLoading: isPending } = useMutation({
    mutationFn: () => deleteGameInfo(gameInfoId),
    onSuccess: () => {
      navigate(`/games/${gameId}/wiki`);
      queryClient.invalidateQueries(["gameInfo", gameInfoId]);
    },
    onError: (error) => {
      alert(`Error deleting game info: ${error.message}`);
    },
  });

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteGame(gameInfoId);
    }
  };

  if (isFetching) {
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
          onClick={handleDeleteClick}
          isLoading={isPending}
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
