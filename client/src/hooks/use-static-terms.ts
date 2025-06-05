import { useQuery } from "@tanstack/react-query";
import { Category, Term } from "@shared/schema";

export function useTermsStatic(category?: string, search?: string) {
  return useQuery({
    queryKey: ["terms", category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "All" && category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      
      const response = await fetch(`/api/terms?${params}`);
      if (!response.ok) throw new Error("Failed to fetch terms");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useCategoriesStatic() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useTermStatic(id: number) {
  return useQuery({
    queryKey: ["term", id],
    queryFn: async () => {
      const response = await fetch(`/api/terms/${id}`);
      if (!response.ok) throw new Error("Failed to fetch term");
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}