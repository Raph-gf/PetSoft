"use client";

import { addPet } from "@/actions/actions";
import { TPet } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type PetContextType = {
  pets: TPet[];
  setPets?: React.Dispatch<React.SetStateAction<TPet[]>>;
  selectedPetId: string | null;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPet: TPet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
  // handleCheckoutPet: (id: string) => void;
  // handleAddPet: (newPet: Omit<TPet, "id">) => void;
  // handleEditPet: (petId: string, newPetData: Omit<TPet, "id">) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  children,
  data: pets,
}: {
  children: React.ReactNode;
  data: TPet[];
}) {
  // states
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived states
  const selectedPet = pets.find(pet => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  // const handleCheckoutPet = (id: string) => {
  //   setPets(prev => prev.filter(pet => pet.id !== id));
  //   setSelectedPetId(null);
  // };

  // const handleAddPet = async (newPet: Omit<TPet, "id">) => {
  //   // adding pet on the client
  //   // setPets(prev => [...prev, { ...newPet, id: String(Date.now()) }]);

  //   // adding pet on the database with prisma and server actions
  //   await addPet(newPet);
  // };

  // const handleEditPet = (petId: string, newPetData: Omit<TPet, "id">) => {
  //   setPets(prev =>
  //     prev.map(pet => {
  //       if (pet.id === petId) {
  //         return {
  //           id: petId,
  //           ...newPetData,
  //         };
  //       }
  //       return pet;
  //     })
  //   );
  // };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        setSelectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context || context === undefined) {
    throw new Error("usePetContext must be used within a PetContextProvider");
  }
  return context;
};
