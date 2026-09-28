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
import { Mail, MapPin, Phone } from "lucide-react";
import { Connect_Student } from "@/components/Api/student/Student";
import { toast } from "sonner";

function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    Connect_Student.schoolInfo()
      .then((r) => setData(r.data?.data ?? {}))
      .catch(() =>
        toast.error("Impossible de charger les informations de l'école."),
      );
  }, []);
  return (
    <main className="space-y-6 px-4 py-5 sm:px-10">
      <div>
        <h1 className="text-3xl font-bold">Informations de l'école</h1>
        <p className="text-muted-foreground">
          Informations générales et administration.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{data?.school_name ?? "Établissement scolaire"}</CardTitle>
          <CardDescription>
            {data?.school_year
              ? `Année scolaire : ${data.school_year}`
              : "Année scolaire non renseignée"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.school_year && (
            <Badge variant="outline">{data.school_year}</Badge>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2">
        {data?.administration?.length ? (
          data.administration.map((admin) => (
            <Card key={admin.email}>
              <CardHeader>
                <CardTitle>
                  {admin.firstname} {admin.lastname}
                </CardTitle>
                <CardDescription>Administration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  {admin.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  {admin.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  {admin.address}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center text-muted-foreground">
              Les contacts de l'administration ne sont pas encore disponibles.
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
export default function SchoolInfoPage() {
  return (
    <RoleGuard role="student">
      <Page />
    </RoleGuard>
  );
}
