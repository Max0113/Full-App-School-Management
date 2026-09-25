"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Connect_MyAssessments, Connect_MyInfo } from "@/components/Api/teacher/Enseignement";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const emptyExam = { name: "", type: "written", exam_date: "", teaching_subject_classe_id: "" };

export function ExamSheet({ exam, open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(emptyExam);
  const [assignments, setAssignments] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(exam ? {
      name: exam.name ?? "",
      type: exam.type ?? "written",
      exam_date: exam.exam_date ?? "",
      teaching_subject_classe_id: String(exam.teaching_subject_classe_id ?? ""),
    } : emptyExam);
    Connect_MyInfo.getMyClasses().then((response) => setAssignments(response.data?.data ?? [])).catch(() => setAssignments([]));
  }, [exam, open]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.exam_date || !form.teaching_subject_classe_id) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, teaching_subject_classe_id: Number(form.teaching_subject_classe_id) };
      if (exam) await Connect_MyAssessments.updateExam(exam.id, payload);
      else await Connect_MyAssessments.createExam(payload);
      toast.success(exam ? "Examen mis à jour" : "Examen créé");
      onOpenChange(false);
      onSaved();
    } catch (error) {
      toast.error(exam ? "Impossible de modifier l'examen" : "Impossible de créer l'examen", { description: getApiErrorMessage(error) });
    } finally { setSaving(false); }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{exam ? "Modifier l'examen" : "Ajouter un examen"}</SheetTitle>
          <SheetDescription>Choisissez l'une de vos matières et classes.</SheetDescription>
        </SheetHeader>
        <form id="teacher-exam-form" onSubmit={submit} className="flex flex-col gap-5 px-4">
          <Field><Label htmlFor="teacher-exam-name">Nom</Label><Input id="teacher-exam-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Contrôle n°1" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field><Label>Type</Label><Select value={form.type} onValueChange={(value) => update("type", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="written">Écrit</SelectItem><SelectItem value="oral">Oral</SelectItem><SelectItem value="practical">Pratique</SelectItem></SelectContent></Select></Field>
            <Field><Label htmlFor="teacher-exam-date">Date</Label><Input id="teacher-exam-date" type="date" value={form.exam_date} onChange={(e) => update("exam_date", e.target.value)} /></Field>
          </div>
          <Field><Label>Classe et matière</Label><Select value={form.teaching_subject_classe_id} onValueChange={(value) => update("teaching_subject_classe_id", value)}><SelectTrigger><SelectValue placeholder="Sélectionner un enseignement" /></SelectTrigger><SelectContent>{assignments.map((assignment) => <SelectItem key={assignment.id} value={String(assignment.id)}>{assignment.classe_name} — {assignment.subject_name}</SelectItem>)}</SelectContent></Select></Field>
        </form>
        <SheetFooter className="px-4"><SheetClose render={<Button variant="outline" disabled={saving}>Annuler</Button>} /><Button form="teacher-exam-form" type="submit" disabled={saving}>{saving ? "Enregistrement..." : exam ? "Enregistrer" : "Créer l'examen"}</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
