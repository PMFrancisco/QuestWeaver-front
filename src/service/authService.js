import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(); 

export const handleSignOut = () => {
  signOut(auth).then(() => {
    console.log("Sign-out successful");
    // Aquí puedes redirigir al usuario a la página de inicio de sesión o manejarlo como desees
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
};
