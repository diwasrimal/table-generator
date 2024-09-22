import { Label } from "@radix-ui/react-label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { Filter } from "lucide-react";
import { Column, Row } from "@/lib/types";
import ValueList from "./ValueList";

type filter = (rows: Row[]) => Row[];

type TextColumnFilterProps = {
  col: Column;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  filterFuncs: filter[];
  setFilterFuncs: (funcs: filter[]) => void;
};

export default function TextColumnFilter({
  col,
  // rows,
  // setRows,
  filterFuncs,
  setFilterFuncs,
}: TextColumnFilterProps) {
  const [open, setOpen] = useState(false);
  const [includeList, setIncludeList] = useState<string[]>([]);
  const [excludeList, setExcludeList] = useState<string[]>([]);
  const includeRef = useRef<HTMLInputElement>(null);
  const excludeRef = useRef<HTMLInputElement>(null);
  const [filtered, setFiltered] = useState(false);
  const [err, setErr] = useState("");

  function addOnEnter(
    e: React.KeyboardEvent<HTMLInputElement>,
    list: "includeList" | "excludeList",
  ) {
    if (e.key !== "Enter") return;
    if (list === "includeList") {
      const value = includeRef.current?.value.trim();
      if (!value || includeList.includes(value)) return;
      setIncludeList([...includeList, value]);
    } else {
      const value = excludeRef.current?.value.trim();
      if (!value || excludeList.includes(value)) return;
      setExcludeList([...excludeList, value]);
    }
  }

  function applyFilter() {
    // rows, setRows
    // rows: Map<string, Cell>[]
    // function filterRow(rows: Map<string,Cell>[]): Map<string,Cell>[]
    // for each row in rows:
    //    cell = row.get(col.name)
    //    for each value in cell:
    //      if includeList.includes(value) && !excludeList.includes(value)
    //        newrows.push(new Map(row))
    //
    //
    if (includeList.length === 0 && excludeList.length === 0) {
      setErr("Cannot apply empty filter.");
      return;
    }
    if (includeList.length > 0 && excludeList.length > 0) {
      setErr("Cannot have both include and exclude filters");
      return;
    }
    const filterFunc: filter = (rows: Row[]) => {
      const newRows: Row[] = [];
      if (includeList.length > 0) {
        for (const row of rows) {
          const cell = row.get(col.name);
          if (!cell) continue;
          for (const value of cell) {
            if (includeList.includes(value as string)) {
              console.log("including value", value);
              newRows.push(new Map(row));
            }
          }
        }
      } else if (excludeList.length > 0) {
        for (const row of rows) {
          const cell = row.get(col.name);
          if (!cell) continue;
          for (const value of cell) {
            if (!excludeList.includes(value as string)) {
              console.log("including value", value);
              newRows.push(new Map(row));
            }
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
    setIncludeList([]);
    setExcludeList([]);
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
              Provide values to be included/excluded in result. Press Enter to
              add.
            </p>
          </div>
          <div className="grid gap-2">
            {/* Input box and list of included values */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="include-value">Include</Label>
              <Input
                type={col.type === "number" ? "number" : "text"}
                ref={includeRef}
                id="include-value"
                onKeyDown={(e) => addOnEnter(e, "includeList")}
                className="col-span-2 h-8"
              />
            </div>
            <div className="max-h-[80px] overflow-scroll">
              <ValueList
                values={includeList}
                className="text-muted-foreground"
                canRemove={true}
                onRemove={(val) =>
                  setIncludeList(includeList.filter((v) => v !== val))
                }
              />
            </div>

            {/* Input box and list of excluded values */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="exclude-value">Exclude</Label>
              <Input
                type={col.type === "number" ? "number" : "text"}
                ref={excludeRef}
                id="exclude-value"
                onKeyDown={(e) => addOnEnter(e, "excludeList")}
                className="col-span-2 h-8"
              />
            </div>
            <div className="max-h-[80px] overflow-scroll">
              <ValueList
                values={excludeList}
                canRemove={true}
                className="text-muted-foreground"
                onRemove={(val) =>
                  setExcludeList(excludeList.filter((v) => v !== val))
                }
              />
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
