import {
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  Plus,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import TextColumnFilter from "./components/TextColumnFilter";
import NumberColumnFilter from "./components/NumberColumnFilter";

export default function App() {
  const [columns, setColumns] = useState<Column[]>(() =>
    JSON.parse(localStorage.getItem("columns") || "[]"),
  );
  const [rows, setRows] = useState<Row[]>(() =>
    JSON.parse(localStorage.getItem("rows") || "[]", reviver),
  );

  // Used for pagination
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(() =>
    Number(localStorage.getItem("entriesPerPage") || 10),
  );

  const [filterFuncs, setFilterFuncs] = useState<((rows: Row[]) => Row[])[]>(
    [],
  );

  const rowsView = (() => {
    let result = rows.slice(
      (page - 1) * entriesPerPage,
      Math.min(page * entriesPerPage, rows.length),
    );
    for (const func of filterFuncs) {
      result = func(result);
    }
    return result;
  })();

  console.log("rowsView", rowsView);

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
                    <div className="flex justify-center items-center">
                      {col.name}
                      {col.type === "number" ? (
                        <NumberColumnFilter
                          {...{
                            col,
                            rows,
                            setRows,
                            filterFuncs,
                            setFilterFuncs,
                          }}
                        />
                      ) : (
                        <TextColumnFilter
                          {...{
                            col,
                            rows,
                            setRows,
                            filterFuncs,
                            setFilterFuncs,
                          }}
                        />
                      )}
                    </div>
                  </Td>
                ))}
                <Td>
                  <ColumnAdder {...{ columns, setColumns }} />
                </Td>
              </tr>
            </thead>

            {/* All editable row entries */}
            <tbody>
              {rowsView.map((_, rvIdx) => {
                const originalRowIdx = (page - 1) * entriesPerPage + rvIdx; // row view index starts from 0 for every page
                return (
                  <tr key={rvIdx}>
                    <Td className="text-sm text-secondary-foreground text-center">
                      {originalRowIdx + 1}
                    </Td>
                    {columns.map((col) => {
                      return (
                        <Td key={`${col.name}`} className="p-0">
                          {/* Avoided padding on parent to prevent false touches, instead can add padding inside */}
                          <EditableCell
                            {...{
                              rowIdx: originalRowIdx,
                              cell: rowsView[rvIdx].get(col.name), // @fix
                              col,
                              rows,
                              setRows,
                            }}
                          />
                        </Td>
                      );
                    })}
                    <Td>
                      <RowDeleteButton
                        {...{ rowIdx: originalRowIdx, rows, setRows }}
                      />
                    </Td>
                  </tr>
                );
              })}
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
        <div className="flex gap-3 justify-center items-center">
          <Button
            variant="outline"
            className="flex gap-1 justify-center items-center"
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            <ChevronsLeft width={20} className="cursor-pointer" />
            Previous
          </Button>
          <span>{page}</span>
          <Button
            variant="outline"
            className="flex gap-1 justify-center items-center"
            onClick={() => {
              if (rows.length > page * entriesPerPage) {
                setPage(page + 1);
              }
            }}
          >
            Next
            <ChevronsRight width={20} className="cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
}
