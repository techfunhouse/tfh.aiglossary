import { Term } from "@/types";
import { TermCard } from "./term-card";

interface TermsGridProps {
  terms: Term[];
  isLoading: boolean;
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
  onView: (term: Term) => void;
}

export function TermsGrid({ terms, isLoading, onEdit, onDelete, onView }: TermsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-material p-6 border border-secondary-100 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-8 h-8 bg-secondary-200 rounded"></div>
                <div className="w-8 h-8 bg-secondary-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-secondary-200 rounded"></div>
              <div className="h-4 bg-secondary-200 rounded w-4/5"></div>
              <div className="h-4 bg-secondary-200 rounded w-3/5"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="h-6 bg-secondary-200 rounded w-16"></div>
                <div className="h-6 bg-secondary-200 rounded w-12"></div>
              </div>
              <div className="h-4 bg-secondary-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (terms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">No terms found</h3>
        <p className="text-secondary-600">
          Try adjusting your search criteria or add a new term to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {terms.map((term) => (
        <TermCard
          key={term.id}
          term={term}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
