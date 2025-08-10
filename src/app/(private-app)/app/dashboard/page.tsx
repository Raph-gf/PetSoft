import Branding from "@/components/branding";
import ContentBlock from "@/components/content-block";
import PetDetails from "@/components/pet-details";
import PetList from "@/components/pet-list";
import SearchForm from "@/components/search-form";
import Stats from "@/components/stats";
import { TPet } from "@/lib/types";

export default async function DashboardPage() {
  const res = await fetch(
    "https://bytegrad.com/course-assets/projects/projects/petsoft/api/pets"
  );
  if (!res.ok) {
    alert(`HTTP error! status: ${res.status}`);
  }
  const data: TPet[] = await res.json();
  console.log(data);

  return (
    <main>
      <div className="flex items-center justify-between text-white py-8">
        <Branding />
        <Stats />
      </div>

      <div className="grid md:grid-cols-3 grid-rows-[45px_1fr] gap-4 md:h-[600px]">
        <div className="md:row-start-1 md:row-span-1 md:col-start-1 md:col-span-1">
          <SearchForm />
        </div>

        <div className="md:row-start-2 md:row-span-full md:col-start-1 md:col-span-1">
          <ContentBlock>
            <PetList pets={data} />
          </ContentBlock>
        </div>

        <div className="md:row-start-1 md:row-span-full md:col-start-2 md:col-span-full">
          <ContentBlock>
            <PetDetails />
          </ContentBlock>
        </div>
      </div>
    </main>
  );
}
