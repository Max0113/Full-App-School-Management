"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
  SortingState,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IoMdAddCircleOutline } from "react-icons/io";

function capitalizeFirstLetter(str) {
  return str ? str.at(0).toUpperCase() + str.slice(1) : "";
}

function CreateTable({
  data,
  columns,
  title,
  handleAddClick,
  isLoading = false,
  serverPagination = null,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    state: {
      globalFilter,
      columnVisibility,
      sorting,
    },
    manualPagination: !!serverPagination,
    pageCount: serverPagination?.lastPage ?? -1,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-transparent dark:border-white/10 dark:text-white dark:placeholder:text-white/50"
        />

        <div className="flex gap-4">
          <DropdownMenu className="flex-1">
            <DropdownMenuTrigger
              render={
                <Button variant="outline" className="ml-auto">
                  Columns
                </Button>
              }
            ></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {title && (
            <Button onClick={() => handleAddClick()} className={"flex-1"}>
              <IoMdAddCircleOutline className="h-4 w-4" />
              {"Add new" + " " + capitalizeFirstLetter(title)}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border dark:border-white/10 px-5 py-4 min-w-0">
        <div className="overflow-x-auto min-w-0">
          <Table className="min-w-[1000px]">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="dark:border-white/10 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="dark:text-white/50 text-black/40  font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-${rowIndex}`} className="dark:border-white/10">
                    {columns.map((_, colIndex) => (
                      <TableCell key={`skeleton-${rowIndex}-${colIndex}`}>
                        <Skeleton className="h-4 w-full max-w-[140px]" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="dark:border-white/10"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {serverPagination ? (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm dark:text-white/50 text-black/40">
            Page {serverPagination.page} sur {Math.max(1, serverPagination.lastPage)}
            {typeof serverPagination.total === "number"
              ? ` · ${serverPagination.total} résultats`
              : ""}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || serverPagination.page <= 1}
            onClick={() => serverPagination.onPageChange(serverPagination.page - 1)}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || serverPagination.page >= serverPagination.lastPage}
            onClick={() => serverPagination.onPageChange(serverPagination.page + 1)}
          >
            Suivant
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-end space-x-2">
          <div className="flex-1 text-sm dark:text-white/50 text-black/40">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {Math.max(1, table.getPageCount())}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

export default CreateTable;
