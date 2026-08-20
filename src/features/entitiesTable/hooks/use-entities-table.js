import { useState } from "react";

export function useEntitiesTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState([
    {
      desc: false,
      id: "entity",
    },
  ]);

  return {
    pagination,
    setPagination,
    setSorting,
    sorting,
  };
}
