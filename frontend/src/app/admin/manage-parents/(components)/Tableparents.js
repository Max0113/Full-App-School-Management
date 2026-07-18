"use client";
import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getColumns } from "@/components/Table/columns";
import { useRouter } from "next/navigation";
import { Connect_Parents } from "@/components/Api/Connect";
import { EditParentDialog } from "./(dialog)/EditParentDialog";
import { AddParentDialog } from "./(dialog)/AddParentDialog";
import { IoMdAddCircleOutline } from "react-icons/io";
import { DeleteParentDialog } from "./(dialog)/DeleteParentDialog";

export function DataTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [editingParent, setEditingParent] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleEditClick = (parent) => {
    setEditingParent(parent);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (parent) => {
    setEditingParent(parent);
    setDialogOpenDe(true);
  };

  const columns = getColumns(handleEditClick, handleDeleteClick);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Parents.getallparents();
      Setdata(res.data);
    } catch (error) {
      console.error(error);
      route.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
  });

  useEffect(() => {
    handleSubmit();
  }, [refresh]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm bg-transparent border-white/10 text-white placeholder:text-white/50"
        />

        <Button onClick={() => handleAddClick()}>
          <IoMdAddCircleOutline className="h-4 w-4" />
          Add new Parent
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-white/10 px-5 py-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/10 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white/50 font-medium"
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-white/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-white/50">
          Page {table.getState().pagination.pageIndex + 1} sur{" "}
          {table.getPageCount()}
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

      <EditParentDialog
        parent={editingParent}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteParentDialog
        parent={editingParent}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <AddParentDialog
        open={dialogOpenAd}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </div>
  );
}
