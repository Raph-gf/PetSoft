"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { auth, signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

// user action

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/app/dashboard",
  });
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Création user
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });

  if (!user) {
    throw new Error("User could not be created");
  }

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/app/dashboard",
  });
}

export async function logOutAction() {
  await signOut({ redirectTo: "/" });
}

// pet action

export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    revalidatePath("private-app/app", "layout");
  } catch (error) {
    console.log(error);
    return { message: "Could not add pet" };
  }
}

export async function editPet(petId: unknown, newPetData: unknown) {
  await sleep(1000);

  const validatedId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);
  if (!validatedPet.success || !validatedId.success) {
    return {
      message: "Invalid pet data",
    };
  }
  try {
    await prisma.pet.update({
      where: { id: validatedId.data },
      data: validatedPet.data,
    });
    revalidatePath("private-app/app", "layout");
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }
}

export async function deletePet(petId: unknown) {
  const validatedId = petIdSchema.safeParse(petId);

  if (!validatedId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("private-app/app", "layout");
}
