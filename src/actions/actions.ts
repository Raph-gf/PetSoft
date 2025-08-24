"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(formData: FormData) {
  await sleep(2000);

  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      age: parseInt(formData.get("age") as string),
      imageUrl:
        (formData.get("imageUrl") as string) ||
        "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=100&w=1935&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      notes: formData.get("notes") as string,
    },
  });

  revalidatePath("private-app/app", "layout");
}
