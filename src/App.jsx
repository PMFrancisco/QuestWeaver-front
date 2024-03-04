import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { RequireAuth, AlreadyAuth } from "./components/ProtectedRoute";
import { NextUIProvider } from "@nextui-org/react";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { GameList } from "./pages/GameList";
import { CreateGame } from "./pages/CreateGame";
import { Game } from "./pages/Game";
import { Layout } from "./components/Layout";

function App() {
  return (
    <NextUIProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/newgame" element={<CreateGame />} />
            <Route path="/games/:gameId" element={<Game />} />
          </Route>
          <Route element={<AlreadyAuth />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>
      </Routes>
    </NextUIProvider>
  );
}

export default App;
