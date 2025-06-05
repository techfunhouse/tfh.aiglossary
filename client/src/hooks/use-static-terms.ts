import { useQuery } from "@tanstack/react-query";
import { Category, Term } from "@shared/schema";

export function useTermsStatic(category?: string, search?: string) {
  return useQuery({
    queryKey: ["terms", category, search],
    queryFn: async () => {
      try {
        const response = await fetch("/data/terms.json");
        if (!response.ok) throw new Error("Failed to fetch terms");
        const allTerms: Term[] = await response.json();
        
        let filteredTerms = allTerms;
        
        // Filter by category
        if (category && category !== "All" && category !== "all") {
          filteredTerms = filteredTerms.filter(term => 
            term.category.toLowerCase() === category.toLowerCase()
          );
        }
        
        // Filter by search
        if (search) {
          const searchLower = search.toLowerCase();
          filteredTerms = filteredTerms.filter(term =>
            term.term.toLowerCase().includes(searchLower) ||
            term.definition.toLowerCase().includes(searchLower) ||
            term.aliases?.some(alias => alias.toLowerCase().includes(searchLower)) ||
            term.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        // Sort terms alphabetically to match navigation logic
        return filteredTerms.sort((a, b) => a.term.localeCompare(b.term));
      } catch (error) {
        console.error("Failed to load static terms:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoriesStatic() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await fetch("/data/categories.json");
        if (!response.ok) throw new Error("Failed to fetch categories");
        return response.json();
      } catch (error) {
        console.error("Failed to load static categories:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTermStatic(id: number) {
  return useQuery({
    queryKey: ["term", id],
    queryFn: async () => {
      try {
        const response = await fetch("/data/terms.json");
        if (!response.ok) throw new Error("Failed to fetch terms");
        const allTerms: Term[] = await response.json();
        return allTerms.find(term => term.id === id) || null;
      } catch (error) {
        console.error("Failed to load static term:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}