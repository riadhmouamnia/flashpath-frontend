"use server";
import { db } from "@/server/db";
import { paths, users } from "@/server/db/schemas";
import { eq } from "drizzle-orm";

export const getAllUsers = async () => {
  return await db.select().from(users);
};
