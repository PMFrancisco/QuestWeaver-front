import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

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
  <div className="flex-2 p-5">
    <h1 className='cardHeader'>{gameData.name}</h1>
    <p>{gameData.description}</p>
  </div>
  );
};

