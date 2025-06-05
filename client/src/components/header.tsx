import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LogOut, User, X } from "lucide-react";
import { debounce } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  selectedCategory: string;
  totalTerms: number;
  onSearch: (query: string) => void;
  isAdminMode?: boolean;
}

export function Header({ selectedCategory, totalTerms, onSearch, isAdminMode = false }: HeaderProps) {
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
    if (selectedCategory === "all") {
      return "All Categories";
    }
    return selectedCategory;
  };

  const getViewSubtitle = () => {
    if (selectedCategory === "all") {
      return `Showing all ${totalTerms} terms across 12 categories`;
    }
    return `Showing ${totalTerms} terms in ${selectedCategory}`;
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">{getViewTitle()}</h2>
          <p className="text-secondary-600 mt-1">{getViewSubtitle()}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-secondary-400 w-4 h-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10 py-2.5 w-80 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Search terms, definitions, aliases..."
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-secondary-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
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
      </div>
    </header>
  );
}
