"use server";

import { prisma } from "@/lib/prisma";


// ─── Add a diagnosis to an existing medical record ───────────────────────────
// Used in Block 2 → Section 2.2 (EMR)
export async function addDiagnosis(data: {
  recordId: string;
  title: string;
  description: string;
}) {
  return prisma.diagnosis.create({
    data: {
      recordId: data.recordId,
      title: data.title,
      description: data.description,
    },
  });
}

// ─── Delete a diagnosis ───────────────────────────────────────────────────────
export async function deleteDiagnosis(diagnosisId: string) {
  return prisma.diagnosis.delete({ where: { id: diagnosisId } });
}

// ─── Get all diagnoses for a record ──────────────────────────────────────────
export async function getDiagnosesByRecord(recordId: string) {
  return prisma.diagnosis.findMany({
    where: { recordId },
    orderBy: { createdAt: "asc" },
  });
}