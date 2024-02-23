import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Define the mutation for signing up
  const { mutate: signupMutation } = useMutation({
    mutationKey: "signup",
    mutationFn: async ({ email, password }) => {
      return await createUserWithEmailAndPassword(auth, email, password);
    },
  });

  const onSubmit = async (data) => {
    signupMutation(data);
  };

  return (
<div className="flex justify-center items-center h-screen bg-gray-100">
  <div className="p-8 bg-white shadow-md rounded-lg max-w-md w-full">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          autoComplete="username"
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          {...register("email", { required: true })}
        />
        {errors.email && <span className="text-xs text-red-500">This field is required</span>}
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          autoComplete="new-password"
          {...register("password", { required: true })}
        />
        {errors.password && <span className="text-xs text-red-500">This field is required</span>}
      </div>
      <button
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
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