"use server";

import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";

// Patient-related server actions

// ─── Get all patients (reception list) ───────────────────────────────────────
export async function getAllPatients() {
  return prisma.patientProfile.findMany({
    orderBy: { fullName: "asc" },
    include: { user: { select: { email: true } } },
  });
}

// ─── Get a single patient profile by its ID ──────────────────────────────────
export async function getPatientById(patientId: string) {
  const patient = await prisma.patientProfile.findUnique({
    where: { id: patientId },
    include: {
      user: { select: { email: true } },
      appointments: {
        include: { doctor: true },
        orderBy: { date: "desc" },
      },
      medicalRecords: {
        include: { diagnoses: true, prescriptions: true },
        orderBy: { createdAt: "desc" },
      },
      labResults: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) throw new Error("Patient not found");
  return patient;
}

// ─── Get patient profile by userId (for the patient's own portal) ─────────────
export async function getPatientByUserId(userId: string) {
  const patient = await prisma.patientProfile.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true } },
      appointments: {
        include: { doctor: true },
        orderBy: { date: "desc" },
      },
      medicalRecords: {
        include: { diagnoses: true, prescriptions: true },
        orderBy: { createdAt: "desc" },
      },
      labResults: { orderBy: { createdAt: "desc" } },
    },
  });
  // Return null for missing profile so UI can handle "not found"
  // without turning it into a server 500.
  return patient;
}

// ─── Update patient profile (used by reception or patient) ───────────────────
export async function updatePatientProfile(
  patientId: string,
  data: {
    fullName?: string;
    birthDate?: string;
    gender?: Gender;
  },
) {
  return prisma.patientProfile.update({
    where: { id: patientId },
    data: {
      ...(data.fullName && { fullName: data.fullName }),
      ...(data.birthDate && { birthDate: new Date(data.birthDate) }),
      ...(data.gender && { gender: data.gender }),
    },
  });
}
