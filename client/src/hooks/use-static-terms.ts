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
  return useQuery<Category[]>({
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

export function useTermsStaticByLearningPath(learningPath?: { id: string; name: string; categories: string[] } | null, search?: string) {
  return useQuery({
    queryKey: ["terms", "learningPath", learningPath?.id, search],
    queryFn: async () => {
      try {
        const response = await fetch("/data/terms.json");
        if (!response.ok) throw new Error("Failed to fetch terms");
        const allTerms: Term[] = await response.json();
        
        let filteredTerms = allTerms;
        
        // Filter by learning path
        if (learningPath) {
          filteredTerms = filteredTerms.filter(term => 
            term.learningpaths && term.learningpaths[learningPath.id]
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
        
        // Sort terms by learning path order if a learning path is selected
        if (learningPath && learningPath.id) {
          filteredTerms.sort((a, b) => {
            const aOrder = a.learningpaths?.[learningPath.id] || 9999;
            const bOrder = b.learningpaths?.[learningPath.id] || 9999;
            
            // If both have the same order, sort alphabetically
            if (aOrder === bOrder) {
              return a.term.localeCompare(b.term);
            }
            
            return aOrder - bOrder;
          });
        } else {
          // Default alphabetical sorting for categories
          filteredTerms.sort((a, b) => a.term.localeCompare(b.term));
        }
        
        return filteredTerms;
      } catch (error) {
        console.error("Failed to load static terms:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  categories: string[];
}

export function useLearningPathsStatic() {
  return useQuery<LearningPath[]>({
    queryKey: ["learningPaths"],
    queryFn: async () => {
      try {
        const response = await fetch("/data/learningpaths.json");
        if (!response.ok) throw new Error("Failed to fetch learning paths");
        return response.json();
      } catch (error) {
        console.error("Failed to load learning paths:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}