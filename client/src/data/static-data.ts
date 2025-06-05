import { Category, Term } from "@shared/schema";
import categoriesData from "./categories.json";
import termsData from "./terms.json";

// Load categories with proper typing and ID assignment
export const STATIC_CATEGORIES: Category[] = categoriesData.map((cat, index) => ({
  id: index + 1,
  name: cat.name,
  description: cat.description
}));

// Load terms with proper typing and ID assignment
export const STATIC_TERMS: Term[] = termsData.map((term, index) => ({
  id: index + 1,
  term: term.term,
  category: term.category,
  definition: term.definition,
  aliases: term.aliases || [],
  related: term.related || [],
  tags: term.tags || [],
  references: term.references || []
}));