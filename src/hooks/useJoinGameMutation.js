import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGame } from "../service/games";

export const useJoinGameMutation = (userId) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: "joinGame",
    mutationFn: (gameId) => joinGame(userId, gameId),
    onSuccess: () => {
      console.log("Joined game successfully");
      queryClient.invalidateQueries(["game", userId]);
    },
    onError: (error) => {
      console.error("Failed to join game:", error);
    },
  });

  return { joinGame: mutate, isJoining: isPending };
};
