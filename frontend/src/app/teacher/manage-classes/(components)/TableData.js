"use client";
import { useState, useEffect } from "react";
import { getColumns } from "./columns";
import { useRouter } from "next/navigation";
import CreateTable from "@/components/Table/CreateTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Connect_MyInfo } from "@/components/Api/teacher/Enseignement";
import { isUnauthorized, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineMeetingRoom } from "react-icons/md";

function ClasseCard({ classe, onEdit, onDelete }) {
  return (
    <div className="relative w-full bg-[#141414] rounded-[24px] p-7">

      <div className="w-18 h-18 bg-[#232323] rounded-[15px] flex items-center justify-center">
        <MdOutlineMeetingRoom className="w-10 h-10 text-white" />
      </div>

      <div className="flex items-center gap-2.5 mt-6">
        <p className="text-white text-[22px] font-extrabold m-0">{classe.classe_name}</p>
        <span className="bg-[#2f9e44] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {classe.session_total} Sessions
        </span>
      </div>

      <p className="mt-1 text-[#e9e9e9] text-[14px] ">
        La Matiere : {classe.subject_name}
      </p>
      <p className="mt-1 text-[#e9e9e9] text-[14px] ">
       {classe.specialites_name} - {classe.school_year_name}
      </p>
    </div>
  );
}

export function TableData() {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();
  const [refresh, setrefresh] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await Connect_MyInfo.getMyClasses();
        if (!active) return;
        Setdata(res.data.data);
      } catch (error) {
        if (!active) return;
        if (isUnauthorized(error)) {
          route.push("/login");
          return;
        }
        toast.error("Impossible de charger les classes", {
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

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
      {data.map((classe) => (
          <ClasseCard
            key={classe.id}
            classe={classe}
          />
      ))}
    </div>
    </>
  );
}
