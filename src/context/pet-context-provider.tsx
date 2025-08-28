"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";

import {
  createContext,
  startTransition,
  useContext,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";
import { Pet } from "../../generated/prisma";

type PetContextType = {
  pets: Pet[];
  setPets?: React.Dispatch<React.SetStateAction<PetEssentials[]>>;
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  setSelectedPetId?: React.Dispatch<React.SetStateAction<string | null>>;
  numberOfPets: number;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
  handleCheckoutPet: (id: Pet["id"]) => void;
};

export const PetContext = createContext<PetContextType | null>(null);

export default function PetContextProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: Pet[];
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
  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };

  const handleCheckoutPet = async (id: Pet["id"]) => {
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

  const handleAddPet = async (newPet: PetEssentials) => {
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

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
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
