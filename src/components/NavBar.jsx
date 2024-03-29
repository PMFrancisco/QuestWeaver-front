import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/react";
import { useAuth } from "../context/AuthProvider";
import { handleSignOut } from "../service/authService";

export const NavBar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  return (
    <Navbar position="static" className="flex bg-blue-600 shadow-lg text-white">
      <NavbarContent>
        <NavbarBrand>
          <Image
            src="https://res.cloudinary.com/du8nkdwcp/image/upload/v1708712757/QuestWeaver/logo_transparent_background_cpktqd.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <Link to="/">Quest Weaver</Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="flex">
        {auth.currentUser ? (
          <>
            <NavbarItem>
              <Link to="/games">Games</Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/profile">Profile</Link>
            </NavbarItem>
            <NavbarItem>
              <button onClick={() => handleSignOut(navigate)}>Logout</button>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link to="/login">Login</Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/signup">Sign up</Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};
