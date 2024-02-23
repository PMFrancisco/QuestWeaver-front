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
export const NavBar = () => {
  return (
    <>
      <Navbar position="static" className="bg-blue-600 shadow-lg text-white">
        <NavbarBrand>
          <Image
            src="https://res.cloudinary.com/du8nkdwcp/image/upload/c_thumb,w_200,g_face/v1708712757/logo_transparent_background_cpktqd.png"
            alt="Logo"
            width={100} // Adjust the width as needed
            height={100} // Adjust the height to maintain aspect ratio
          />
          <Link to="/">Quest Weaver</Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to="/profile">Profile</Link>
          </NavbarItem>

        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to="/signup">Sign up</Link>
          </NavbarItem>
          <NavbarItem>
            <Link to="/login">Log in</Link>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Outlet />
    </>
  );
};
