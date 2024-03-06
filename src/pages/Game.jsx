import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getOneGame } from "../service/games";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@nextui-org/react";
import { useJoinGameMutation } from "../hooks/useJoinGameMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { useAcceptPlayerMutation } from "../hooks/useAcceptPlayerMutation";

export const Game = () => {
  const { currentUser } = useAuth();
  const { gameId } = useParams();

  const { data: gameData, isPending } = useQuery({
    queryKey: ["game", currentUser.uid, gameId],
    queryFn: () => getOneGame(gameId, currentUser.uid),
  });

  const { joinGame: joinGameMutation, isPending: isPendingJoin } =
    useJoinGameMutation(currentUser?.uid);

  const joinGameHandler = (gameId) => {
    joinGameMutation(gameId);
  };

  const { acceptPlayer: acceptPlayerMutation, isPending: isPendingAccept } =
    useAcceptPlayerMutation();

  const acceptPlayerHandler = (userId) => {
    acceptPlayerMutation({ userId, gameId });
  };

  if (isPending) {
    return <p>Loading...</p>;
  }

  const canJoin = !gameData.participants.some(
    (participant) => participant.userId === currentUser.uid
  );

  const isPendingApproval = gameData.participants.some(
    (participant) =>
      participant.userId === currentUser.uid && !participant.isAccepted
  );

  const isCreator = gameData.creatorId === currentUser.uid;

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
            ) : isPendingApproval ? (
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

          <div className="flex flex-col justify-center self-center md:w-4/5 lg:w-3/5 mx-auto mt-4">
            <h2>Players</h2>
            <ul>
              <div className="flex justify-center gap-4 ">
                {gameData.participants
                  .filter((participant) => participant.isAccepted)
                  .map((participant) => (
                    <li key={participant.id}>
                      <Dropdown placement="top-start">
                        <DropdownTrigger>
                          <Avatar
                            isBordered
                            src={participant.user.profileImage}
                            alt="Profile Image"
                            as="button"
                          />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Participant Actions">
                          <DropdownItem
                            textValue={participant.user.displayName}
                          >
                            <p className="font-bold">
                              {participant.user.displayName}
                            </p>
                            <p>{participant.role}</p>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </li>
                  ))}
              </div>
            </ul>
          </div>

          {isCreator && (
            <div className="flex flex-col justify-center self-center md:w-4/5 lg:w-3/5 mx-auto mt-4">
              <h2>Pending Players</h2>
              <ul>
                <div className="flex justify-center gap-4 ">
                  {gameData.participants
                    .filter((participant) => !participant.isAccepted)
                    .map((participant) => (
                      <li key={participant.id}>
                        <Dropdown placement="top-start">
                          <DropdownTrigger>
                            <Avatar
                              isBordered
                              color="danger"
                              src={participant.user.profileImage}
                              alt="Profile Image"
                              as="button"
                            />
                          </DropdownTrigger>
                          <DropdownMenu aria-label="Participant Actions">
                            <DropdownItem
                              textValue={participant.user.displayName}
                            >
                              <p>{participant.user.displayName}</p>
                              <Button
                                onClick={() =>
                                  acceptPlayerHandler(participant.userId)
                                }
                                disabled={isPendingAccept}
                                color="primary"
                              >
                                Accept
                              </Button>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </li>
                    ))}
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
