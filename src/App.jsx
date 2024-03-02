import { Routes, Route } from "react-router-dom";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { RequireAuth, AlreadyAuth } from "./components/ProtectedRoute";
import { NextUIProvider } from "@nextui-org/react";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import { Games } from "./pages/Games";
import { CreateGame } from "./pages/CreateGame";

function App() {
  return (
    <NextUIProvider>
      <Routes>
        <Route element={<NavBar />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/games" element={<Games />} />
            <Route path="/newgame" element={<CreateGame />} />

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
