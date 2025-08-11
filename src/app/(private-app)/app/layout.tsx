import AppFooter from "@/components/app-footer";
import AppHeader from "@/components/app-header";
import BackgroundPattern from "@/components/background-pattern";
import PetContextProvider from "@/context/pet-context-provider";
import { TPet } from "@/lib/types";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch(
    "https://bytegrad.com/course-assets/projects/projects/petsoft/api/pets"
  );
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data: TPet[] = await res.json();

  return (
    <>
      <BackgroundPattern />
      <div className=" flex flex-col max-w-[1050px] mx-auto px-4 min-h-screen">
        <AppHeader />
        <PetContextProvider data={data}>{children}</PetContextProvider>
        <AppFooter />
      </div>
    </>
  );
}
