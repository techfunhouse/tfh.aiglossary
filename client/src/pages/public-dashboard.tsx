import { useState, useRef } from "react";
import { useTermsStatic, useTermsStaticByLearningPath, useCategoriesStatic } from "@/hooks/use-static-terms";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { TermsGrid } from "@/components/terms-grid";
import { TermDetailDialog } from "@/components/term-detail-dialog";
import { BackToTop } from "@/components/back-to-top";
import { Term } from "@/types";

export function PublicDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLearningPath, setSelectedLearningPath] = useState<{ id: string; name: string; categories: string[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Use different hooks based on whether a learning path is selected
  const { data: categoryTerms = [], isLoading: categoryLoading } = useTermsStatic(
    selectedLearningPath ? undefined : (selectedCategory === "all" ? undefined : selectedCategory),
    searchQuery || undefined
  );

  const { data: learningPathTerms = [], isLoading: learningPathLoading } = useTermsStaticByLearningPath(
    selectedLearningPath,
    searchQuery || undefined
  );

  // Use the appropriate data based on selection
  const terms = selectedLearningPath ? learningPathTerms : categoryTerms;
  const isLoading = selectedLearningPath ? learningPathLoading : categoryLoading;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  };

  const handleLearningPathChange = (learningPath: { id: string; name: string; categories: string[] } | null) => {
    setSelectedLearningPath(learningPath);
    setSearchQuery(""); // Clear search when changing learning path
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = 0;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewTerm = (term: Term) => {
    setSelectedTerm(term);
    setIsDetailDialogOpen(true);
  };

  const handleNavigateToTerm = (term: Term) => {
    setSelectedTerm(term);
    // Ensure dialog stays open when navigating between terms
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedTerm(null);
  };

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onLearningPathChange={handleLearningPathChange}
        isAdminMode={false}
      />

      <main className="flex-1 flex flex-col w-full md:w-auto">
        <Header
          selectedCategory={selectedCategory}
          totalTerms={terms.length}
          onSearch={handleSearch}
          selectedLearningPath={selectedLearningPath}
        />

        <SearchBar onSearch={handleSearch} />

        <div ref={contentAreaRef} className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <TermsGrid
            terms={terms}
            isLoading={isLoading}
            onView={handleViewTerm}
            isAdminMode={false}
          />
        </div>
      </main>

      <TermDetailDialog
        open={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        term={selectedTerm}
        onEdit={() => {}} // No edit functionality in public view
        onDelete={() => {}} // No delete functionality in public view
        isPublicView={true}
        allTerms={terms}
        onNavigateToTerm={handleNavigateToTerm}
      />

      <BackToTop />
    </div>
  );
}