import z from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export type PetFormValues = z.infer<typeof petFormSchema>;

export const petIdSchema = z.cuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(10),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(100),
    imageUrl: z.union([
      z.literal(""),
      z.url({ message: "Image url is not valid" }).trim(),
    ]),
    age: z
      .number()
      .int()
      .min(1, { message: "Age must be at least 1" })
      .max(99, {
        message: "Age must be between 1 and 99",
      }),
    notes: z.union([z.literal(""), z.string().trim().max(1000)]),
  })
  .transform(data => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));
