import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptPlayer } from "../service/games";              
export const useAcceptPlayerMutation = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: "acceptPlayer",
    mutationFn: ({ gameId, userId }) => acceptPlayer(gameId, userId),
    onSuccess: () => {
      console.log("Player accepted successfully");
      queryClient.invalidateQueries(["gameParticipants"]);
    },
    onError: (error) => {
      console.error("Failed to accept player:", error);
    },
  });

  return { acceptPlayer: mutate, isAccepting: isPending };
};
