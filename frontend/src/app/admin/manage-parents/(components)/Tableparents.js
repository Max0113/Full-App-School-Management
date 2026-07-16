"use client";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Connect_Parents } from "@/components/Api/Connect";
import { useRouter } from "next/navigation";

const statusStyles = {
  Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Overdue: "bg-red-500/15 text-red-400 border-red-500/30",
};

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-white/10 text-white/70 border-white/20",
      )}
    >
      {status == "f" ? "female" : status == "m" ? "male" : status}
    </span>
  );
}

export function DataTable({ data }) {
  const [rows, Setrows] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const route = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await Connect_Parents.getallparents();
      Setrows(res.data);
    } catch (error) {
      console.error(error);
      route.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    handleSubmit();
  }, []);

  return (
    <div className="w-full">
      <div className="relative w-full overflow-auto rounded-xl border border-white/10 bg-white/[0.02] px-7 py-3">
        <Table>
          <TableCaption className="pb-4 text-white/40">
            A list of your recent invoices.
          </TableCaption>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-[50px] text-white/50 font-medium">
                Id
              </TableHead>
              <TableHead className="text-white/50 font-medium">
                First name
              </TableHead>
              <TableHead className="text-white/50 font-medium">
                Last name
              </TableHead>
              <TableHead className=" text-white/50 font-medium">
                Email
              </TableHead>
              <TableHead className=" text-white/50 font-medium">
                Phone
              </TableHead>
              <TableHead className=" text-white/50 font-medium">
                Address
              </TableHead>
              <TableHead className=" text-white/50 font-medium">
                Gender
              </TableHead>
              <TableHead className=" text-white/50 font-medium">
                Blood type
              </TableHead>
              <TableHead className="text-white/50 font-medium">
                Date of birth
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-white/5 transition-colors hover:bg-white/[0.04]"
              >
                <TableCell className="font-medium text-white/90">
                  {row?.id}
                </TableCell>
                <TableCell className="text-white/70">
                  {row?.firstname}
                </TableCell>
                <TableCell className="text-white/70">{row?.lastname}</TableCell>
                <TableCell className="text-white/70">{row?.email}</TableCell>
                <TableCell className="text-white/70">{row?.phone}</TableCell>
                <TableCell className="text-white/70">{row?.address}</TableCell>
                <TableCell className="text-white/70">
                  <StatusBadge status={row?.gender} />
                </TableCell>
                <TableCell className="text-white/70">
                  <StatusBadge status={row?.blood_type} />
                </TableCell>
                <TableCell className="font-medium text-white/90 tabular-nums">
                  {row?.date_of_birth}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
