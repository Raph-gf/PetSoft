"use client";

import { usePetContext } from "@/context/pet-context-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "../../public/logo.svg";
import { useSearchContext } from "@/context/search-context-provider";

export default function PetList() {
  const { pets, selectedPetId, handleChangeSelectedPetId } = usePetContext();
  const { searchQuery } = useSearchContext();

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ul className="bg-white border-b border-light">
      {filteredPets.map(pet => (
        <li key={pet.id}>
          <button
            onClick={() => handleChangeSelectedPetId(pet.id)}
            className={cn(
              "flex items-center px-5 text-base h-[70px] w-full cursor-pointer gap-3 hover:bg-[#EFF1F32] focus:bg-[#EFF1F2] transition",
              {
                " bg-[#EFF1F2]": selectedPetId === pet.id,
              }
            )}
          >
            <Image
              src={pet.imageUrl ?? logo}
              alt="Pet image"
              width={45}
              height={45}
              className="rounded-full object-cover h-[45px] w-[45px]"
            />
            <p className="font-semibold">{pet.name}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
