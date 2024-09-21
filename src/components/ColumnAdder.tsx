import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Column } from "@/lib/types";
// import { Checkbox } from "./ui/checkbox";

type ColumnAdderProps = {
  columns: Column[];
  setColumns: (columns: Column[]) => void;
};

const defaultColType = "string";

export default function FieldAdder({ columns, setColumns }: ColumnAdderProps) {
  const [open, setOpen] = useState(false);
  const colNameRef = useRef<HTMLInputElement>(null);
  const [colType, setColType] = useState(defaultColType);
  // const [allowMultipleEntries, setAllowMultipleEntries] = useState(false);
  const [err, setErr] = useState("");

  function addNewColumn(e: FormEvent) {
    e.preventDefault();
    const colName = colNameRef.current!.value.trim();
    if (!colName || !colType) {
      setErr("Must provide all data!");
      return;
    }

    for (const col of columns) {
      if (colName === col.name) {
        setErr("Column name is already used!");
        return;
      }
    }

    // Add new column to column list
    const newCol = {
      name: colName,
      type: colType,
    } as Column;
    console.log("Adding new column:", newCol);
    setColumns([...columns, newCol]);

    // Reset states to default and close the dialog
    setColType(defaultColType);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={"ghost"}
          className="flex gap-1 justify-center items-center"
        >
          <Plus width={18} />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={addNewColumn}>
          <DialogHeader>
            <DialogTitle>Create column</DialogTitle>
            <DialogDescription>
              Specify the name and type of the column field.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name of column */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column-name" className="text-right">
                Column name
              </Label>
              <Input
                ref={colNameRef}
                id="column-name"
                placeholder="Enter column name"
                className="col-span-3"
              />
            </div>

            {/* Data type of the column */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column-type" className="text-right">
                Column type
              </Label>
              <div className="col-span-3">
                <Select
                  onValueChange={(value) => setColType(value)}
                  defaultValue={defaultColType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkbox to allow/disallow multiple entries  */}
            {/*<div className="grid grid-cols-4 items-center gap-4">
              <div className="flex justify-end">
                <Checkbox
                  onClick={() => setAllowMultipleEntries(!allowMultipleEntries)}
                  id="multiple-entry-check"
                />
              </div>
              <div className="col-span-3">
                <label htmlFor="multiple-entry-check">
                  Allow multiple entries
                </label>
              </div>
              </div>*/}
          </div>
          {err && <p className="text-destructive text-sm">{err}</p>}
          <DialogFooter className="flex gap-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
