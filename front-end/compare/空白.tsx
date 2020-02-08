import { CCell, Cell, TableBody, TableRow } from "../src/comp/TableExt";
import * as React from "react";

{ ['安全档案','登记资料'].map((t,i) => {
  return (
    <TableRow>
      <Cell>(2){orc[t]}{i}</Cell>
      <CCell>{orc.安全档案}</CCell>
    </TableRow>
  );
} )



