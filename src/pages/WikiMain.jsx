import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { useParams } from 'react-router-dom';

export const WikiMain = () => {
  const { currentUser } = useAuth();
  const { gameId } = useParams();

  const { data: gameData, isPending } = useQuery({
    queryKey: ["game", currentUser.uid, gameId],
    queryFn: () => getOneGame(gameId, currentUser.uid),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
<div className="flex max-w-6xl mx-auto">
  <div className="flex-2 p-5">
    <h2>{gameData.name}</h2>
    <p>{gameData.description}</p>
  </div>
</div>
  );
};

