import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
});

export const terms = pgTable("terms", {
  id: serial("id").primaryKey(),
  term: text("term").notNull(),
  category: text("category").notNull(),
  aliases: text("aliases").array(),
  definition: text("definition").notNull(),
  related: text("related").array(),
  tags: text("tags").array(),
  references: text("references").array(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
});

export const insertTermSchema = createInsertSchema(terms).pick({
  term: true,
  category: true,
  aliases: true,
  definition: true,
  related: true,
  tags: true,
  references: true,
});

export const updateTermSchema = insertTermSchema.partial().extend({
  id: z.number(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect & {
  icon?: string;
};

export type InsertTerm = z.infer<typeof insertTermSchema>;
export type UpdateTerm = z.infer<typeof updateTermSchema>;
export type Term = typeof terms.$inferSelect & {
  learningpaths?: { [key: string]: number } | null;
};

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
