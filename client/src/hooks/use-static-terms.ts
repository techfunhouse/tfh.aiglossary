import { useQuery } from "@tanstack/react-query";
import { Category, Term } from "@shared/schema";
import { STATIC_CATEGORIES, STATIC_TERMS } from "@/data/static-data";

const isStaticMode = import.meta.env.PROD && !import.meta.env.VITE_API_URL;

export function useTermsStatic(category?: string, search?: string) {
  return useQuery({
    queryKey: ["terms", category, search],
    queryFn: async () => {
      if (isStaticMode) {
        let filtered = [...STATIC_TERMS];
        
        if (category && category !== "All") {
          filtered = filtered.filter(term => term.category === category);
        }
        
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter(term => 
            term.term.toLowerCase().includes(searchLower) ||
            term.definition.toLowerCase().includes(searchLower) ||
            term.aliases?.some(alias => alias.toLowerCase().includes(searchLower)) ||
            term.tags?.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        
        return filtered;
      }
      
      // Development mode - use API
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (search) params.set("search", search);
      
      const response = await fetch(`/api/terms?${params}`);
      if (!response.ok) throw new Error("Failed to fetch terms");
      return response.json();
    },
    staleTime: isStaticMode ? Infinity : 1000 * 60 * 5,
  });
}

export function useCategoriesStatic() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      if (isStaticMode) {
        return STATIC_CATEGORIES;
      }
      
      // Development mode - use API
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
    staleTime: isStaticMode ? Infinity : 1000 * 60 * 5,
  });
}

export function useTermStatic(id: number) {
  return useQuery({
    queryKey: ["term", id],
    queryFn: async () => {
      if (isStaticMode) {
        return STATIC_TERMS.find(term => term.id === id) || null;
      }
      
      // Development mode - use API
      const response = await fetch(`/api/terms/${id}`);
      if (!response.ok) throw new Error("Failed to fetch term");
      return response.json();
    },
    staleTime: isStaticMode ? Infinity : 1000 * 60 * 5,
  });
}