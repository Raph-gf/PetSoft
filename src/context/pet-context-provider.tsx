"use client";

import { TPet } from "@/lib/types";
import { createContext, useContext, useState } from "react";

type PetContextType = {
  pets: TPet[];
  setPets?: React.Dispatch<React.SetStateAction<TPet[]>>;
  selectedPetId: number | null;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<number | null>>;
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

  return (
    <PetContext.Provider
      value={{
        pets,
        setPets,
        selectedPetId,
        setSelectedPetId,
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
