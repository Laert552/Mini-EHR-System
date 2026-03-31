"use server";

import { prisma } from "@/lib/prisma";

// ─── Add a prescription to an existing medical record ────────────────────────
// Used in Block 2 → Section 2.2 (EMR)
export async function addPrescription(data: {
  recordId: string;
  medication: string;
  dosage: string;
}) {
  return prisma.prescription.create({
    data: {
      recordId: data.recordId,
      medication: data.medication,
      dosage: data.dosage,
    },
  });
}

// ─── Delete a prescription ────────────────────────────────────────────────────
export async function deletePrescription(prescriptionId: string) {
  return prisma.prescription.delete({ where: { id: prescriptionId } });
}

// ─── Get all prescriptions for a record ──────────────────────────────────────
export async function getPrescriptionsByRecord(recordId: string) {
  return prisma.prescription.findMany({
    where: { recordId },
    orderBy: { createdAt: "asc" },
  });
}