import {
  ChevronsLeft,
  ChevronsRight,
  Download,
  Plus,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import ColumnAdder from "./components/ColumnAdder";
import Td from "./components/Td";
import { Button } from "./components/ui/button";
import { ModeToggle } from "./components/ui/mode-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Row, Column } from "./lib/types";

import RowDeleteButton from "./components/RowDeleter";
import { EditableCell } from "./components/EditableCell";
import { replacer, reviver } from "./lib/utils";

export default function App() {
  // Try getting saved values from localStorage
  const [entriesPerPage, setEntriesPerPage] = useState(
    () => localStorage.getItem("entriesPerPage") || 10,
  );
  const [columns, setColumns] = useState<Column[]>(() =>
    JSON.parse(localStorage.getItem("columns") || "[]"),
  );
  const [rows, setRows] = useState<Row[]>(() =>
    JSON.parse(localStorage.getItem("rows") || "[]", reviver),
  );

  // Sync values to localStorage on change
  useEffect(() => {
    localStorage.setItem("entriesPerPage", entriesPerPage.toString());
  }, [entriesPerPage]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows, replacer));
  }, [rows]);

  function addNewRow() {
    if (columns.length === 0) return;
    // const row: Row = new Array(columns.length).fill([]);
    const row: Row = new Map();
    setRows([...rows, row]);
  }

  return (
    <div className="h-screen flex flex-col gap-4 p-3 container m-auto">
      {/* Top buttons */}
      <div className="flex gap-4 justify-end">
        <ModeToggle />
        <Button
          variant="outline"
          className="flex gap-2 justify-center items-center"
        >
          <Upload width={18} />
          Bulk Rows Upload
        </Button>
        <Button
          variant="outline"
          className="flex gap-2 justify-center items-center"
        >
          <Download width={18} />
          Download All
        </Button>

        <Button
          onClick={addNewRow}
          disabled={columns.length === 0}
          className="flex gap-2 justify-center items-center"
        >
          <Plus width={18} />
          Add Row
        </Button>
      </div>

      {/* Table */}
      <main className="flex-grow overflow-auto border p-2">
        {columns.length === 0 ? (
          <div className="w-full h-full flex justify-center items-center gap-4">
            No columns in table.
            <ColumnAdder {...{ columns, setColumns }} />
          </div>
        ) : (
          <table className="table-auto border-collapse border">
            {/* Columns */}
            <thead>
              <tr>
                <Td className="text-center">#</Td>
                {columns.map((col) => (
                  <Td key={`${col.name}-column`} className="font-bold">
                    {col.name}
                  </Td>
                ))}
                <Td>
                  <ColumnAdder {...{ columns, setColumns }} />
                </Td>
              </tr>
            </thead>

            {/* All row entries */}
            <tbody>
              {rows.map((row, r) => (
                <tr key={`r-${r}`}>
                  <Td className="text-sm text-secondary-foreground text-center">
                    {r + 1}
                  </Td>
                  {columns.map((col, c) => {
                    return (
                      <Td key={`r-${r}-col-${col.name}`} className="p-0">
                        {/* Avoided padding on parent to prevent false touches, instead can add padding inside */}
                        <EditableCell
                          {...{
                            rowIdx: r,
                            col,
                            rows,
                            setRows,
                            // supportsMultipleEntries: col.multipleEntries,
                          }}
                        />
                      </Td>
                    );
                  })}
                  <Td>
                    <RowDeleteButton {...{ rowIdx: r, rows, setRows }} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Bottom controls */}
      <div className="flex justify-between">
        <div className="flex justify-center items-center">
          Entries per page:
          <div className="ml-2">
            <Select onValueChange={(value) => setEntriesPerPage(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder={entriesPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          <ChevronsLeft width={20} className="cursor-pointer" />
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
          <ChevronsRight width={20} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
