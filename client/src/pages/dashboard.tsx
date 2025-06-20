import { useState } from "react";
import { useTerms, useTermsByLearningPath, useDeleteTerm } from "@/hooks/use-terms";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { SearchBar } from "@/components/search-bar";
import { TermsGrid } from "@/components/terms-grid";
import { AddEditTermDialog } from "@/components/add-edit-term-dialog";
import { TermDetailDialog } from "@/components/term-detail-dialog";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { BackToTop } from "@/components/back-to-top";
import { Term } from "@/types";

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLearningPath, setSelectedLearningPath] = useState<{ id: string; name: string; categories: string[] } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [termToDelete, setTermToDelete] = useState<Term | null>(null);

  // Use different hooks based on whether a learning path is selected
  const { data: categoryTerms = [], isLoading: categoryLoading } = useTerms(
    selectedLearningPath ? undefined : (selectedCategory === "all" ? undefined : selectedCategory),
    searchQuery || undefined
  );

  const { data: learningPathTerms = [], isLoading: learningPathLoading } = useTermsByLearningPath(
    selectedLearningPath,
    searchQuery || undefined
  );

  // Use the appropriate data based on selection
  const terms = selectedLearningPath ? learningPathTerms : categoryTerms;
  const isLoading = selectedLearningPath ? learningPathLoading : categoryLoading;
  
  const deleteTermMutation = useDeleteTerm();
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleLearningPathChange = (learningPath: { id: string; name: string; categories: string[] } | null) => {
    setSelectedLearningPath(learningPath);
    setSearchQuery(""); // Clear search when changing learning path
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddTerm = () => {
    setEditingTerm(null);
    setIsAddEditDialogOpen(true);
  };

  const handleEditTerm = (term: Term) => {
    setEditingTerm(term);
    setIsAddEditDialogOpen(true);
  };

  const handleDeleteTerm = (term: Term) => {
    setTermToDelete(term);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTerm = () => {
    if (!termToDelete) return;
    
    deleteTermMutation.mutate(termToDelete.id, {
      onSuccess: () => {
        toast({
          title: "Term Deleted",
          description: `${termToDelete.term} has been deleted successfully.`,
        });
        setTermToDelete(null);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to delete term",
          variant: "destructive",
        });
      },
    });
  };

  const handleViewTerm = (term: Term) => {
    setSelectedTerm(term);
    setIsDetailDialogOpen(true);
  };

  const handleNavigateToTerm = (term: Term) => {
    setSelectedTerm(term);
  };

  const handleCloseAddEditDialog = () => {
    setIsAddEditDialogOpen(false);
    setEditingTerm(null);
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
        onAddTerm={handleAddTerm}
        isAdminMode={true}
      />

      <main className="flex-1 flex flex-col w-full md:w-auto">
        <Header
          selectedCategory={selectedCategory}
          totalTerms={terms.length}
          onSearch={handleSearch}
          selectedLearningPath={selectedLearningPath}
          isAdminMode={true}
        />

        <SearchBar onSearch={handleSearch} />

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <TermsGrid
            terms={terms}
            isLoading={isLoading}
            onEdit={handleEditTerm}
            onDelete={handleDeleteTerm}
            onView={handleViewTerm}
            isAdminMode={true}
          />
        </div>
      </main>

      <AddEditTermDialog
        open={isAddEditDialogOpen}
        onClose={handleCloseAddEditDialog}
        editingTerm={editingTerm}
      />

      <TermDetailDialog
        open={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        term={selectedTerm}
        onEdit={handleEditTerm}
        onDelete={handleDeleteTerm}
        allTerms={terms}
        onNavigateToTerm={handleNavigateToTerm}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteTerm}
        title="Delete Term"
        description={`Are you sure you want to delete "${termToDelete?.term}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <BackToTop />
    </div>
  );
}
