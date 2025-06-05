import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Term, CreateTermRequest, UpdateTermRequest, Category } from "@/types";

// Check if we're in a static environment (GitHub Pages)
const isStatic = typeof window !== 'undefined' && !window.location.origin.includes('localhost') && !window.location.origin.includes('replit');

export function useTerms(category?: string, search?: string) {
  const queryKey = ["/api/terms"];
  if (category && category !== "all") {
    queryKey.push("category", category);
  }
  if (search) {
    queryKey.push("search", search);
  }

  return useQuery<Term[]>({
    queryKey,
    queryFn: async () => {
      if (isStatic) {
        // Load from static JSON file for GitHub Pages
        const response = await fetch('/data/terms.json');
        const allTerms = await response.json();
        
        let filteredTerms = allTerms;
        
        if (category && category !== "all") {
          filteredTerms = filteredTerms.filter((term: Term) => term.category === category);
        }
        
        if (search) {
          const searchLower = search.toLowerCase();
          filteredTerms = filteredTerms.filter((term: Term) =>
            term.term.toLowerCase().includes(searchLower) ||
            term.definition.toLowerCase().includes(searchLower) ||
            term.category.toLowerCase().includes(searchLower) ||
            (term.aliases && term.aliases.some(alias => alias.toLowerCase().includes(searchLower))) ||
            (term.tags && term.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          );
        }
        
        return filteredTerms;
      } else {
        // Use API for local/Replit development
        const params = new URLSearchParams();
        if (category && category !== "all") {
          params.append("category", category);
        }
        if (search) {
          params.append("search", search);
        }
        
        const response = await fetch(`/api/terms?${params.toString()}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch terms");
        }
        
        return response.json();
      }
    },
  });
}

export function useTerm(id: number) {
  return useQuery<Term>({
    queryKey: ["/api/terms", id],
    queryFn: async () => {
      const response = await fetch(`/api/terms/${id}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch term");
      }
      
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      if (isStatic) {
        // Load from static JSON file for GitHub Pages
        const response = await fetch('/data/categories.json');
        return response.json();
      } else {
        // Use API for local/Replit development
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        return response.json();
      }
    },
  });
}

export function useCreateTerm() {
  const queryClient = useQueryClient();

  return useMutation<Term, Error, CreateTermRequest>({
    mutationFn: async (termData) => {
      const response = await apiRequest("POST", "/api/terms", termData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/terms"] });
    },
  });
}

export function useUpdateTerm() {
  const queryClient = useQueryClient();

  return useMutation<Term, Error, UpdateTermRequest>({
    mutationFn: async (termData) => {
      const response = await apiRequest("PUT", `/api/terms/${termData.id}`, termData);
      return response.json();
    },
    onSuccess: (updatedTerm) => {
      queryClient.invalidateQueries({ queryKey: ["/api/terms"] });
      queryClient.setQueryData(["/api/terms", updatedTerm.id], updatedTerm);
    },
  });
}

export function useDeleteTerm() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/terms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/terms"] });
    },
  });
}
