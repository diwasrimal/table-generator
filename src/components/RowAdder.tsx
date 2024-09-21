import { Column, Row } from "@/lib/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { Cell } from "@/lib/types";
import Td from "./Td";

type RowAdderProps = {
  columns: Column[];
  rows: Row[];
  setRows: (rows: Row[]) => void;
  setAddingRow: (adding: boolean) => void;
};

// Row adder is just a hidden list of inputs on the table cells.
// this is shown only when the user clicks "Add Row"
export default function RowAdder({
  columns,
  rows,
  setRows,
  setAddingRow,
}: RowAdderProps) {
  const nextRowNum = rows.length;

  // TODO: fix this
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  function addNewRow() {
    const row: Cell[] = [];

    for (let i = 0; i < columns.length; i++) {
      let value = refs[i].current?.value;
      if (typeof value === "string") {
        value = value.trim();
      }
      if (!value) {
        alert("Should provide all values");
        return;
      }
      row.push([value]);
    }

    setRows([...rows, row]);
    setAddingRow(false);
  }

  return (
    <tr>
      <Td>{nextRowNum + 1}</Td>
      {columns.map((col, i) => (
        <Td key={`${col.name}-input`}>
          <Input
            autoFocus
            placeholder={`Enter ${col.name}`}
            ref={refs[i]}
            type={col.type === "number" ? "number" : "text"}
          />
        </Td>
      ))}
      <Td className="flex justify-center items-center gap-2">
        <Button size="sm" onClick={addNewRow}>
          Add
        </Button>
        <Button
          size="sm"
          variant={"secondary"}
          onClick={() => setAddingRow(false)}
        >
          Cancel
        </Button>
      </Td>
    </tr>
  );
}
