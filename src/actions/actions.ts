"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { Pet } from "../../generated/prisma";
import { PetEssentials } from "@/lib/types";

export async function addPet(pet: PetEssentials) {
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

export async function editPet(petId: Pet["id"], newPetData: PetEssentials) {
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

export async function deletePet(petId: Pet["id"]) {
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
