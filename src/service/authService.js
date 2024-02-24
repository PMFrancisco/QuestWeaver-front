import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(); 

export const handleSignOut = () => {
  signOut(auth).then(() => {
    console.log("Sign-out successful");
    window.location.href = "/login"
    }).catch((error) => {
    console.error("Error signing out: ", error);
  });
};
