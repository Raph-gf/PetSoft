"use client";

import { TPet } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type PetContextType = {
  pets: TPet[];
  setPets?: React.Dispatch<React.SetStateAction<TPet[]>>;
  selectedPetId: number | null;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<number | null>>;
  handleChangeSelectedPetId: (id: number) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: TPet[];
}) {
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  console.log(selectedPetId);

  const handleChangeSelectedPetId = (id: number) => {
    setSelectedPetId(id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        setPets,
        selectedPetId,
        setSelectedPetId,
        handleChangeSelectedPetId,
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
