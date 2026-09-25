"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Connect_MyAssessments } from "@/components/Api/teacher/Enseignement";
import { getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export function DeleteDialog({ exam, open, onOpenChange, onDeleted }) {
  const [saving, setSaving] = useState(false);
  if (!exam) return null;
  const remove = async () => {
    setSaving(true);
    try { await Connect_MyAssessments.deleteExam(exam.id); toast.success("Examen supprimé"); onOpenChange(false); onDeleted(); }
    catch (error) { toast.error("Impossible de supprimer l'examen", { description: getApiErrorMessage(error) }); }
    finally { setSaving(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Supprimer l'examen</DialogTitle><DialogDescription>Supprimer « {exam.name} » ? Les notes associées ne seront plus accessibles.</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" disabled={saving}>Annuler</Button>} /><Button variant="destructive" disabled={saving} onClick={remove}>{saving ? "Suppression..." : "Supprimer"}</Button></DialogFooter></DialogContent></Dialog>;
}
