import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";

import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPetsByUserId } from "@/lib/server-utils";

export default async function PrivateAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const pets = await getPetsByUserId(session.user.id);

  if (!pets) {
    // Handle the case where pets is undefined
    return null;
  }

  return (
    <>
      <BackgroundPattern />
      <div className=" flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />

        <SearchContextProvider>
          <PetContextProvider data={pets}>{children}</PetContextProvider>
        </SearchContextProvider>

        <AppFooter />
      </div>

      <Toaster position="top-right" />
    </>
  );
}
