"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EditSheet } from "./(forms)/EditSheet";
import { AddSheet } from "./(forms)/AddSheet";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Connect_Rooms } from "@/components/Api/admin/Enseignement";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineMeetingRoom } from "react-icons/md";

function RoomCard({ room, onEdit, onDelete }) {
  return (
    <div className="relative w-full bg-[#141414] rounded-[24px] p-7">
      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-7 right-7 w-9 h-9 bg-[#232323] rounded-md flex items-center justify-center hover:bg-white/10 transition-colors">
          <span className="sr-only">Ouvrir le menu</span>
          <div className="flex flex-col gap-[3px]">
            <span className="w-1 h-1 rounded-full bg-white block" />
            <span className="w-1 h-1 rounded-full bg-white block" />
            <span className="w-1 h-1 rounded-full bg-white block" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(room)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(room)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-18 h-18 bg-[#232323] rounded-[15px] flex items-center justify-center">
        <MdOutlineMeetingRoom className="w-10 h-10 text-white" />
      </div>

      <div className="flex items-center gap-2.5 mt-6">
        <p className="text-white text-[22px] font-extrabold m-0">{room.name}</p>
        {room.availability ? (
          <span className="bg-[#2f9e44] text-white text-xs font-semibold px-3 py-1 rounded-full">
            Disponible
          </span>
        ) : (
          <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Indisponible
          </span>
        )}
      </div>

      <p className="mt-1 text-[#e9e9e9] text-[14px] ">
          Capacity : {room.capacity}
        — {room.type}
      </p>
    </div>
  );
}

export function TableData() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const route = useRouter();
  const [editingdata, setEditingdata] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_Rooms.getallrooms();
        if (!active) return;
        setData(res.data.data);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les salles", {
          description: getApiErrorMessage(error),
        });
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [refresh, route]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((room) =>
      [room.name, room.type].some((field) =>
        String(field ?? "").toLowerCase().includes(q)
      ) || String(room.capacity ?? "").includes(q)
    );
  }, [data, search]);

  const handleEditClick = (info) => {
    setEditingdata(info);
    setDialogOpenEd(true);
  };

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (info) => {
    setEditingdata(info);
    setDialogOpenDe(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-transparent dark:border-white/10 dark:text-white dark:placeholder:text-white/50"
          />
          <Button onClick={handleAddClick}>
            <IoMdAddCircleOutline className="h-4 w-4" />
            Add new Salle
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[28px] bg-[#141414] p-7">
                <Skeleton className="w-20 h-20 rounded-[18px]" />
                <Skeleton className="w-40 h-7 mt-4" />
                <Skeleton className="w-52 h-4 mt-2" />
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3  gap-6">
            {filtered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-white/40 py-12">Aucune salle.</p>
        )}
      </div>

      <EditSheet
        data={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <DeleteDialog
        data={editingdata}
        open={dialogOpenDe}
        onOpenChange={setDialogOpenDe}
        setrefresh={setrefresh}
        refresh={refresh}
      />

      <AddSheet
        open={dialogOpenAd}
        onOpenChange={setDialogOpenAd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}