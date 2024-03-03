import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getOneGame } from "../service/games";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { Button, Image } from "@nextui-org/react";
import { useJoinGameMutation } from "../hooks/useJoinGameMutation";

export const Game = () => {
  const { currentUser } = useAuth();
  const { gameId } = useParams();

  const { data: gameData, isPending } = useQuery({
    queryKey: ["game", currentUser.uid, gameId],
    queryFn: () => getOneGame(gameId, currentUser.uid),
  });

  const { joinGame: joinGameMutation, isJoining: isPendingJoin } =
    useJoinGameMutation(currentUser?.uid);

  const joinGameHandler = (gameId) => {
    joinGameMutation(gameId);
  };

  if (isPending) {
    return <p>Loading...</p>;
  }

  const isGameCreator = gameData.creatorId === currentUser.uid;
  const canJoin = !gameData.participants.some(
    (participant) => participant.userId === currentUser.uid
  );

  return (
    <>
    <div className="flex justify-center items-center align-center">
      <div className="p-4 mt-4 md:p-8 bg-white shadow-md rounded-lg max-w-7xl w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          {gameData.name}
        </h1>
        <div className="flex justify-center">
        <Image src={gameData.gameImage} alt={`${gameData.name} image`} className="max-h-96" />
        </div>
        <div className="game-description">
          <p>{gameData.description}</p>
          <p>Created: {formatDate(gameData.createdAt)}</p>
          {canJoin && (
            <Button
              onClick={() => joinGameHandler(gameData.id)}
              isPending={isPendingJoin}
              fullWidth
              color="primary"
              size="lg"
              className="shadow-lg"
            >
              Join Game
            </Button>
          )}
          <form action={`/gameInfo/${gameData.id}`} method="get">
            <button type="submit">Wiki</button>
          </form>
          <form action={`/map/${gameData.id}`} method="get">
            <button type="submit">Maps</button>
          </form>
        </div>
      

      <div>
        <h2>Players</h2>
        <ul>
          {gameData.participants
            .filter((participant) => participant.isAccepted)
            .map((participant) => (
              <li key={participant.id}>
                <img src={participant.user.profileImage} alt="Profile Image" />
                <span>{participant.user.displayName}</span>
              </li>
            ))}
        </ul>
      </div>

      {isGameCreator && (
        <div>
          <h2>Pending Players</h2>
          <ul>
            {gameData.participants
              .filter((participant) => !participant.isAccepted)
              .map((participant) => (
                <li key={participant.id}>
                  <img
                    src={participant.user.profileImage}
                    alt="Profile Image"
                  />
                  <span>{participant.user.displayName}</span>
                  <form action="/games/acceptPlayer" method="post">
                    <input type="hidden" name="gameId" value={gameData.id} />
                    <input
                      type="hidden"
                      name="userId"
                      value={participant.user.id}
                    />
                    <button type="submit">Accept</button>
                  </form>
                </li>
              ))}
          </ul>
        </div>
      )}
          </div>


    </div>
    </>
  );
};
