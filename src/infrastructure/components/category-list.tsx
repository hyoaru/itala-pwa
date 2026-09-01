import { CategoryTile } from "./category-tile";
import { EditCategoryModal } from "./edit-category-modal";
import { useCategoryActions } from "@/infrastructure/hooks";
import {
  Button,
  Modal,
  ScrollShadow,
  toast,
  useOverlayState,
} from "@heroui/react";
import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Archive } from "lucide-react";
import { useState } from "react";
import type { Category } from "@/domain/entities";

export const CategoryList = () => {
  const editCategoryModalState = useOverlayState();
  const archiveConfirmState = useOverlayState();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const { findCategoriesInfinite, archiveCategory } = useCategoryActions();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(findCategoriesInfinite());
  const categories = data.pages.flatMap((page) => page.items);

  const archiveCategoryMutation = useMutation(archiveCategory());

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    editCategoryModalState.open();
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    archiveConfirmState.open();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await archiveCategoryMutation.mutateAsync({ id: selectedCategory.id });
      toast("Category deleted", { variant: "success" });
      archiveConfirmState.close();
      setSelectedCategory(null);
    } catch {
      toast("An unexpected error has occured", { variant: "danger" });
    }
  };

  return (
    <>
      <ScrollShadow
        size={80}
        onScroll={(e) => {
          const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
          if (
            hasNextPage &&
            !isFetchingNextPage &&
            scrollHeight - scrollTop - clientHeight < 40
          ) {
            fetchNextPage();
          }
        }}
        hideScrollBar
        className="h-full space-y-2"
      >
        {categories.map((category) => (
          <CategoryTile
            key={category.id}
            category={category}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </ScrollShadow>

      <EditCategoryModal
        isOpen={editCategoryModalState.isOpen}
        onOpenChange={editCategoryModalState.setOpen}
        category={selectedCategory}
      />

      <Modal.Backdrop
        isOpen={archiveConfirmState.isOpen}
        onOpenChange={archiveConfirmState.setOpen}
      >
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-default text-foreground">
                <Archive className="size-5" />
              </Modal.Icon>
              <Modal.Heading>Delete category?</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-muted text-sm">
                Are you sure you want to delete this category? This action
                cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="ghost"
                className="w-full"
                onClick={archiveConfirmState.close}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-danger text-danger-foreground w-full"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
};
