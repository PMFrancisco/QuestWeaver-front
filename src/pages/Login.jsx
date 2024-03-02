import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { Input, Button } from "@nextui-org/react";

export default function Login() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: "login",
    mutationFn: async ({ email, password }) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Error logging in user:", error);
    },
  });

  const onSubmit = (data) => {
    loginMutate(data);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
          <Button
            type="submit"
            value="Login"
            isLoading={isPending}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Login
          </Button>
        </form>
        <Button
          onClick={googleLogin}
          disabled={isPending}
          fullWidth
          color="secondary"
          size="lg"
          className="shadow-lg mt-6"
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
}
