import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getOneGame } from "../service/games";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import { Button, Image } from "@nextui-org/react";
import { useJoinGameMutation } from "../hooks/useJoinGameMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-solid-svg-icons";

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

  const canJoin = !gameData.participants.some(
    (participant) => participant.userId === currentUser.uid
  );

  return (
    <>
      <div className="flexCardContainer">
        <div className="cardInside">
          <h1 className="cardHeader">{gameData.name}</h1>
          <div className="flex justify-center">
            <Image
              src={gameData.gameImage}
              alt={`${gameData.name} image`}
              className="max-h-96"
            />
          </div>
          <div className="flex flex-col justify-center self-center md:w-4/5 lg:w-3/5 mx-auto mt-4">
            <p className="text-justify mb-4">{gameData.description}</p>
            <p>Created: {formatDate(gameData.createdAt)}</p>
            {canJoin ? (
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
            ) : gameData.participants.some(
                (participant) => !participant.isAccepted
              ) ? (
              <Button
                isDisabled
                fullWidth
                color="danger"
                size="lg"
                className="shadow-lg"
              >
                Pending Approval
              </Button>
            ) : (
              <Button
                isDisabled
                fullWidth
                color="primary"
                size="lg"
                className="shadow-lg"
              >
                Joined
              </Button>
            )}

            <div className="flex mt-2 gap-2">
              <Button
                as={"a"}
                href="/wiki"
                color="secondary"
                size="md"
                className="shadow-lg grow"
                style={{ maxWidth: "calc(50% - 4px)" }}
              >
                <FontAwesomeIcon icon={faBookBookmark} />
                Wiki
              </Button>
              <Button
                as={"a"}
                href="/maps"
                color="secondary"
                size="md"
                className="shadow-lg grow"
                style={{ maxWidth: "calc(50% - 4px)" }}
              >
                <FontAwesomeIcon icon={faMap} />
                Maps
              </Button>
            </div>
          </div>

          <div>
            <h2>Players</h2>
            <ul>
              {gameData.participants
                .filter((participant) => participant.isAccepted)
                .map((participant) => (
                  <li key={participant.id}>
                    <img
                      src={participant.user.profileImage}
                      alt="Profile Image"
                    />
                    <span>{participant.user.displayName}</span>
                  </li>
                ))}
            </ul>
          </div>

          {gameData.participants.role == "creator" && (
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
                        <input
                          type="hidden"
                          name="gameId"
                          value={gameData.id}
                        />
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
