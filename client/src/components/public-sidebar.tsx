import { useState } from "react";
import { useCategories, useTerms } from "@/hooks/use-terms";
import { Brain, FolderOpen, List, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PublicSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function PublicSidebar({ selectedCategory, onCategoryChange }: PublicSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: categories = [] } = useCategories();
  const { data: allTerms = [] } = useTerms();

  const getCategoryTermCount = (categoryName: string) => {
    return allTerms.filter(term => term.category === categoryName).length;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="relative flex">
      <aside className={cn(
        "bg-white border-r border-secondary-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-80"
      )}>
        <div className="p-6 border-b border-secondary-200">
          <div className={cn(
            "flex items-center mb-6",
            isCollapsed ? "justify-center" : "space-x-3"
          )}>
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="text-white w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-secondary-900">AI Glossary</h1>
                <p className="text-sm text-secondary-600">Knowledge Reference</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className={cn("p-6", isCollapsed && "px-2")}>
            {!isCollapsed && (
              <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-4 text-center">
                Categories
              </h3>
            )}
            <nav className="space-y-1">
              <button
                onClick={() => onCategoryChange("all")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  selectedCategory === "all"
                    ? "bg-primary-50 text-primary-700 border border-primary-200"
                    : "text-secondary-700 hover:bg-secondary-100"
                )}
                title={isCollapsed ? "All Categories" : undefined}
              >
                <List className={cn("w-4 h-4", isCollapsed ? "mx-auto" : "inline mr-3")} />
                {!isCollapsed && (
                  <>
                    All Categories
                    <span className="float-right bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                      {allTerms.length}
                    </span>
                  </>
                )}
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.name)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors relative",
                    selectedCategory === category.name
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-secondary-700 hover:bg-secondary-100"
                  )}
                  title={isCollapsed ? category.name : undefined}
                >
                  <FolderOpen className={cn(
                    "w-4 h-4 text-secondary-500",
                    isCollapsed ? "mx-auto" : "inline mr-3"
                  )} />
                  {!isCollapsed && (
                    <>
                      {category.name}
                      <span className="float-right text-xs text-secondary-500">
                        {getCategoryTermCount(category.name)}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {!isCollapsed && (
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
        )}
      </aside>
      
      {/* Collapse button positioned on the border */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="sm"
        className="absolute top-6 -right-4 z-10 p-2 bg-white border border-secondary-200 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-full shadow-md transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>
    </div>
  );
}