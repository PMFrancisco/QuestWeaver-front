import { getAuth, signOut } from "firebase/auth";

export const handleSignOut = (navigate) => {
  const auth = getAuth();

  signOut(auth)
    .then(() => {
      console.log("Sign-out successful");
      navigate("/");
    })
    .catch((error) => {
      console.error("Error signing out: ", error);
    });
};
