import { Term } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface TermCardProps {
  term: Term;
  onEdit?: (term: Term) => void;
  onDelete?: (term: Term) => void;
  onView: (term: Term) => void;
  isAdminMode?: boolean;
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

export function TermCard({ term, onEdit, onDelete, onView, isAdminMode = false }: TermCardProps) {
  const handleCardClick = () => {
    onView(term);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(term);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete(term);
  };

  const categoryColorClass = categoryColors[term.category] || "bg-secondary-50 text-secondary-700 border-secondary-200";
  
  // Create category CSS class name from category string
  const getCategoryClassName = (category: string) => {
    return `category-${category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`;
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-xl shadow-material p-6 cursor-pointer border border-secondary-100",
        "card-hover animate-slide-in",
        getCategoryClassName(term.category)
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-secondary-900 mb-1">{term.term}</h3>
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={cn("text-xs px-2 py-1 rounded-full border", categoryColorClass)}>
              {term.category}
            </Badge>
            {term.aliases && term.aliases.length > 0 && (
              <span className="text-xs text-secondary-500">{term.aliases.join(", ")}</span>
            )}
          </div>
        </div>
        {isAdminMode && (
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
              title="Edit term"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete term"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-secondary-700 text-sm mb-4 line-clamp-3">
        {term.definition}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {term.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded-full"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <span className="text-xs text-secondary-500 flex items-center">
          <ExternalLink className="w-3 h-3 mr-1" />
          <span>{term.related?.length || 0}</span> related
        </span>
      </div>
    </div>
  );
}
