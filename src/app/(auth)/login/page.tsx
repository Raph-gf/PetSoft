import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main>
      <H1 className="text-center mb-5">Log in</H1>
      <AuthForm type="login" />
      <p className="mt-6 text-sm text-zinc-500 text-center">
        <span className="mr-1.5"> No account yet?</span>
        <Link href="/signup" className="font-medium">
          Sign up
        </Link>
        `
      </p>
    </main>
  );
}
