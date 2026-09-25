"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Connect_MyAssessments } from "@/components/Api/teacher/Enseignement";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const emptyGrade = { exam_id: "", user_id: "", note: "", appreciation: "" };

export function GradeSheet({ grade, open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(emptyGrade);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(grade ? { exam_id: String(grade.exam_id), user_id: String(grade.user_id), note: String(grade.note ?? ""), appreciation: grade.appreciation ?? "" } : emptyGrade);
    if (!grade) Connect_MyAssessments.getMyExams({ per_page: 100 }).then((response) => setExams(response.data?.data?.data ?? [])).catch(() => setExams([]));
  }, [grade, open]);

  useEffect(() => {
    if (grade || !form.exam_id) { if (!grade) setStudents([]); return; }
    Connect_MyAssessments.getExamStudents(form.exam_id).then((response) => setStudents(response.data?.data?.students ?? [])).catch(() => setStudents([]));
  }, [form.exam_id, grade]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (form.note === "" || Number(form.note) < 0 || Number(form.note) > 20 || (!grade && (!form.exam_id || !form.user_id))) {
      toast.error("Saisissez une note entre 0 et 20 et sélectionnez l'examen et l'élève.");
      return;
    }
    setSaving(true);
    try {
      const common = { note: Number(form.note), appreciation: form.appreciation || "" };
      if (grade) await Connect_MyAssessments.updateGrade(grade.id, common);
      else await Connect_MyAssessments.createGrade({ ...common, exam_id: Number(form.exam_id), user_id: Number(form.user_id) });
      toast.success(grade ? "Note mise à jour" : "Note enregistrée");
      onOpenChange(false);
      onSaved();
    } catch (error) { toast.error(grade ? "Impossible de modifier la note" : "Impossible d'enregistrer la note", { description: getApiErrorMessage(error) }); }
    finally { setSaving(false); }
  };

  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg"><SheetHeader><SheetTitle>{grade ? "Modifier la note" : "Ajouter une note"}</SheetTitle><SheetDescription>{grade ? "Modifiez la note ou l'appréciation." : "L'élève proposé appartient toujours à la classe de l'examen."}</SheetDescription></SheetHeader><form id="teacher-grade-form" onSubmit={submit} className="flex flex-col gap-5 px-4">
    {!grade && <><Field><Label>Examen</Label><Select value={form.exam_id} onValueChange={(value) => { update("exam_id", value); update("user_id", ""); }}><SelectTrigger><SelectValue placeholder="Sélectionner l'examen" /></SelectTrigger><SelectContent>{exams.map((exam) => <SelectItem key={exam.id} value={String(exam.id)}>{exam.name} — {exam.classe_name} ({exam.subject_name})</SelectItem>)}</SelectContent></Select></Field><Field><Label>Élève</Label><Select value={form.user_id} disabled={!form.exam_id} onValueChange={(value) => update("user_id", value)}><SelectTrigger><SelectValue placeholder="Sélectionner l'élève" /></SelectTrigger><SelectContent>{students.map((student) => <SelectItem key={student.id} value={String(student.id)}>{student.student_firstname} {student.student_lastname}</SelectItem>)}</SelectContent></Select></Field></>}
    {grade && <div className="rounded-md bg-muted px-3 py-2 text-sm">{grade.student_firstname} {grade.student_lastname} — {grade.exam_name}</div>}
    <Field><Label htmlFor="teacher-grade-note">Note /20</Label><Input id="teacher-grade-note" type="number" min="0" max="20" step="0.25" value={form.note} onChange={(e) => update("note", e.target.value)} /></Field>
    <Field><Label htmlFor="teacher-grade-appreciation">Appréciation</Label><Input id="teacher-grade-appreciation" value={form.appreciation} onChange={(e) => update("appreciation", e.target.value)} placeholder="Très bon travail" /></Field>
  </form><SheetFooter className="px-4"><SheetClose render={<Button variant="outline" disabled={saving}>Annuler</Button>} /><Button form="teacher-grade-form" type="submit" disabled={saving}>{saving ? "Enregistrement..." : grade ? "Enregistrer" : "Créer la note"}</Button></SheetFooter></SheetContent></Sheet>;
}
