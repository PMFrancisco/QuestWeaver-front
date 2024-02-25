import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Input } from "@nextui-org/input";
import { createUser } from "../service/user";


export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for signing up
  const { mutate: signupMutation, isLoading } = useMutation({
    mutationKey: "signup",
    mutationFn: async (formData) => {
      const { email, password, firstName, lastName, displayName } = formData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Assuming createUser function sends data to your backend
      await createUser({
        firebaseUserID: user.uid,
        email: user.email, // Firebase Auth provides this
        firstName,
        lastName,
        displayName: displayName || `${firstName} ${lastName}`,
        profileImage: "", // Default or allow users to set this in an extended form
      });

      return user;
    },
    onSuccess: () => {
      navigate("/"); // Adjust as necessary
    },
    onError: (error) => {
      console.error("Signup error:", error);
      // Handle errors, e.g., show an error message
    },
  });

  const onSubmit = async (data) => {
    signupMutation(data);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Sign Up
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="string"
              label="User name"
              labelPlacement="inside"
              variant="faded"
              classNames={{
                label: "text-sm font-medium text-black",
                inputWrapper: ["shadow-lg", "border-gray-300"],
              }}
              {...register("displayName", { required: true })}
            />
            {errors.displayName && (
              <span className="text-xs text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div>
            <Input
              type="string"
              label="First name"
              labelPlacement="inside"
              variant="faded"
              classNames={{
                label: "text-sm font-medium text-black",
                inputWrapper: ["shadow-lg", "border-gray-300"],
              }}
              {...register("firstName", { required: true })}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div>
            <Input
              type="string"
              label="Last name"
              labelPlacement="inside"
              variant="faded"
              classNames={{
                label: "text-sm font-medium text-black",
                inputWrapper: ["shadow-lg", "border-gray-300"],
              }}
              {...register("lastName", { required: true })}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div>
            <Input
              type="email"
              label="Email"
              labelPlacement="inside"
              variant="faded"
              classNames={{
                label: "text-sm font-medium text-black",
                inputWrapper: ["shadow-lg", "border-gray-300"],
              }}
              {...register("email", { required: true })}
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div>
            <Input
              type="password"
              label="Password"
              labelPlacement="inside"
              variant="faded"
              classNames={{
                label: "text-sm font-medium text-black",
                inputWrapper: ["shadow-lg", "border-gray-300"],
              }}
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                This field is required
              </span>
            )}
          </div>
          <button
            className="btn-primary"
            type="submit"
            disabled={signupMutation.isLoading}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
