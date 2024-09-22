import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Filter } from "lucide-react";
import { Column, Row } from "@/lib/types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "./ui/input";

type filter = (rows: Row[]) => Row[];

type NumberColumnFilterProps = {
  col: Column;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  filterFuncs: filter[];
  setFilterFuncs: (funcs: filter[]) => void;
};

type OperationType = "greater-equals" | "lesser-equals";

export default function NumberColumnFilter({
  col,
  // rows,
  // setRows,
  filterFuncs,
  setFilterFuncs,
}: NumberColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [operation, setOperation] = useState<OperationType>("greater-equals");
  const targetRef = useRef<HTMLInputElement>(null);
  const [filtered, setFiltered] = useState(false);
  const [err, setErr] = useState("");

  function applyFilter() {
    const text = targetRef.current?.value;
    if (!text) {
      setErr("Invalid value given.");
      return;
    }
    const target = Number(text);

    const filterFunc: filter = (rows: Row[]) => {
      const newRows: Row[] = [];
      for (const row of rows) {
        const cell = row.get(col.name);
        if (!cell) continue;
        for (const value of cell) {
          if (
            (operation === "greater-equals" && (value as number) >= target) ||
            (operation === "lesser-equals" && (value as number) <= target)
          ) {
            newRows.push(new Map(row));
            break;
          }
        }
      }
      console.log("fitlered rows:", newRows);
      return newRows;
    };
    setFilterFuncs([...filterFuncs, filterFunc]);
    setFiltered(true);
    setOpen(false);
  }

  function resetFilter() {
    setFilterFuncs([]);
    setFiltered(false);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="px-2 py-1 cursor-pointer">
          <Filter
            size={16}
            className={filtered ? "text-yellow-200" : "text-muted-foreground"}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className=" flex flex-col gap-3">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter {col.name}</h4>
            <p className="text-sm text-muted-foreground">
              State operation and value used for filtration
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              {/* Select type of operation for comparsion */}
              <div className="col-span-2">
                <Select
                  onValueChange={(operation: OperationType) =>
                    setOperation(operation)
                  }
                  defaultValue={"greater-equals"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="greater-equals">
                      Greater or equals
                    </SelectItem>
                    <SelectItem value="lesser-equals">
                      Lesser or equals
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Value that is compared */}
              <div>
                <Input type="number" ref={targetRef} />
              </div>
            </div>
          </div>
        </div>
        {err && <p className="text-destructive text-sm">{err}</p>}
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={resetFilter}>
            Reset filter
          </Button>
          <Button type="submit" onClick={applyFilter}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
