import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clientaxios } from "@/lib/axios";
import { AddDialog } from "./(forms)/AddDialog";
// react-icon
import { RiRadioButtonLine } from "react-icons/ri";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import {
  Connect_Level,
  Connect_SchoolYear,
  Connect_Subject,
} from "@/components/Api/SchoolSetting";
import { DeleteDialog } from "./(forms)/DeleteDialog";
import { EditDialog } from "./(forms)/EditDialog";

function SubjectCard() {
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
      const res = await Connect_Subject.getallsubject();
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
    <>
      <div className="bg-sidebar px-6 py-5 rounded-lg flex flex-col gap-4 w-full">
        <div>
          <div className="flex justify-between">
            <h1 className="text-xl font-bold flex items-center gap-3">
              <RiRadioButtonLine className="text-green-400" /> Subject
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                handleAddClick();
              }}
            >
              <IoIosAddCircleOutline className="text-2xl" />
            </Button>
          </div>
          <p className="text-white/20">You can create and delete subject</p>
        </div>
        {isLoading ? (
          <div className="bg-background px-6 py-5 rounded-lg w-full font-bold">
            Loading...
          </div>
        ) : data ? (
          data
            .slice()
            .reverse()
            .map((item) => (
              <div
                key={item.id}
                className="bg-background px-5 py-4 rounded-lg w-full flex justify-between items-center"
              >
                <p className="font-bold">{item.name}</p>
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
        level={editingdata}
        open={dialogOpenEd}
        onOpenChange={setDialogOpenEd}
        setrefresh={setrefresh}
        refresh={refresh}
      />
    </>
  );
}

export default SubjectCard;
