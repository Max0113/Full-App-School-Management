import { RoleGuard } from "@/components/RoleGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TableData } from "./(components)/TableData";

function Page() {
  return (
    <main className="space-y-6 px-10 py-5">
      <div>
        <h1 className="text-3xl font-bold">Examens</h1>
        <p className="text-muted-foreground">
          Examens passés et à venir, avec les résultats publiés.
        </p>
      </div>
      <TableData />
    </main>
  );
}

export default function ExamsPage() {
  return (
    <RoleGuard role="parent">
      <Page />
    </RoleGuard>
  );
}
