import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Term } from "@/types";
import { Edit, Trash2, ExternalLink, X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermDetailDialogProps {
  open: boolean;
  onClose: () => void;
  term: Term | null;
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
  isPublicView?: boolean;
  allTerms?: Term[];
  onNavigateToTerm?: (term: Term) => void;
}

const categoryColors: Record<string, string> = {
  "AI Fundamentals": "bg-primary-50 text-primary-700 border-primary-200",
  "Machine Learning Algorithms": "bg-green-50 text-green-700 border-green-200",
  "Deep Learning Architectures": "bg-purple-50 text-purple-700 border-purple-200",
  "Natural Language Processing": "bg-blue-50 text-blue-700 border-blue-200",
  "Generative AI": "bg-orange-50 text-orange-700 border-orange-200",
  "AI Agents & Autonomy": "bg-red-50 text-red-700 border-red-200",
  "Knowledge & Retrieval Systems": "bg-teal-50 text-teal-700 border-teal-200",
  "Data Engineering for AI": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Model Deployment & Operations": "bg-pink-50 text-pink-700 border-pink-200",
  "AI Infrastructure & Ecosystem": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Ethics & Governance": "bg-gray-50 text-gray-700 border-gray-200",
  "Applied AI Domains": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function TermDetailDialog({ 
  open, 
  onClose, 
  term, 
  onEdit, 
  onDelete, 
  isPublicView = false,
  allTerms = [],
  onNavigateToTerm
}: TermDetailDialogProps) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [term]);

  useEffect(() => {
    // Reset scroll position when term changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    // Check scrollability after content loads
    setTimeout(checkScrollability, 100);
  }, [term]);

  if (!term) return null;

  const handleEdit = () => {
    onClose();
    onEdit(term);
  };

  const handleDelete = () => {
    onClose();
    onDelete(term);
  };

  // Sort terms alphabetically for navigation within current view
  const sortedTerms = allTerms.length > 0 ? [...allTerms].sort((a, b) => a.term.localeCompare(b.term)) : [];
  const currentIndex = sortedTerms.findIndex(t => t.id === term.id);
  const previousTerm = currentIndex > 0 ? sortedTerms[currentIndex - 1] : null;
  const nextTerm = currentIndex >= 0 && currentIndex < sortedTerms.length - 1 ? sortedTerms[currentIndex + 1] : null;

  // Debug navigation state
  console.log('Navigation Debug:', {
    termId: term.id,
    termName: term.term,
    allTermsCount: allTerms.length,
    sortedTermsCount: sortedTerms.length,
    currentIndex,
    hasPrevious: !!previousTerm,
    hasNext: !!nextTerm,
    previousTerm: previousTerm?.term,
    nextTerm: nextTerm?.term
  });

  const handleRelatedTermClick = (relatedTermName: string) => {
    const relatedTerm = allTerms.find(t => t.term === relatedTermName);
    if (relatedTerm && onNavigateToTerm) {
      onNavigateToTerm(relatedTerm);
    }
  };

  const handlePreviousTerm = () => {
    if (previousTerm && onNavigateToTerm) {
      onNavigateToTerm(previousTerm);
    }
  };

  const handleNextTerm = () => {
    if (nextTerm && onNavigateToTerm) {
      onNavigateToTerm(nextTerm);
    }
  };

  const categoryColorClass = categoryColors[term.category] || "bg-secondary-50 text-secondary-700 border-secondary-200";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden glass-morphism border-2 border-white/20">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-secondary-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <DialogTitle className="text-2xl font-bold text-secondary-900">
                  {term.term}
                </DialogTitle>
                <Badge className={cn("text-sm px-3 py-1 rounded-full border", categoryColorClass)}>
                  {term.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                {term.aliases && term.aliases.length > 0 && (
                  <span>
                    <strong>Aliases:</strong> {term.aliases.join(", ")}
                  </span>
                )}
                <span>
                  <strong>Related:</strong> {term.related?.length || 0} terms
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Scroll Indicators */}
          {canScrollUp && (
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10 flex items-center justify-center">
              <ChevronUp className="w-4 h-4 text-secondary-400 animate-bounce" />
            </div>
          )}
          {canScrollDown && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 flex items-center justify-center">
              <ChevronDown className="w-4 h-4 text-secondary-400 animate-bounce" />
            </div>
          )}
          
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-y-auto px-6 py-4 custom-scrollbar"
            onScroll={checkScrollability}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-3">Definition</h3>
                <p className="text-secondary-700 leading-relaxed">{term.definition}</p>
              </div>

              {term.tags && term.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {term.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {term.related && term.related.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Related Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {term.related.map((relatedTerm) => {
                      const relatedTermExists = allTerms.find(t => t.term === relatedTerm);
                      return (
                        <div
                          key={relatedTerm}
                          onClick={() => handleRelatedTermClick(relatedTerm)}
                          className={cn(
                            "p-4 rounded-lg border transition-colors",
                            relatedTermExists
                              ? "bg-primary-50 border-primary-200 hover:bg-primary-100 cursor-pointer"
                              : "bg-secondary-50 border-secondary-200 cursor-default"
                          )}
                        >
                          <h4 className={cn(
                            "font-medium mb-1",
                            relatedTermExists ? "text-primary-900" : "text-secondary-900"
                          )}>
                            {relatedTerm}
                            {relatedTermExists && <ExternalLink className="w-3 h-3 inline ml-2" />}
                          </h4>
                          <p className="text-sm text-secondary-600">
                            {relatedTermExists ? "Click to view" : "Related Term"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {term.references && term.references.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">References</h3>
                  <div className="space-y-2">
                    {term.references.map((reference, index) => (
                      <a
                        key={index}
                        href={reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{reference}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Navigation Bar */}
        <div className="flex-shrink-0 flex justify-between items-center pt-4 pb-6 px-6 border-t border-secondary-200 bg-secondary-50">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handlePreviousTerm}
              disabled={!previousTerm}
              variant="outline"
              size="sm"
              className="px-3 py-2 text-white border-none rounded-lg btn-primary-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-secondary-600 bg-white/50 px-3 py-1 rounded-full">
              {currentIndex + 1} of {sortedTerms.length}
            </span>
            <Button
              onClick={handleNextTerm}
              disabled={!nextTerm}
              variant="outline"
              size="sm"
              className="px-3 py-2 text-white border-none rounded-lg btn-primary-gradient disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Admin Actions */}
          {!isPublicView && (
            <div className="flex items-center space-x-3">
              <div className="text-sm text-secondary-600">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleEdit}
                  className="px-4 py-2 text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Term
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="px-4 py-2 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Term
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
