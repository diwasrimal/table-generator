import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Row } from "@/lib/types";
import { useState } from "react";

type RowDeleteButtonProps = {
  rowIdx: number;
  rows: Row[];
  setRows: (rows: Row[]) => void;
};

export default function RowDeleteButton({
  rowIdx,
  rows,
  setRows,
}: RowDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  function deleteRow() {
    setRows([...rows.slice(0, rowIdx), ...rows.slice(rowIdx + 1)]);
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="flex gap-1 text-destructive"
        >
          <Trash2 width={18} className="text-destructive" />
          Delete row
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently remove the
            entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 justify-end">
          <AlertDialogCancel asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button variant={"destructive"} onClick={deleteRow}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
