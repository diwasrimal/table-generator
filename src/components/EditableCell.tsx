import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Column, Row } from "@/lib/types";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import ValueList from "./ValueList";

type EditableCellProps = {
  rowIdx: number;
  col: Column;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  // supportsMultipleEntries: boolean;
};

export function EditableCell({
  rowIdx,
  col,
  rows,
  setRows,
  // supportsMultipleEntries,
}: EditableCellProps) {
  const cell = rows[rowIdx].get(col.name);

  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(() => {
    const values = cell || [];
    return col.type === "number" ? (values as number[]) : (values as string[]);
  });
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  let displayData: React.ReactNode;
  if (cell === undefined || cell.length === 0) {
    displayData = (
      <div className="w-full h-full text-center text-sm text-muted-foreground">
        -
      </div>
    );
  } else {
    displayData = <ValueList canRemove={false} values={cell} />;
  }

  function addInputBoxValue() {
    const value = inputRef.current!.value.trim();
    if (!value) return;
    if (col.type === "number") {
      const numberValue = Number(value);
      if ((values as number[]).includes(numberValue)) {
        setErr("Cannot add existing value");
        return;
      }
      if (!isNaN(numberValue)) {
        setValues([...(values as number[]), numberValue]);
      } else {
        setErr("Provide a valid number.");
        return;
      }
    } else {
      if ((values as string[]).includes(value)) {
        setErr("Cannot add existing value");
        return;
      }
      setValues([...(values as string[]), value]);
    }
    inputRef.current!.value = "";
  }

  function addOnEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addInputBoxValue();
    }
  }

  function deleteValue(val: string | number) {
    if (col.type === "number") {
      setValues((values as number[]).filter((v) => v !== val));
    } else {
      setValues((values as string[]).filter((v) => v !== val));
    }
  }

  function saveValues() {
    const clonedRow = new Map(rows[rowIdx]);
    clonedRow.set(col.name, values);
    console.log(`row ${rowIdx} after edit:`, clonedRow);
    setRows([...rows.slice(0, rowIdx), clonedRow, ...rows.slice(rowIdx + 1)]);
    setOpen(false);
  }

  function resetValues() {
    const values = cell || [];
    if (col.type === "number") {
      setValues(values as number[]);
    } else {
      setValues(values as string[]);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="px-2 py-1 cursor-pointer">{displayData}</div>
      </PopoverTrigger>
      <PopoverContent className="w-96 flex flex-col gap-3">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit cell</h4>
            <p className="text-sm text-muted-foreground">
              Give value and press enter to add
            </p>
          </div>
          {/* Input box for adding new value */}
          <div className="grid gap-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value">Value</Label>
              <Input
                type={col.type === "number" ? "number" : "text"}
                ref={inputRef}
                id="value"
                onKeyDown={addOnEnter}
                className="col-span-2 h-8"
              />
              <Button size="sm" onClick={addInputBoxValue}>
                Add
              </Button>
            </div>
          </div>
        </div>
        {/* List of values */}
        <div className="max-h-[200px] overflow-auto">
          <ValueList values={values} canRemove={true} onRemove={deleteValue} />
        </div>
        {err && <p className="text-destructive text-sm">{err}</p>}
        <div className="flex gap-2 justify-end">
          <PopoverClose asChild>
            <Button type="button" variant="secondary" onClick={resetValues}>
              Close
            </Button>
          </PopoverClose>
          <Button type="submit" onClick={saveValues}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
