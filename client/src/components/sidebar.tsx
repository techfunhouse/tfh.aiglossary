import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useCategoriesStatic, useTermsStatic, useLearningPathsStatic } from "@/hooks/use-static-terms";
import { useCategories, useTerms } from "@/hooks/use-terms";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Plus,
  FolderOpen,
  List,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Target,
  GraduationCap,
  Lightbulb,
  Layers,
  Cog,
  Network,
  PenTool,
  MessageSquare,
  Sparkles,
  Bot,
  Database,
  DatabaseZap,
  Server,
  Cloud,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onLearningPathChange?: (learningPath: { id: string; name: string; categories: string[] } | null) => void;
  onAddTerm?: () => void;
  isAdminMode?: boolean;
}

export function Sidebar({ selectedCategory, onCategoryChange, onLearningPathChange, onAddTerm, isAdminMode = false }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(true);
  const [isLearningPathExpanded, setIsLearningPathExpanded] = useState(true);
  const [selectedLearningPath, setSelectedLearningPath] = useState<string | null>(null);
  const sidebarContentRef = useRef<HTMLDivElement>(null);
  
  // Use appropriate data hooks based on admin mode
  const { data: staticCategories = [] } = useCategoriesStatic();
  const { data: staticTerms = [] } = useTermsStatic();
  const { data: staticLearningPaths = [] } = useLearningPathsStatic();
  const { data: adminCategories = [] } = useCategories();
  const { data: adminTerms = [] } = useTerms();
  
  const categories = isAdminMode ? adminCategories : staticCategories;
  const allTerms = isAdminMode ? adminTerms : staticTerms;
  const learningPathItems = staticLearningPaths;

  // Icon mapping function
  const getIconComponent = (iconName?: string) => {
    const iconMap: { [key: string]: any } = {
      GraduationCap,
      Target,
      Lightbulb,
      BookOpen,
      Brain,
      Layers,
      Cog,
      Network,
      PenTool,
      MessageSquare,
      Sparkles,
      Bot,
      Database,
      DatabaseZap,
      Server,
      Cloud,
      ShieldCheck,
      Briefcase,
    };
    return iconMap[iconName || ""] || FolderOpen; // Default to FolderOpen if icon not found
  };

  const getCategoryTermCount = (categoryName: string) => {
    return allTerms.filter((term: any) => term.category === categoryName).length;
  };

  const handleCategorySelect = (category: string) => {
    onCategoryChange(category);
    setSelectedLearningPath(null); // Clear learning path selection
    if (onLearningPathChange) {
      onLearningPathChange(null); // Notify parent that learning path is cleared
    }

    // When a category is selected, expand it and collapse learning paths
    setIsCategoriesExpanded(true);
    setIsLearningPathExpanded(false);

    setIsMobileOpen(false);
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
    // Scroll to top when closing mobile sidebar
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategories = () => {
    setIsCategoriesExpanded(!isCategoriesExpanded);
    // Collapse learning path when categories is expanded
    if (!isCategoriesExpanded) {
      setIsLearningPathExpanded(false);
    }
    // Scroll to top when collapsing
    if (isCategoriesExpanded) {
      if (sidebarContentRef.current) {
        sidebarContentRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLearningPath = () => {
    setIsLearningPathExpanded(!isLearningPathExpanded);
    // Collapse categories when learning path is expanded
    if (!isLearningPathExpanded) {
      setIsCategoriesExpanded(false);
    }
    // Scroll to top when collapsing
    if (isLearningPathExpanded) {
      if (sidebarContentRef.current) {
        sidebarContentRef.current.scrollTop = 0;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLearningPathSelect = (pathId: string) => {
    setSelectedLearningPath(pathId);
    // Find the learning path and get its first category
    const selectedPath = learningPathItems.find((item) => item.id === pathId);
    if (selectedPath && selectedPath.categories.length > 0) {
      onCategoryChange(selectedPath.categories[0]); // Select the first category of the learning path
      if (onLearningPathChange) {
        onLearningPathChange(selectedPath); // Notify parent about the selected learning path
      }
    }

    // When a learning path is selected, expand it and collapse categories
    setIsLearningPathExpanded(true);
    setIsCategoriesExpanded(false);

    setIsMobileOpen(false);
    if (sidebarContentRef.current) {
      sidebarContentRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get learning path progress information
  const getLearningPathProgress = (pathId: string) => {
    if (!allTerms || allTerms.length === 0) return null;
    
    const pathTerms = allTerms.filter((term: any) => 
      term.learningpaths && term.learningpaths[pathId]
    );
    
    if (pathTerms.length === 0) return null;
    
    // Sort by learning path order
    pathTerms.sort((a: any, b: any) => {
      const aOrder = a.learningpaths[pathId] || 9999;
      const bOrder = b.learningpaths[pathId] || 9999;
      return aOrder - bOrder;
    });
    
    return {
      total: pathTerms.length,
      ordered: pathTerms.filter((term: any) => term.learningpaths[pathId] < 1000).length,
      unordered: pathTerms.filter((term: any) => term.learningpaths[pathId] >= 1000).length
    };
  };

  // Debug function to log counts (remove this in production)
  const debugLearningPathCounts = () => {
    if (process.env.NODE_ENV === 'development') {
      learningPathItems.forEach(item => {
        const progress = getLearningPathProgress(item.id);
        console.log(`${item.name}: ${progress ? progress.total : 0} terms`);
      });
    }
  };

  // Call debug function once when component mounts
  useEffect(() => {
    debugLearningPathCounts();
  }, [allTerms]);

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
        
        <div ref={sidebarContentRef} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Categories Section */}
            <div>
              {/* Collapsible Categories Header */}
              <button
                onClick={toggleCategories}
                className="w-full flex items-center justify-between text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-4 hover:text-secondary-900 transition-colors"
              >
                <span>Categories</span>
                {isCategoriesExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* Categories Navigation - Collapsible */}
              <nav className={cn(
                "space-y-1 transition-all duration-300 ease-in-out overflow-hidden",
                isCategoriesExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                <button
                  onClick={() => handleCategorySelect("all")}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                    selectedCategory === "all" && !selectedLearningPath
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-secondary-700 hover:bg-secondary-100"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <List className={cn(
                        "w-4 h-4 mr-3 transition-colors",
                        selectedCategory === "all" && !selectedLearningPath
                          ? "text-primary-500"
                          : "text-secondary-500 group-hover:text-primary-500"
                      )} />
                      <div className="text-left">
                        <div className="font-medium">All Categories</div>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      selectedCategory === "all" && !selectedLearningPath
                        ? "bg-primary-500 text-white"
                        : "text-secondary-500 bg-secondary-100"
                    )}>
                      {allTerms.length}
                    </span>
                  </div>
                </button>
                
                {categories.map((category: any) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.name)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                        selectedCategory === category.name && !selectedLearningPath
                          ? "bg-primary-50 text-primary-700 border border-primary-200"
                          : "text-secondary-700 hover:bg-secondary-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent
                            className={cn(
                              "w-4 h-4 mr-3 transition-colors",
                              selectedCategory === category.name &&
                                !selectedLearningPath
                                ? "text-primary-500"
                                : "text-secondary-500 group-hover:text-primary-500"
                            )}
                          />
                          <div className="text-left">
                            <div className="font-medium">{category.name}</div>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            selectedCategory === category.name &&
                              !selectedLearningPath
                              ? "bg-primary-500 text-white"
                              : "text-secondary-500 bg-secondary-100"
                          )}
                        >
                          {getCategoryTermCount(category.name)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Learning Path Section */}
            <div>
              {/* Collapsible Learning Path Header */}
              <button
                onClick={toggleLearningPath}
                className="w-full flex items-center justify-between text-sm font-semibold text-secondary-700 uppercase tracking-wide mb-4 hover:text-secondary-900 transition-colors"
              >
                <span>Learning Path</span>
                {isLearningPathExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {/* Learning Path Navigation - Collapsible */}
              <nav className={cn(
                "space-y-1 transition-all duration-300 ease-in-out overflow-hidden",
                isLearningPathExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              )}>
                {learningPathItems.map((item) => {
                  const IconComponent = getIconComponent(item.icon);
                  const isSelected = selectedLearningPath === item.id;
                  const progress = getLearningPathProgress(item.id);
                  const totalCount = progress ? progress.total : 0;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLearningPathSelect(item.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors group",
                        isSelected
                          ? "bg-primary-50 text-primary-700 border border-primary-200"
                          : "text-secondary-700 hover:bg-secondary-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className={cn(
                            "w-4 h-4 mr-3 transition-colors",
                            isSelected 
                              ? "text-primary-500" 
                              : "text-secondary-500 group-hover:text-primary-500"
                          )} />
                          <div className="text-left">
                            <div className="font-medium">{item.name}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            isSelected
                              ? "bg-primary-500 text-white"
                              : "text-secondary-500 bg-secondary-100"
                          )}>
                            {totalCount}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}