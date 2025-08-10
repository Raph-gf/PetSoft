import { TPetList } from "@/lib/types";
import Image from "next/image";

type PetListProps = {
  pets: TPetList[];
};

export default async function PetList({ pets }: PetListProps) {
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {pets.map(pet => (
        <li key={pet.id}>
          <button className="flex items-center px-5 text-base h-[70px] w-full cursor-pointer gap-3 hover:bg-[#EFF1F32] focus:bg-[#EFF1F2] transition">
            <Image
              src={pet.imageUrl}
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
