"use client";

import React, { useEffect, useMemo, useState } from "react";
import CustomCalendar from "./(components)/(clander)/CustomCalendar";
import { RoleGuard } from "@/components/RoleGuard";
import { useAuth } from "@/components/Context/AuthContext";
import { Connect_General, Connect_MySessions } from "@/components/Api/teacher/Enseignement";
import { getApiErrorMessage } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, RefreshCw } from "lucide-react";

function SessionsPage() {
  const { user, checkAuth } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadSchedule() {
      setIsLoading(true);
      setError("");
      try {
        const currentUser = user ?? await checkAuth();
        if (!currentUser?.id) throw new Error("Impossible d'identifier le professeur connecté.");

        const [sessionsResponse, classesResponse] = await Promise.all([
          Connect_MySessions.getMySessions(currentUser.id),
          Connect_General.getClasseSelect(),
        ]);

        if (!active) return;
        setSessions(sessionsResponse.data?.data ?? []);
        setClasses(classesResponse.data?.data ?? []);
      } catch (requestError) {
        if (active) {
          setSessions([]);
          setError(getApiErrorMessage(requestError, "Impossible de charger vos séances."));
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadSchedule();
    return () => { active = false; };
  }, [user, checkAuth, reloadKey]);

  const filteredSessions = useMemo(() => (
    selectedClassId === "all"
      ? sessions
      : sessions.filter((session) => String(session.classe_id) === selectedClassId)
  ), [sessions, selectedClassId]);

  const selectedClasse = useMemo(() => (
    selectedClassId === "all"
      ? null
      : classes.find((classe) => String(classe.id) === selectedClassId) ?? null
  ), [classes, selectedClassId]);

  return (
    <main className="px-10 py-5">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 text-3xl font-bold">Mes séances 🔥</h1>
          <p className="text-sm text-muted-foreground">
            Consultez votre emploi du temps hebdomadaire et les salles de cours.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Filtrer par classe">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map((classe) => (
                <SelectItem key={classe.id} value={String(classe.id)}>
                  {classe.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => setReloadKey((value) => value + 1)}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} />
            Actualiser
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-80 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
          Chargement de votre emploi du temps…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5">
          <p className="font-medium text-destructive">Les séances n&apos;ont pas pu être chargées.</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => setReloadKey((value) => value + 1)}>
            Réessayer
          </Button>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card text-center">
          <CalendarDays className="mb-3 size-10 text-muted-foreground" />
          <p className="font-medium">Aucune séance à afficher</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedClasse ? `Aucune séance n'est prévue pour ${selectedClasse.name}.` : "Votre emploi du temps ne contient pas encore de séance."}
          </p>
        </div>
      ) : (
        <CustomCalendar
          sessionsData={filteredSessions}
          selectedClasse={selectedClasse}
          onSessionClick={setSelectedSession}
        />
      )}

      <Dialog open={Boolean(selectedSession)} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSession?.subject_name ?? "Séance"}</DialogTitle>
            <DialogDescription>Détails de la séance sélectionnée.</DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Classe</dt><dd className="font-medium">{selectedSession.classe_name ?? "—"}</dd>
              <dt className="text-muted-foreground">Jour</dt><dd className="font-medium">{selectedSession.day ?? "—"}</dd>
              <dt className="text-muted-foreground">Horaire</dt><dd className="font-medium">{selectedSession.start_time} – {selectedSession.end_time}</dd>
              <dt className="text-muted-foreground">Salle</dt><dd className="font-medium">{selectedSession.room_name ?? "—"}</dd>
            </dl>
          )}
        </DialogContent>
      </Dialog>

    </main>
  );
}

export default function ManageSessions() {
  return <RoleGuard role="teacher"><SessionsPage /></RoleGuard>;
}
