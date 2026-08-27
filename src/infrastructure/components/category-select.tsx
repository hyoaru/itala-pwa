import { Button, ListBox, Select } from "@heroui/react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Shapes, ArrowRight, Plus } from "lucide-react";
import type { ComponentProps } from "react";
import { categoryActions } from "../actions";

interface CategorySelectProps extends ComponentProps<typeof Select> {
  onCreateCategory: () => void;
}

export const CategorySelect = (props: CategorySelectProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(categoryActions.findCategoriesInfinite());
  const categories = data.pages.flatMap((page) => page.items);

  return (
    <Select
      {...props}
      variant="secondary"
      placeholder="Choose a category"
      fullWidth
    >
      <Select.Trigger className="">
        <p className="text-muted">
          <Shapes className="me-3 h-[1.2em] w-[1.2em]" />
        </p>
        <Select.Value className="text-sm" />
        <Select.Indicator className="">
          <div className="">
            <ArrowRight className="text-muted h-[1.2em] w-[1.2em]" />
          </div>
        </Select.Indicator>
      </Select.Trigger>
      <Select.Popover
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
      >
        <div className="mt-2 px-1">
          <Button
            variant="secondary"
            className="justify-start px-3 text-start"
            fullWidth
            onPress={props.onCreateCategory}
          >
            <Plus className="inline h-[1.2em] w-[1.2em]" />
            Create category
          </Button>
        </div>
        <ListBox>
          {categories.map((category) => (
            <ListBox.Item
              className="capitalize"
              key={category.id}
              id={category.id}
              textValue={category.name}
            >
              {category.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
