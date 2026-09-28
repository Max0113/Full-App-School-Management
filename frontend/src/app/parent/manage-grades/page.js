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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Connect_Parent } from "@/components/Api/parent/Parent";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Page() {
  const [grades, setGrades] = useState([]);
  const [dataChild, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let active = true;
    Connect_Parent.children()
      .then((response) => {
        if (!active) return;
        const result = response.data?.data ?? [];
        setChildren(result);
        setSelectedChild(result[0] ? String(result[0].id) : "");
      })
      .catch((error) => {
        if (isUnauthorized(error)) router.push("/login");
        else
          toast.error("Impossible de charger les enfants", {
            description: getApiErrorMessage(error),
          });
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    Connect_Parent.grades(selectedChild)
      .then((r) => setGrades(r.data?.data ?? []))
      .catch(() => toast.error("Impossible de charger les notes."));
  }, [selectedChild]);
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notes des enfants</h1>
          <p className="text-muted-foreground">
            Résultats organisés par enfant et matière.
          </p>
        </div>
        <div>
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
            disabled={isLoading && !children.length}
            className="w-44 h-44 p-20"
          >
            <SelectTrigger className="min-w-[250px]">
              <SelectValue placeholder="Sélectionner un enfant" />
            </SelectTrigger>
            <SelectContent className="min-w-[120px]">
              {dataChild.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.firstname} {item.lastname}{" "}
                  {item.classe_name ? ` — ${item.classe_name}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {children.length ? (
        <Tabs value={selectedChild} onValueChange={setSelectedChild}>
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
