import { useCategories, useTerms } from "@/hooks/use-terms";
import { Brain, FolderOpen, List, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface PublicSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function PublicSidebar({ selectedCategory, onCategoryChange }: PublicSidebarProps) {
  const { data: categories = [] } = useCategories();
  const { data: allTerms = [] } = useTerms();

  const getCategoryTermCount = (categoryName: string) => {
    return allTerms.filter(term => term.category === categoryName).length;
  };

  return (
    <aside className="w-80 bg-white border-r border-secondary-200 flex flex-col">
      <div className="p-6 border-b border-secondary-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-secondary-900">AI Glossary</h1>
            <p className="text-sm text-secondary-600">Knowledge Reference</p>
          </div>
        </div>
        
        <Link href="/login">
          <div className="w-full bg-secondary-100 text-secondary-700 py-2.5 px-4 rounded-lg font-medium hover:bg-secondary-200 transition-colors cursor-pointer flex items-center justify-center">
            <LogIn className="w-4 h-4 mr-2" />
            Admin Login
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-4">
            Categories
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => onCategoryChange("all")}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === "all"
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "text-secondary-700 hover:bg-secondary-100"
              )}
            >
              <List className="w-4 h-4 inline mr-3" />
              All Categories
              <span className="float-right bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                {allTerms.length}
              </span>
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === category.name
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-secondary-700 hover:bg-secondary-100"
                )}
              >
                <FolderOpen className="w-4 h-4 inline mr-3 text-secondary-500" />
                {category.name}
                <span className="float-right text-xs text-secondary-500">
                  {getCategoryTermCount(category.name)}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="p-6 border-t border-secondary-200">
        <div className="text-center">
          <p className="text-sm text-secondary-600">
            Browse {allTerms.length} AI terms across {categories.length} categories
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            Public access • Read-only mode
          </p>
        </div>
      </div>
    </aside>
  );
}