import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <H1 className="font-medium text-2xl leading-6 my-8">Your Account</H1>

      <ContentBlock className="h-[500px] flex flex-col gap-3 justify-center items-center">
        <p>Logged in as {session?.user?.email}</p>
        <Button onClick={}>Sign out</Button>
      </ContentBlock>
    </main>
  );
}
