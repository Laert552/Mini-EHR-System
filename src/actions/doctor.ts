"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";

// ─── Get all doctors (for reception calendar dropdown) ────────────────────────
export async function getAllDoctors() {
  return prisma.doctorProfile.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { specialty: "asc" },
  });
}

// ─── Get a single doctor profile by its ID ───────────────────────────────────
export async function getDoctorById(doctorId: string) {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    include: { user: { select: { email: true } } },
  });

  if (!doctor) throw new Error("Doctor not found");
  return doctor;
}

// ─── Get doctor profile by userId ────────────────────────────────────────────
export async function getDoctorByUserId(userId: string) {
  const doctor = await prisma.doctorProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true } } },
  });

  if (!doctor) throw new Error("Doctor profile not found");
  return doctor;
}

// ─── Get today's patient queue for a doctor ──────────────────────────────────
// Used in Block 2 → Section 2.1 (Live Queue)
export async function getTodayQueue(doctorId: string) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: startOfDay, lte: endOfDay },
      status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED] },
    },
    include: {
      patient: { include: { user: { select: { email: true } } } },
    },
    orderBy: { date: "asc" },
  });
}
