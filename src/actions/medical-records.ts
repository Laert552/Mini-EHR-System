"use server";

import { prisma } from "@/lib/prisma";

// ─── Create a new EMR record for a patient visit ──────────────────────────────
// Used in Block 2 → Section 2.2 (EMR)
export async function createMedicalRecord(data: {
  patientId: string;
  doctorId: string;
  notes: string;
}) {
  return prisma.medicalRecord.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      notes: data.notes,
    },
  });
}

// ─── Get all records for a patient (full EMR history) ────────────────────────
export async function getMedicalRecordsByPatient(patientId: string) {
  return prisma.medicalRecord.findMany({
    where: { patientId },
    include: {
      diagnoses: { orderBy: { createdAt: "asc" } },
      prescriptions: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── Get a single record with all details ────────────────────────────────────
export async function getMedicalRecordById(recordId: string) {
  const record = await prisma.medicalRecord.findUnique({
    where: { id: recordId },
    include: {
      diagnoses: { orderBy: { createdAt: "asc" } },
      prescriptions: { orderBy: { createdAt: "asc" } },
      patient: true,
    },
  });

  if (!record) throw new Error("Medical record not found");
  return record;
}

// ─── Update notes on an existing record ──────────────────────────────────────
export async function updateMedicalRecordNotes(recordId: string, notes: string) {
  return prisma.medicalRecord.update({
    where: { id: recordId },
    data: { notes },
  });
}