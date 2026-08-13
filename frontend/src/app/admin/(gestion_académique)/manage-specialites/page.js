"use client";

import { Connect_Speialite } from "@/components/Api/SchoolSetting";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { RiRadioButtonLine } from "react-icons/ri";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import { EditDialog } from "./(forms)/EditDialog";
import { AddDialog } from "./(forms)/AddDialog";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { LuNotebookTabs } from "react-icons/lu";

function Page() {
  const [data, Setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();
  const [editingdata, setEditingdata] = useState(null);
  const [dialogOpenEd, setDialogOpenEd] = useState(false);
  const [dialogOpenAd, setDialogOpenAd] = useState(false);
  const [dialogOpenDe, setDialogOpenDe] = useState(false);
  const [refresh, setrefresh] = useState(false);

  const handleAddClick = () => {
    setDialogOpenAd(true);
  };

  const handleDeleteClick = (date) => {
    setEditingdata(date);
    setDialogOpenDe(true);
  };

  const handleEditClick = (date) => {
    setEditingdata(date);
    setDialogOpenEd(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Speialite.getallspeialite();
      Setdata(res.data);
    } catch (error) {
      console.error(error);
      route.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [refresh]);
  return (
    <main className="px-10 py-5 flex flex-col gap-8">
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-3xl font-bold py-1 mb-0">
            Controller Specialites 📖
          </h1>
          <p className="font-light text-white/20">
            tu peux update et create , delete tout specialites
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            handleAddClick();
          }}
        >
          <IoIosAddCircleOutline className="text-2xl" /> Add new specialites
        </Button>
      </div>
      <div className=" rounded-lg grid grid-cols-3 grid-rows-2 gap-4 w-full">
        {isLoading ? (
          <>
            <Skeleton className={"w-full h-20"} />
            <Skeleton className={"w-full h-20"} />
            <Skeleton className={"w-full h-20"} />
            <Skeleton className={"w-full h-20"} />
            <Skeleton className={"w-full h-20"} />
          </>
        ) : data ? (
          data
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="bg-sidebar px-5 py-4 rounded-lg w-full"
              >
                <div className="  flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-background px-4 py-4 rounded-md ">
                      <LuNotebookTabs className="text-2xl" />
                    </div>
                    <p className="font-bold">{item.name}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        handleDeleteClick(item);
                      }}
                    >
                      <MdDeleteOutline />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-green-300/80! hover:bg-green-200! hover:text-green-700!  text-green-700"
                      onClick={() => {
                        handleEditClick(item);
                      }}
                    >
                      <FiEdit />
                    </Button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="bg-background p-4 rounded-lg w-full">No data</div>
        )}
      </div>

      <AddDialog
        open={dialogOpenAd}
        onOpenChange={setDialogOpenAd}
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

      <EditDialog
        speialite={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </main>
  );
}

export default Page;
