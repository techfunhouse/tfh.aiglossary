import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Term } from "@/types";
import { Edit, Trash2, ExternalLink, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermDetailDialogProps {
  open: boolean;
  onClose: () => void;
  term: Term | null;
  onEdit: (term: Term) => void;
  onDelete: (term: Term) => void;
  isPublicView?: boolean;
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

export function TermDetailDialog({ open, onClose, term, onEdit, onDelete, isPublicView = false }: TermDetailDialogProps) {
  if (!term) return null;

  const handleEdit = () => {
    onClose();
    onEdit(term);
  };

  const handleDelete = () => {
    onClose();
    onDelete(term);
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
                {term.related.map((relatedTerm) => (
                  <div
                    key={relatedTerm}
                    className="p-4 bg-secondary-50 rounded-lg border border-secondary-200 hover:bg-secondary-100 transition-colors cursor-pointer"
                  >
                    <h4 className="font-medium text-secondary-900 mb-1">{relatedTerm}</h4>
                    <p className="text-sm text-secondary-600">Related Term</p>
                  </div>
                ))}
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

{!isPublicView && (
          <div className="flex justify-between items-center pt-6 border-t border-secondary-200 bg-secondary-50 -mx-6 -mb-6 px-6 py-6 rounded-b-lg">
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
      </DialogContent>
    </Dialog>
  );
}
