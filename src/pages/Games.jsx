import React from "react";
import { getGames } from "../service/games";
import { useAuth } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const Games = () => {
  const { currentUser } = useAuth();
  const { data: gamesData, isLoading } = useQuery({
    queryKey: ["games", currentUser?.uid],
    queryFn: () => getGames(currentUser?.uid),
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {gamesData.map((game) => (
        <div key={game.id} className="p-4 mb-4 border rounded">
          <h2 className="text-xl"><a href={`/games/${game.id}`} className="text-blue-600 hover:text-blue-700">{game.name}</a></h2>
          <p>{game.description}</p>
          <p>Created by: {game.creator.displayName}</p>
          <p>Created: {game.createdAt}</p>
        </div>
      ))}
    </div>
  );
};
