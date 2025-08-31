"use client";

import { logOutAction } from "@/actions/actions";
import { Button } from "./ui/button";

export default function SignOutBtn() {
  return <Button onClick={async () => await logOutAction()}>Sign out</Button>;
}
