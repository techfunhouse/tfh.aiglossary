import { useState } from "react";
import { useCategoriesStatic, useTermsStatic } from "@/hooks/use-static-terms";
import { Button } from "@/components/ui/button";
import { Brain, Plus, FolderOpen, List, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddTerm?: () => void;
  isAdminMode?: boolean;
}

export function Sidebar({ selectedCategory, onCategoryChange, onAddTerm, isAdminMode = false }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: categories = [] } = useCategoriesStatic();
  const { data: allTerms = [] } = useTermsStatic();

  const getCategoryTermCount = (categoryName: string) => {
    return allTerms.filter((term: any) => term.category === categoryName).length;
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setIsMobileOpen(false);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-lg border border-secondary-200"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-80 bg-white border-r border-secondary-200 flex flex-col transition-transform duration-300 ease-in-out",
        "md:translate-x-0 md:static md:z-auto",
        "fixed inset-y-0 left-0 z-50",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileSidebar}
            className="text-secondary-500"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

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
          
          {isAdminMode && onAddTerm && (
            <Button
              onClick={onAddTerm}
              className="w-full bg-primary-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Term
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-4">
              Categories
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => handleCategorySelect("all")}
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
              
              {categories.map((category: any) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.name)}
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
      </aside>
    </>
  );
}