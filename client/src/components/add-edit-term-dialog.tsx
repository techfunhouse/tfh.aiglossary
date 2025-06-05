import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories, useCreateTerm, useUpdateTerm } from "@/hooks/use-terms";
import { useToast } from "@/hooks/use-toast";
import { Term } from "@/types";
import { formatArrayFromText, formatUrlsFromText } from "@/lib/utils";
import { X } from "lucide-react";

const termFormSchema = z.object({
  term: z.string().min(1, "Term name is required"),
  category: z.string().min(1, "Category is required"),
  aliases: z.string().optional(),
  definition: z.string().min(1, "Definition is required"),
  related: z.string().optional(),
  tags: z.string().optional(),
  references: z.string().optional(),
});

type TermFormData = z.infer<typeof termFormSchema>;

interface AddEditTermDialogProps {
  open: boolean;
  onClose: () => void;
  editingTerm?: Term | null;
}

export function AddEditTermDialog({ open, onClose, editingTerm }: AddEditTermDialogProps) {
  const { data: categories = [] } = useCategories();
  const createTermMutation = useCreateTerm();
  const updateTermMutation = useUpdateTerm();
  const { toast } = useToast();

  const form = useForm<TermFormData>({
    resolver: zodResolver(termFormSchema),
    defaultValues: {
      term: "",
      category: "",
      aliases: "",
      definition: "",
      related: "",
      tags: "",
      references: "",
    },
  });

  useEffect(() => {
    if (editingTerm) {
      form.reset({
        term: editingTerm.term,
        category: editingTerm.category,
        aliases: editingTerm.aliases?.join(", ") || "",
        definition: editingTerm.definition,
        related: editingTerm.related?.join(", ") || "",
        tags: editingTerm.tags?.join(", ") || "",
        references: editingTerm.references?.join("\n") || "",
      });
    } else {
      form.reset({
        term: "",
        category: "",
        aliases: "",
        definition: "",
        related: "",
        tags: "",
        references: "",
      });
    }
  }, [editingTerm, form]);

  const onSubmit = (data: TermFormData) => {
    const termData = {
      term: data.term,
      category: data.category,
      definition: data.definition,
      aliases: formatArrayFromText(data.aliases || ""),
      related: formatArrayFromText(data.related || ""),
      tags: formatArrayFromText(data.tags || ""),
      references: formatUrlsFromText(data.references || ""),
    };

    if (editingTerm) {
      updateTermMutation.mutate(
        { ...termData, id: editingTerm.id },
        {
          onSuccess: () => {
            toast({
              title: "Term Updated",
              description: `${data.term} has been updated successfully.`,
            });
            onClose();
          },
          onError: (error: Error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to update term",
              variant: "destructive",
            });
          },
        }
      );
    } else {
      createTermMutation.mutate(
        termData,
        {
          onSuccess: () => {
            toast({
              title: "Term Created",
              description: `${data.term} has been created successfully.`,
            });
            onClose();
          },
          onError: (error: Error) => {
            toast({
              title: "Error",
              description: error.message || "Failed to create term",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const isLoading = createTermMutation.isPending || updateTermMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-secondary-900">
            {editingTerm ? "Edit Term" : "Add New Term"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label className="block text-sm font-medium text-secondary-700 mb-2">
                Term Name *
              </Label>
              <Input
                {...form.register("term")}
                placeholder="Enter the canonical term name"
                className="w-full"
                disabled={isLoading}
              />
              {form.formState.errors.term && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.term.message}</p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-secondary-700 mb-2">
                Category *
              </Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium text-secondary-700 mb-2">
                Aliases
              </Label>
              <Input
                {...form.register("aliases")}
                placeholder="AI, Artificial Intelligence (comma separated)"
                disabled={isLoading}
              />
              <p className="text-xs text-secondary-500 mt-1">Separate multiple aliases with commas</p>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-secondary-700 mb-2">
              Definition *
            </Label>
            <Textarea
              {...form.register("definition")}
              rows={4}
              placeholder="Provide a clear, plain-language explanation of the term..."
              className="resize-y"
              disabled={isLoading}
            />
            {form.formState.errors.definition && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.definition.message}</p>
            )}
          </div>

          <div>
            <Label className="block text-sm font-medium text-secondary-700 mb-2">
              Tags
            </Label>
            <Input
              {...form.register("tags")}
              placeholder="core-concept, ai, machine-learning (comma separated)"
              disabled={isLoading}
            />
            <p className="text-xs text-secondary-500 mt-1">Hashtag-style tags for cross-referencing</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-secondary-700 mb-2">
              Related Terms
            </Label>
            <Input
              {...form.register("related")}
              placeholder="Machine Learning, Deep Learning (comma separated)"
              disabled={isLoading}
            />
            <p className="text-xs text-secondary-500 mt-1">Other glossary terms that are conceptually linked</p>
          </div>

          <div>
            <Label className="block text-sm font-medium text-secondary-700 mb-2">
              References
            </Label>
            <Textarea
              {...form.register("references")}
              rows={3}
              placeholder="https://example.com/reference1&#10;https://example.com/reference2"
              className="resize-y"
              disabled={isLoading}
            />
            <p className="text-xs text-secondary-500 mt-1">External URLs with additional context (one per line)</p>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-secondary-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:ring-4 focus:ring-primary-200 transition-all font-medium"
            >
              {isLoading ? "Saving..." : editingTerm ? "Update Term" : "Save Term"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
