import React from "react";
import { WikiSidebar } from "../WikiSidebar";
import { Outlet } from "react-router-dom";

export const WikiLayout = () => {
  return (
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
  );
};
