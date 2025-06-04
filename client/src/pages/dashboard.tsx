import { useState } from "react";
import { useTerms, useDeleteTerm } from "@/hooks/use-terms";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { TermsGrid } from "@/components/terms-grid";
import { AddEditTermDialog } from "@/components/add-edit-term-dialog";
import { TermDetailDialog } from "@/components/term-detail-dialog";
import { Term } from "@/types";

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);

  const { data: terms = [], isLoading } = useTerms(
    selectedCategory === "all" ? undefined : selectedCategory,
    searchQuery || undefined
  );
  
  const deleteTermMutation = useDeleteTerm();
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
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
    if (window.confirm(`Are you sure you want to delete "${term.term}"?`)) {
      deleteTermMutation.mutate(term.id, {
        onSuccess: () => {
          toast({
            title: "Term Deleted",
            description: `${term.term} has been deleted successfully.`,
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to delete term",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleViewTerm = (term: Term) => {
    setSelectedTerm(term);
    setIsDetailDialogOpen(true);
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
        onAddTerm={handleAddTerm}
      />

      <main className="flex-1 flex flex-col">
        <Header
          selectedCategory={selectedCategory}
          totalTerms={terms.length}
          onSearch={handleSearch}
        />

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <TermsGrid
            terms={terms}
            isLoading={isLoading}
            onEdit={handleEditTerm}
            onDelete={handleDeleteTerm}
            onView={handleViewTerm}
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
      />
    </div>
  );
}
