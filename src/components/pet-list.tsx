import Image from "next/image";

export default function PetList() {
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      <li>
        <button className="flex items-center px-5 text-base h-[70px] w-full cursor-pointer gap-3 hover:bg-[#EFF1F32] focus:bg-[#EFF1F2] transition">
          <Image
            src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            alt="Pet image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
      <li>
        <button className="flex items-center px-5 text-base h-[70px] w-full cursor-pointer gap-3 hover:bg-[#EFF1F32] focus:bg-[#EFF1F2] transition">
          <Image
            src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            alt="Pet image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p className="font-semibold">Benjamin</p>
        </button>
      </li>
    </ul>
  );
}
