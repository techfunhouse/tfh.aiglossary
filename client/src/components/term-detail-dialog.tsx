import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Term } from "@/types";
import { Edit, Trash2, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  if (!term) return null;

  const handleEdit = () => {
    onClose();
    onEdit(term);
  };

  const handleDelete = () => {
    onClose();
    onDelete(term);
  };

  // Sort all terms alphabetically for navigation
  const sortedTerms = [...allTerms].sort((a, b) => a.term.localeCompare(b.term));
  const currentIndex = sortedTerms.findIndex(t => t.id === term.id);
  const previousTerm = currentIndex > 0 ? sortedTerms[currentIndex - 1] : null;
  const nextTerm = currentIndex < sortedTerms.length - 1 ? sortedTerms[currentIndex + 1] : null;

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 text-secondary-400 hover:text-secondary-600 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

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
                    #{tag}
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

        {/* Navigation and Action Bar */}
        <div className="flex justify-between items-center pt-6 border-t border-secondary-200 bg-secondary-50 -mx-6 -mb-6 px-6 py-6 rounded-b-lg">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handlePreviousTerm}
              disabled={!previousTerm}
              variant="outline"
              size="sm"
              className="px-3 py-2 text-secondary-700 border border-secondary-200 rounded-lg hover:bg-secondary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-secondary-600">
              {currentIndex + 1} of {sortedTerms.length}
            </span>
            <Button
              onClick={handleNextTerm}
              disabled={!nextTerm}
              variant="outline"
              size="sm"
              className="px-3 py-2 text-secondary-700 border border-secondary-200 rounded-lg hover:bg-secondary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
