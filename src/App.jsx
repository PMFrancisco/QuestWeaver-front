import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { RequireAuth, AlreadyAuth } from "./components/ProtectedRoute";
import { NextUIProvider } from "@nextui-org/react";
import { HomePage } from "./pages/HomePage";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { GameList } from "./pages/GameList";
import { CreateGame } from "./pages/CreateGame";
import { Game } from "./pages/Game";
import { Layout } from "./components/Layouts/Layout";
import { WikiMain } from "./pages/wiki/WikiMain";
import { WikiLayout } from "./components/Layouts/WikiLayout";
import { WikiPage } from "./pages/wiki/WikiPage";
import { WikiPageForm } from "./pages/wiki/WikiPageForm";

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
            <Route element={<WikiLayout />}>
              <Route path="/games/:gameId/wiki" element={<WikiMain />} />
              <Route path="/games/:gameId/wiki/new" element={<WikiPageForm />} />
              <Route path="/games/:gameId/wiki/:gameInfoId" element={<WikiPage />} />
              <Route path="/games/:gameId/wiki/:gameInfoId/edit" element={<WikiPageForm />} />
            </Route>
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
