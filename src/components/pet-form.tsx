import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type TActionType = {
  actionType: string;
};

export default function PetForm({ actionType }: TActionType) {
  return (
    <form className="flex flex-col">
      <div className="space-y-3 mt-3 ">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="owner">Onwer Name</Label>
          <Input id="owner" type="text" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image</Label>
          <Input id="imageUrl" type="text" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="text" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} />
        </div>
      </div>

      <Button type="submit" className="mt-5 self-end">
        {actionType === "add" ? "Submit" : "Edit"}
      </Button>
    </form>
  );
}
