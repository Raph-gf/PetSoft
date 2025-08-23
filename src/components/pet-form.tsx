"use client";

import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { usePetContext } from "@/context/pet-context-provider";

type TActionType = {
  actionType: string;
  onFormSubmission: () => void;
};

export default function PetForm({ actionType, onFormSubmission }: TActionType) {
  const { handleAddPet } = usePetContext();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newPet = {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: Number(formData.get("age") as string),
      notes: formData.get("notes") as string,
    };

    console.log(newPet);

    handleAddPet(newPet);
    onFormSubmission();
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="space-y-3 mt-3 ">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerName">Onwer Name</Label>
          <Input id="owneName" name="ownerName" type="text" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image</Label>
          <Input id="imageUrl" name="imageUrl" type="text" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" name="notes" rows={3} required />
        </div>
      </div>

      <Button type="submit" className="mt-5 self-end">
        {actionType === "add" ? "Add a new pet" : "Edit"}
      </Button>
    </form>
  );
}
