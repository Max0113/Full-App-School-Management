"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Connect_MyAssessments } from "@/components/Api/teacher/Enseignement";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export function DeleteDialog({ grade, open, onOpenChange, onDeleted }) {
  const [saving, setSaving] = useState(false);
  if (!grade) return null;
  const remove = async () => { setSaving(true); try { await Connect_MyAssessments.deleteGrade(grade.id); toast.success("Note supprimée"); onOpenChange(false); onDeleted(); } catch (error) { toast.error("Impossible de supprimer la note", { description: getApiErrorMessage(error) }); } finally { setSaving(false); } };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Supprimer la note</DialogTitle><DialogDescription>Supprimer la note de {grade.student_firstname} {grade.student_lastname} pour « {grade.exam_name} » ?</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" disabled={saving}>Annuler</Button>} /><Button variant="destructive" onClick={remove} disabled={saving}>{saving ? "Suppression..." : "Supprimer"}</Button></DialogFooter></DialogContent></Dialog>;
}
