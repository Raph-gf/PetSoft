"use server";

import prisma from "@/lib/db";
import { TPet } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(pet: Omit<TPet, "id">) {
  await sleep(1000);

  try {
    await prisma.pet.create({
      data: pet,
    });

    revalidatePath("private-app/app", "layout");
  } catch (error) {
    return { message: "Could not add pet" };
  }
}

export async function editPet(petId: string, newPetData: Omit<TPet, "id">) {
  await sleep(1000);
  try {
    await prisma.pet.update({
      where: { id: petId },
      data: newPetData,
    });
    revalidatePath("private-app/app", "layout");
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }
}

export async function deletePet(petId: string) {
  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("private-app/app", "layout");
}
