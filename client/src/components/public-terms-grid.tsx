import { Term } from "@/types";
import { PublicTermCard } from "./public-term-card";

interface PublicTermsGridProps {
  terms: Term[];
  isLoading: boolean;
  onView: (term: Term) => void;
}

export function PublicTermsGrid({ terms, isLoading, onView }: PublicTermsGridProps) {
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
          Try adjusting your search criteria or browse different categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {terms.map((term) => (
        <PublicTermCard
          key={term.id}
          term={term}
          onView={onView}
        />
      ))}
    </div>
  );
}