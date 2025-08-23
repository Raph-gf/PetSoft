"use client";

import { TPet } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type PetContextType = {
  pets: TPet[];
  setPets?: React.Dispatch<React.SetStateAction<TPet[]>>;
  selectedPetId: number | null;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<number | null>>;
  selectedPet: TPet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: number) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<TPet, "id">) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: TPet[];
}) {
  // states
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  // derived states
  const selectedPet = pets.find(pet => Number(pet.id) === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers
  const handleChangeSelectedPetId = (id: number) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = (id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleAddPet = (newPet: Omit<TPet, "id">) => {
    setPets(prev => [...prev, { ...newPet, id: String(Date.now()) }]);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        setPets,
        selectedPetId,
        setSelectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
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
