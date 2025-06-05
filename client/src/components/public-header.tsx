import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings } from "lucide-react";
import { debounce } from "@/lib/utils";
import { Link } from "wouter";

interface PublicHeaderProps {
  selectedCategory: string;
  totalTerms: number;
  onSearch: (query: string) => void;
}

export function PublicHeader({ selectedCategory, totalTerms, onSearch }: PublicHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

  const getViewTitle = () => {
    if (selectedCategory === "all") {
      return "All Categories";
    }
    return selectedCategory;
  };

  const getViewSubtitle = () => {
    if (selectedCategory === "all") {
      return `Explore ${totalTerms} AI terms across 12 categories`;
    }
    return `Browse ${totalTerms} terms in ${selectedCategory}`;
  };

  return (
    <header className="bg-white border-b border-secondary-200 px-4 md:px-8 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="pl-12 md:pl-0">
          <h2 className="text-xl md:text-2xl font-bold text-secondary-900">{getViewTitle()}</h2>
          <p className="text-sm md:text-base text-secondary-600 mt-1">{getViewSubtitle()}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-secondary-400 w-4 h-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2.5 w-full md:w-80 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Search terms, definitions, aliases..."
            />
          </div>
          {import.meta.env.DEV && (
            <Link href="/admin">
              <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Admin</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}