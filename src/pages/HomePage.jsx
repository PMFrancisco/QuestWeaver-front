import { Outlet } from "react-router-dom";

export const HomePage = () => {

  return (
    <div>
      <h1>HomePage</h1>
      <h2>Counter</h2>

      <Outlet />
    </div>
  );
};