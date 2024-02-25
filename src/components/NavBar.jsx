import { Link, Outlet } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Image } from "@nextui-org/image";
import { useAuth } from "../context/AuthProvider";
import { handleSignOut } from "../service/authService";


export const NavBar = () => {
  const auth = useAuth();

  return (
    <>
      <Navbar position="static" className="flex bg-blue-600 shadow-lg text-white">
        <NavbarBrand>
          <Image
            src="https://res.cloudinary.com/du8nkdwcp/image/upload/c_thumb,w_200,g_face/v1708712757/logo_transparent_background_cpktqd.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <Link to="/">Quest Weaver</Link>
        </NavbarBrand>
        <NavbarContent justify="flex-end">
          {auth.currentUser ? (
            <>
              <NavbarItem>
                <Link to="/profile">Profile</Link>
              </NavbarItem>
              <NavbarItem>
                <button onClick={() => handleSignOut()}>Logout</button>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Link to="/login">Log in</Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/signup">Sign up</Link>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
      <Outlet />
    </>
  );
};
