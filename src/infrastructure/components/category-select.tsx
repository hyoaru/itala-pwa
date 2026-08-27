import { Button, ListBox, Select } from "@heroui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Shapes, ArrowRight, Plus, ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";
import { categoryActions } from "../actions";

interface CategorySelectProps extends ComponentProps<typeof Select> {
  onCreateCategory: () => void;
}

export const CategorySelect = (props: CategorySelectProps) => {
  const { data } = useSuspenseQuery(categoryActions.findCategories());
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
      <Select.Popover>
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
          {data.items.map((i) => (
            <ListBox.Item className="" key={i.id} id={i.id} textValue={i.name}>
              <p>
                <ChevronRight className="text-muted me-2 inline h-[1.2em] w-[1.2em]" />
                {i.name}
              </p>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};
