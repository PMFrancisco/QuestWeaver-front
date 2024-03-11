import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getAllGames } from "../service/games"; // Ensure this is correctly imported
import { Button, Image, Spinner } from "@nextui-org/react";
import { formatDate } from "../utils/formatDate";
import { useJoinGameMutation } from "../hooks/useJoinGameMutation";
import { Link } from "react-router-dom";

export const GameList = () => {
  const { currentUser } = useAuth();
  const { data: gamesData, isPending } = useQuery({
    queryKey: ["games", currentUser?.uid],
    queryFn: () => getAllGames(currentUser?.uid),
  });

  const [displayCount, setDisplayCount] = useState(4);
  const { joinGame: joinGameMutation, isJoining: isPendingJoin } =
    useJoinGameMutation(currentUser?.uid);

  const joinGameHandler = (gameId) => {
    joinGameMutation(gameId);
  };

  const showMoreGames = () => {
    setDisplayCount((prevCount) => prevCount + 4);
  };

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

  const sortedGamesData = gamesData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Games
      </h1>
      <div className="flex justify-center mb-4">
        <Button
          as={Link}
          to="/newgame"
          color="primary"
          size="lg"
          className="w-full shadow-lg md:w-2/3 lg:w-1/2"
        >
          New Game
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {sortedGamesData.slice(0, displayCount).map((game) => {
          const canJoin = !game.participants.some(
            (participant) => participant.userId === currentUser.uid
          );
          const isPendingApproval = game.participants.some(
            (participant) =>
              participant.userId === currentUser.uid && !participant.isAccepted
          );

          return (
            <div
              key={game.id}
              className="flex flex-col p-4 bg-white rounded-lg shadow-lg text-center"
            >
              <div className="w-full max-h-96 md:h-80 flex justify-center items-center my-4">
                <Image
                  src={game.gameImage}
                  alt={`${game.name} image`}
                  classNames={{
                    img: "max-w-full max-h-full object-contain justify-center",
                    wrapper: "w-full h-full items-center flex",
                  }}
                />
              </div>
              <Link
                to={`/games/${game.id}`}
                className="text-blue-600 hover:text-blue-700 text-xl"
              >
                {game.name}
              </Link>
              <p className="mb-4 line-clamp-4">{game.description}</p>
              <div className="justify-self-end mt-auto text-justify">
                <p>Created by: {game.creator.displayName}</p>
                <p>Created: {formatDate(game.createdAt)}</p>
                {canJoin ? (
                  <Button
                    onClick={() => joinGameHandler(game.id)}
                    isPending={isPendingJoin}
                    fullWidth
                    color="primary"
                    size="lg"
                    className="shadow-lg mt-2"
                  >
                    Join Game
                  </Button>
                ) : isPendingApproval ? (
                  <Button
                    isDisabled
                    fullWidth
                    color="danger"
                    size="lg"
                    className="shadow-lg mt-2"
                  >
                    Pending Approval
                  </Button>
                ) : (
                  <Button
                    isDisabled
                    fullWidth
                    color="primary"
                    size="lg"
                    className="shadow-lg mt-2"
                  >
                    Joined
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {displayCount < sortedGamesData.length && (
        <div className="text-center my-4">
          <Button
            onClick={showMoreGames}
            variant="outlined"
            color="primary"
            size="lg"
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
};
