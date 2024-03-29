import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { createProfile } from "../service/profile";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { Button, Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { getStatus } from "../service/status";

export default function SignUp() {
  const navigate = useNavigate();
  const googleLogin = useGoogleLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, isFetching } = useQuery({
    queryKey: ["status"],
    queryFn: () => getStatus(),
  });

  const { mutate: signupMutation, isPending } = useMutation({
    mutationKey: "signup",
    mutationFn: async (formData) => {
      const { email, password, firstName, lastName, displayName } = formData;
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await createProfile({
        firebaseUserID: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName,
      });

      return user;
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });

  const onSubmit = async (data) => {
    signupMutation(data);
  };

  if (isFetching) {
    return (
      <p>Try again in a minute</p>
    )
  }

  return (
    <div className="flexCardContainer">
      <div className="cardInside">
        <h1 className="cardHeader">Sign Up</h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="displayName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="Username"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.displayName}
                color={errors.displayName ? "danger" : "default"}
                errorMessage={errors.displayName && errors.displayName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />
          <Controller
            name="firstName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="First name"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.firstName}
                color={errors.firstName ? "danger" : "default"}
                errorMessage={errors.firstName && errors.firstName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            rules={{ required: "This field is required" }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                label="Last name"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.lastName}
                color={errors.lastName ? "danger" : "default"}
                errorMessage={errors.lastName && errors.lastName.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: "This field is required",
              pattern: /^\S+@\S+$/i,
            }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                type="email"
                label="Email"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.email}
                color={errors.email ? "danger" : "default"}
                errorMessage={errors.email && "This field is required"}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            }}
            render={({ field: { onChange } }) => (
              <Input
                onChange={onChange}
                type="password"
                label="Password"
                labelPlacement="inside"
                variant="faded"
                isInvalid={!!errors.password}
                color={errors.password ? "danger" : "default"}
                errorMessage={errors.password && errors.password.message}
                classNames={{
                  label: "text-sm font-medium text-black",
                  inputWrapper: ["shadow-lg", "border-gray-300"],
                }}
              />
            )}
          />

          <Button
            type="submit"
            value="Login"
            isLoading={isPending}
            fullWidth
            color="primary"
            size="lg"
            className="shadow-lg"
          >
            Sign up
          </Button>
        </form>
        <Button
          onClick={googleLogin}
          isLoading={isPending}
          fullWidth
          color="secondary"
          size="lg"
          className="shadow-lg mt-6"
        >
          <FontAwesomeIcon icon={faGoogle} />
          Sign up with Google
        </Button>
      </div>
    </div>
  );
}
