"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/RoleGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { toast } from "sonner";

function Page() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => {
    Connect_Parent.teachers()
      .then((r) => setTeachers(r.data?.data ?? []))
      .catch(() => toast.error("Impossible de charger les enseignants."));
  }, []);
  return (
    <main className="space-y-6 px-10 py-5">
      <div>
        <h1 className="text-3xl font-bold">Enseignants</h1>
        <p className="text-muted-foreground">
          Contacts des enseignants qui interviennent auprès de vos enfants.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teachers.length ? (
          teachers.map((teacher) => (
            <Card key={`${teacher.id}-${teacher.subject_name}`}>
              <CardHeader>
                <CardTitle>
                  {teacher.firstname} {teacher.lastname}
                </CardTitle>
                <CardDescription>
                  <Badge variant="secondary">{teacher.subject_name}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  {teacher.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  {teacher.phone}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2 xl:col-span-3">
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucun enseignant disponible.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
export default function TeachersPage() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
