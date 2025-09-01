"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

function AuthFormBtn({ type }: { type: "login" | "signin" }) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className="w-full my-3">
      {type === "login" ? "Log in" : "Sign up"}
    </Button>
  );
}

export default AuthFormBtn;
