"use client";

import React from "react";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { PetEssentials } from "@/lib/types";
import { usePetContext } from "@/context/pet-context-provider";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PetFormBtn from "./pet-form-btn";
import { useForm } from "react-hook-form";

type TActionType = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

// 👇 type dérivé automatiquement
type PetFormValues = z.infer<typeof petFormSchema>;

const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: "Owner name is required" })
    .max(100),
  imageUrl: z.union([
    z.literal(""),
    z.url({ message: "Image url is not valid" }).trim(),
  ]),
  age: z.number().int().min(1, { message: "Age must be at least 1" }).max(99, {
    message: "Age must be between 1 and 99",
  }),
  notes: z.union([z.literal(""), z.string().trim().max(1000)]),
});

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
    formState: { errors },
  } = useForm<PetFormValues>({ resolver: zodResolver(petFormSchema) });

  return (
    <form
      className="flex flex-col"
      action={async formData => {
        const result = await trigger();
        if (!result) return;

        onFormSubmission();

        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) ||
            "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=100&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          age: parseInt(formData.get("age") as string),
          notes: formData.get("notes") as string,
        };
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
