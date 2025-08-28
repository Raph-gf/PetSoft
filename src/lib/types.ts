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

export type PetEssentials = Omit<Pet, "id" | "createdAt" | "updatedAt">;
