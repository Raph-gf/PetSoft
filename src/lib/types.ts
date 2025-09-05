import { Pet } from "../../generated/prisma";

// export type TPet = {
//   id: string;
//   age: number;
//   imageUrl: string;
//   notes: string;
//   name: string;
//   ownerName: string;
// };

// Prisma type

export type PetEssentials = Omit<
  Pet,
  "id" | "createdAt" | "updatedAt" | "userId"
>;

export type AuthActionResult = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
  };
  redirectTo?: string;
};
