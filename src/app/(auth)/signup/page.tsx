import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main>
      <H1 className="text-center mb-5">Sign Up</H1>

      <AuthForm>Sign up</AuthForm>

      <p className="mt-6 text-sm text-zinc-500 text-center">
        <span className="mr-1.5">Already have a account?</span>
        <Link href="/login" className="font-medium">
          Log in
        </Link>
      </p>
    </main>
  );
}
