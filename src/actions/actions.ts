"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import { checkAuth, getPetByPetId } from "@/lib/server-utils";
import { Prisma } from "../../generated/prisma";

// user action

export async function loginAction(formData: FormData) {
  // check if formData is a FormData type

  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/app/dashboard",
  });
}

export async function signUpAction(formData: FormData) {
  const signUpUser = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  if (!signUpUser.email || !signUpUser.password) {
    throw new Error("Email and password are required");
  }

  const validatedSignUpUser = authSchema.safeParse(signUpUser);
  if (!validatedSignUpUser.success) {
    return {
      message: "Invalid form data",
    };
  }
  const { email, password } = validatedSignUpUser.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  // Création user
  try {
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists",
        };
      }
    }
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

  const session = await checkAuth();

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

  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedPet = petFormSchema.safeParse(newPetData);

  if (!validatedPetId.success || !validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }

  const pet = await getPetByPetId(validatedPetId.data);

  if (!pet) {
    return { message: "Pet not found" };
  }
  if (pet.userId !== session?.user?.id) {
    return { message: "Not authorized" };
  }
  try {
    await prisma.pet.update({
      where: { id: validatedPetId.data },
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
  const session = await checkAuth();

  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }

  const pet = await getPetByPetId(validatedPetId.data);
  if (!pet) {
    return { message: "Pet not found" };
  }

  if (pet.userId !== session?.user?.id) return { message: "Not authorized" };

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("private-app/app", "layout");
}
