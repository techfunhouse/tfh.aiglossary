import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogOut, User, X } from "lucide-react";
import { debounce } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { SiLinkedin } from "react-icons/si";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


interface HeaderProps {
  selectedCategory: string;
  totalTerms: number;
  onSearch: (query: string) => void;
  selectedLearningPath?: { id: string; name: string; categories: string[] } | null;
  isAdminMode?: boolean;
}

export function Header({ selectedCategory, totalTerms, onSearch, selectedLearningPath, isAdminMode = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const getViewTitle = () => {
    if (selectedLearningPath) {
      return selectedLearningPath.name;
    }
    if (selectedCategory === "all") {
      return "All Categories";
    }
    return selectedCategory;
  };

  const getViewSubtitle = () => {
    if (selectedLearningPath) {
      return `Showing ${totalTerms} terms across ${selectedLearningPath.categories.length} categories`;
    }
    if (selectedCategory === "all") {
      return `Showing all ${totalTerms} terms across 12 categories`;
    }
    return `Showing ${totalTerms} terms in ${selectedCategory}`;
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-4 md:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="ml-12 md:ml-0">
          <h2 className="text-2xl font-bold text-secondary-900">{getViewTitle()}</h2>
          <p className="text-secondary-600 mt-1">{getViewSubtitle()}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Created by section */}
          <a
            href="https://linkedin.com/in/girivenkatesan"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <img
              src="/bygvensan.png"
              alt="Created by Giri Venkatesan - LinkedIn"
              className="h-8 w-auto rounded"
            />
          </a>

          {/* Mobile version - just icon */}
          <a
            href="https://linkedin.com/in/girivenkatesan"
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden flex items-center text-muted-foreground hover:text-primary transition-colors"
            title="Created by Giri Venkatesan"
          >
            <SiLinkedin className="h-4 w-4" />
          </a>
        </div>

        
        {isAdminMode && user && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            className="flex items-center space-x-2 text-secondary-700 hover:text-secondary-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </header>
  );
}
