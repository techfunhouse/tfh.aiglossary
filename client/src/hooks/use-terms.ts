import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Term, CreateTermRequest, UpdateTermRequest, Category } from "@/types";

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
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
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

export function useTermsByLearningPath(learningPath?: { id: string; name: string; categories: string[] } | null, search?: string) {
  const queryKey = ["/api/terms", "learningPath"];
  if (learningPath) {
    queryKey.push("learningPath", learningPath.id);
  }
  if (search) {
    queryKey.push("search", search);
  }

  return useQuery<Term[]>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (learningPath && learningPath.categories.length > 0) {
        // For learning paths, we need to fetch all terms and filter by categories
        // since the API might not support multiple categories directly
        const response = await fetch(`/api/terms`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch terms");
        }
        
        const allTerms: Term[] = await response.json();
        
        // Filter by learning path categories
        let filteredTerms = allTerms.filter(term => 
          learningPath.categories.includes(term.category)
        );
        
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
        
        // Sort terms by learning path order
        filteredTerms.sort((a, b) => {
          const aOrder = a.learningpaths?.[learningPath.id] || 9999;
          const bOrder = b.learningpaths?.[learningPath.id] || 9999;
          
          // If both have the same order, sort alphabetically
          if (aOrder === bOrder) {
            return a.term.localeCompare(b.term);
          }
          
          return aOrder - bOrder;
        });
        
        return filteredTerms;
      }
      
      // If no learning path, return empty array
      return [];
    },
    enabled: !!learningPath,
  });
}
