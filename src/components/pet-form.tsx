"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePetContext } from "@/context/pet-context-provider";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";
import { DEFAULT_PET_IMAGE } from "@/lib/constants";
import { PetFormValues, petFormSchema } from "@/lib/validations";

type TActionType = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({ actionType, onFormSubmission }: TActionType) {
  const { selectedPet, handleAddPet, handleEditPet } = usePetContext();
  // const [error,formAction] = useFormState(addPet,{})
  // adding a new pet or editing a pet on the client side via the handleSubmit function
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);

  //   const pet = {
  //     name: formData.get("name") as string,
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl:
  //       (formData.get("imageUrl") as string) ||
  //       "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=100&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     age: Number(formData.get("age") as string),
  //     notes: formData.get("notes") as string,
  //   };

  //   if (actionType === "add") {
  //     handleAddPet(pet);
  //   } else if (actionType === "edit") {
  //     handleEditPet(selectedPet?.id as string, pet);
  //   }
  //   onFormSubmission();
  // };

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues:
      actionType === "edit" && selectedPet
        ? {
            name: selectedPet.name,
            ownerName: selectedPet.ownerName,
            imageUrl: selectedPet.imageUrl,
            age: selectedPet.age,
            notes: selectedPet.notes || "",
          }
        : undefined,
  });

  return (
    <form
      className="flex flex-col"
      action={async formData => {
        const result = await trigger();
        if (!result) return;

        // to close the form
        onFormSubmission();
        // const petData = {
        //   name: formData.get("name") as string,
        //   ownerName: formData.get("ownerName") as string,
        //   imageUrl:
        //     (formData.get("imageUrl") as string) ||
        //     "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=100&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        //   age: parseInt(formData.get("age") as string),
        //   notes: formData.get("notes") as string,
        // };

        const petData = getValues();
        petData.imageUrl = petData.imageUrl || DEFAULT_PET_IMAGE;

        if (actionType === "add") {
          await handleAddPet(petData);
        } else if (actionType === "edit") {
          await handleEditPet(selectedPet!.id, petData);
        }
      }}
    >
      <div className="space-y-3 mt-3 ">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Onwer Name</Label>
          <Input id="ownerName" {...register("ownerName")} />
          {errors.ownerName && (
            <p className="text-sm text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min={0}
            {...register("age", { valueAsNumber: true })}
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" {...register("notes")} />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>
      <PetFormBtn actionType={actionType} />
    </form>
  );
}
