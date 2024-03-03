import React, { useState } from "react";
import { getGames, joinGame } from "../service/games";
import { useAuth } from "../context/AuthProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Image } from "@nextui-org/react";
import { formatDate } from "../utils/formatDate";

export const Games = () => {
  const { currentUser } = useAuth();
  const { data: gamesData, isPending } = useQuery({
    queryKey: ["games", currentUser?.uid],
    queryFn: () => getGames(currentUser?.uid),
  });

  const [displayCount, setDisplayCount] = useState(4);

  const showMoreGames = () => {
    setDisplayCount((prevCount) => prevCount + 4);
  };

  const { mutate: joinGameMutation, isPending: isPendingJoin } = useMutation({
    mutationKey: "joinGame",
    mutationFn: (gameId) => joinGame(currentUser.uid, gameId),
    onSuccess: () => {
      console.log("Joined game successfully");
    },
    onError: (error) => {
      console.error("Failed to join game:", error);
    },
  });

  const joinGameHandler = (gameId) => {
    joinGameMutation(gameId);
  }

  

  if (isPending) {
    return <p>Loading...</p>;
  }

  const sortedGamesData = gamesData.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container mx-auto my-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Games</h1>
      <div className="flex justify-center mb-4">
        <Button
          as={"a"}
          href="/newgame"
          color="primary"
          size="lg"
          className="w-full shadow-lg md:w-2/3 lg:w-1/2"
        >
          New Game
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {sortedGamesData.slice(0, displayCount).map((game) => (
          <div
            key={game.id}
            className="p-4 bg-white rounded-lg shadow-lg text-center"
          >
            <Image
              src={game.gameImage}
              alt={`${game.name} image`}
              width="100%"
              className="rounded-lg mb-4"
            />

            <h2 className="text-xl mb-2">
              <a
                href={`/games/${game.id}`}
                className="text-blue-600 hover:text-blue-700"
              >
                {game.name}
              </a>
            </h2>
            <p>{game.description}</p>
            <p>Created by: {game.creator.displayName}</p>
            <p>Created: {formatDate(game.createdAt)}</p>
            <Button
              onClick={() => joinGameHandler(game.id)}
              isPending={isPendingJoin}
              fullWidth
              color="primary"
              size="lg"
              className="shadow-lg"
            >
              Join Game
            </Button>
          </div>
        ))}
      </div>
      {displayCount < sortedGamesData.length && (
        <div className="text-center my-4">
          <Button
            onClick={showMoreGames}
            variant="light"
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
