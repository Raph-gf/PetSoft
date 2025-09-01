"use client";

import { loginAction, signUpAction } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import AuthFormBtn from "./auth-form-btn";
import { useActionState } from "react";
import { AuthActionResult } from "@/lib/types";

type AuthFormProps = {
  type: "login" | "signin";
};

export default function AuthForm({ type }: AuthFormProps) {
  const [signUpErrorState, dispatchSignUp] = useActionState<
    AuthActionResult | null,
    FormData
  >(type === "login" ? loginAction : signUpAction, null);

  const [loginUpErrorState, dispatchLogin] = useActionState<
    AuthActionResult | null,
    FormData
  >(type === "login" ? loginAction : signUpAction, null);

  return (
    <div className="w-[300px] h-[260px] px-6 py-8 border-[0.3px] rounded-sm shadow-lg ring">
      <form
        action={type === "login" ? dispatchLogin : dispatchSignUp}
        className="space-y-4 w-full h-full"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            maxLength={100}
          />
        </div>

        <div className="mb-4 space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            maxLength={100}
          />
        </div>
        <AuthFormBtn type={type} />
        {signUpErrorState && (
          <p className="text-red-500 text-sm mt-7">
            {signUpErrorState.message}
          </p>
        )}
        {loginUpErrorState && (
          <p className="text-red-500 text-sm mt-7">
            {loginUpErrorState.message}
          </p>
        )}
      </form>
    </div>
  );
}
