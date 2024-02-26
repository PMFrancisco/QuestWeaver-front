import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { createProfile } from '../service/profile';

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const googleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, provider);

      const profileInfo = {
        firebaseUserID: user.uid,
        displayName: user.displayName,
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1] || "",
        profileImage: user.photoURL,
      };

      await createProfile(profileInfo);
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return googleLogin;
};

