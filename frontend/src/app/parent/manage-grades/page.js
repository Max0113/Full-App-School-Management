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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { toast } from "sonner";

function Page() {
  const [grades, setGrades] = useState([]);
  useEffect(() => {
    Connect_Parent.grades()
      .then((r) => setGrades(r.data?.data ?? []))
      .catch(() => toast.error("Impossible de charger les notes."));
  }, []);
  const children = [
    ...new Map(
      grades.map((g) => [
        g.student_id,
        `${g.student_firstname} ${g.student_lastname}`,
      ]),
    ).entries(),
  ];
  const grouped = (childId) =>
    Object.entries(
      grades
        .filter((g) => g.student_id === Number(childId))
        .reduce(
          (all, grade) => ({
            ...all,
            [grade.subject_name]: [...(all[grade.subject_name] ?? []), grade],
          }),
          {},
        ),
    );
  return (
    <main className="space-y-6 px-10 py-5">
      <div>
        <h1 className="text-3xl font-bold">Notes des enfants</h1>
        <p className="text-muted-foreground">
          Résultats organisés par enfant et matière.
        </p>
      </div>
      {children.length ? (
        <Tabs defaultValue={String(children[0][0])}>
          <TabsList>
            {children.map(([id, name]) => (
              <TabsTrigger key={id} value={String(id)}>
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          {children.map(([id, name]) => (
            <TabsContent key={id} value={String(id)} className="mt-5">
              <div className="grid gap-4 lg:grid-cols-2">
                {grouped(id).map(([subject, items]) => (
                  <Card key={subject}>
                    <CardHeader>
                      <CardTitle>{subject}</CardTitle>
                      <CardDescription>
                        {name} · évaluations disponibles
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {items.map((grade) => (
                        <div
                          key={grade.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="font-medium">{grade.exam_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {grade.exam_date}
                              {grade.appreciation
                                ? ` · ${grade.appreciation}`
                                : ""}
                            </p>
                          </div>
                          <Badge>{grade.note}/20</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Aucune note disponible pour le moment.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
export default function GradesPage() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
