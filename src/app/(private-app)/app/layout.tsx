import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import SearchContextProvider from "@/context/search-context-provider";
import prisma from "@/lib/db";
import { Toaster } from "sonner";

export default async function PrivateAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pets = await prisma.pet.findMany();
  // const user = await prisma.user.findUnique({
  //   where
  // })

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
