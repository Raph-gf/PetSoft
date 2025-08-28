"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { TPet } from "@/lib/types";
import {
  createContext,
  startTransition,
  useContext,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";

type PetContextType = {
  pets: TPet[];
  setPets?: React.Dispatch<React.SetStateAction<TPet[]>>;
  selectedPetId: string | null;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<string | null>>;
  selectedPet: TPet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: string) => void;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<TPet, "id">) => Promise<void>;
  handleEditPet: (petId: string, newPetData: Omit<TPet, "id">) => Promise<void>;
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
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map(pet => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return state.filter(pet => pet.id !== payload);
        default:
          return state;
      }
    }
  );

  // derived states
  const selectedPet = optimisticPets.find(pet => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  // event handlers
  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = async (id: string) => {
    startTransition(() => {
      setOptimisticPets({ action: "delete", payload: id });
    });

    const error = await deletePet(id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Pet deleted successfully");
    }
    setSelectedPetId(null);
  };

  const handleAddPet = async (newPet: Omit<TPet, "id">) => {
    startTransition(() => {
      setOptimisticPets({ action: "add", payload: newPet });
    });

    const error = await addPet(newPet);

    if (error) {
      toast.warning(error.message);
      return;
    } else {
      toast.success("Pet added successfully");
    }
  };

  const handleEditPet = async (petId: string, newPetData: Omit<TPet, "id">) => {
    startTransition(() => {
      setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } });
    });

    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
      return;
    }
    toast.success("Pet edited successfully");
  };

  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        setSelectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleAddPet,
        handleEditPet,
        handleCheckoutPet,
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
