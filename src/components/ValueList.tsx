import { ComponentProps } from "react";
import { Cell } from "@/lib/types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ValueListProps = ComponentProps<"ul"> & {
  values: Cell;
  canRemove?: boolean;
  onRemove?: (value: string | number) => void;
};

export default function ValueList({
  values,
  canRemove = true,
  onRemove,
  className,
  ...rest
}: ValueListProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap gap-2 text-sm h-full overflow-scroll",
        className,
      )}
      {...rest}
    >
      {values.map((val) => (
        <li
          key={`${val}`}
          className="flex gap-1 px-2 rounded-md bg-secondary justify-center items-center"
        >
          {val}
          {canRemove && (
            <X
              width={12}
              className="cursor-pointer"
              onClick={() => onRemove && onRemove(val)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
