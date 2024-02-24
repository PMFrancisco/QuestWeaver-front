import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { NavBar } from "./components/NavBar";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { RequireAuth, AlreadyAuth } from "./components/ProtectedRoute";
import { Profile } from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<AlreadyAuth />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
