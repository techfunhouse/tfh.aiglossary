import { useState } from "react";
import { useTermsStatic as useTerms, useCategoriesStatic as useCategories } from "@/hooks/use-static-terms";
import { PublicSidebar } from "@/components/public-sidebar";
import { PublicHeader } from "@/components/public-header";
import { TermsGrid } from "@/components/terms-grid";
import { TermDetailDialog } from "@/components/term-detail-dialog";
import { Term } from "@/types";

export function PublicDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const { data: terms = [], isLoading } = useTerms(
    selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery || undefined
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
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
  };

  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
    setSelectedTerm(null);
  };

  return (
    <div className="min-h-screen flex bg-secondary-50">
      <PublicSidebar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <main className="flex-1 flex flex-col w-full md:w-auto">
        <PublicHeader
          selectedCategory={selectedCategory}
          totalTerms={terms.length}
          onSearch={handleSearch}
        />

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pt-16 md:pt-6">
          <TermsGrid
            terms={terms}
            isLoading={isLoading}
            onView={handleViewTerm}
            onEdit={() => {}}
            onDelete={() => {}}
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
    </div>
  );
}