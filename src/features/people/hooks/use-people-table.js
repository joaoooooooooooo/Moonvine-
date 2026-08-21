import { useState } from "react";

export function usePeopleTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState([
    {
      desc: false,
      id: "name",
    },
  ]);

  return {
    pagination,
    setPagination,
    setSorting,
    sorting,
  };
}
