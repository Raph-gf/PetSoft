"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { signIn, signOut } from "@/lib/auth";
import { checkAuth, getPetByPetId } from "@/lib/server-utils";
import { Prisma } from "../../generated/prisma";
import { AuthActionResult } from "@/lib/types";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// user action
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/app/dashboard",
      callbackUrl: "/app/dashboard",
    });

    return {
      success: true,
      message: "Logged in successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials",
            success: false,
          };
        }
        default: {
          return {
            message: "Could not sign in.",
            success: false,
          };
        }
      }
    }

    throw error; // nextjs redirect throws a error, so we need to rethrow it
  }
}
export async function signUpAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
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
      success: false,
      message: "Email and password are required",
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
    console.log(user);

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/payment",
    });

    return { success: true, message: "Account created successfully!" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          success: false,
          message: "Email already exists",
        };
      }
    }
    throw error;
  }
}
export async function logOutAction() {
  await signOut({ redirectTo: "/" });
}

// pet action
export async function addPet(pet: unknown) {
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
    console.log(error);
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
    console.log(error);
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("private-app/app", "layout");
}

// --- payement actions ---

export async function createCheckoutSession() {
  // authentication check
  const session = await checkAuth();

  // redirect user to checkout Page
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.APP_URL}/payment?success=true`,
    cancel_url: `${process.env.APP_URL}/payment?cancelled=true`,
  });

  // redirect user
  if (!checkoutSession.url) {
    throw new Error("Stripe checkout session URL is missing");
  }
  redirect(checkoutSession.url);
}
