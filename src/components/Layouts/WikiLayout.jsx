import React from "react";
import { WikiSidebar } from "../WikiSidebar";
import { Outlet, useParams } from "react-router-dom";
import { GameDataProvider } from "../../context/GameDataProvider";

export const WikiLayout = () => {
  const { gameId } = useParams();
  return (
    <GameDataProvider gameId={gameId}>
      <div className="flexCardContainer">
        <div className="cardInside flex flex-row h-full">
          <div className="w-1/3">
            <WikiSidebar />
          </div>
          <div className="flex w-2/3 mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </GameDataProvider>
  );
};
