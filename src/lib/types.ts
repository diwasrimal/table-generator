export type Column = {
  name: string;
  type: "string" | "number";
  // multipleEntries: boolean; // (e.g column "Ingredients" can have multiple entries)
};

export type Cell = string[] | number[];

export type Row = Map<string, Cell>;

// export type Row = Cell[];
