import { useAuth } from "@/hooks/use-auth";
import { useCategories, useTerms } from "@/hooks/use-terms";
import { Button } from "@/components/ui/button";
import { Brain, Plus, FolderOpen, List, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddTerm?: () => void;
  isAdminMode?: boolean;
}

export function Sidebar({ selectedCategory, onCategoryChange, onAddTerm, isAdminMode = false }: SidebarProps) {
  const { user, logout } = useAuth();
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
            <p className="text-sm text-secondary-600">Knowledge Management</p>
          </div>
        </div>
        
        <Button
          onClick={onAddTerm}
          className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Term
        </Button>
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary-200 rounded-full flex items-center justify-center">
            <User className="text-secondary-600 w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-900">{user?.username}</p>
            <p className="text-xs text-secondary-600">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-secondary-500 hover:text-secondary-700 transition-colors p-2"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
