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
