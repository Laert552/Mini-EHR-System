"use server";

import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";

// ─── Book a new appointment (used by reception) ───────────────────────────────
export async function createAppointment(data: {
  doctorId: string;
  patientId: string;
  date: string; // ISO string, e.g. "2025-04-10T09:00:00"
}) {
  return prisma.appointment.create({
    data: {
      doctorId: data.doctorId,
      patientId: data.patientId,
      date: new Date(data.date),
      status: AppointmentStatus.PENDING,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });
}

// ─── Update appointment status (confirm / cancel) ─────────────────────────────
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  return prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
  });
}

// ─── Get all appointments for a specific date (reception calendar view) ───────
export async function getAppointmentsByDate(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: { date: { gte: start, lte: end } },
    include: {
      doctor: { include: { user: { select: { email: true } } } },
      patient: true,
    },
    orderBy: { date: "asc" },
  });
}

// ─── Get all appointments for a doctor (optionally filtered by date) ──────────
export async function getAppointmentsByDoctor(doctorId: string, date?: string) {
  const dateFilter = date
    ? (() => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return { gte: start, lte: end };
      })()
    : undefined;

  return prisma.appointment.findMany({
    where: {
      doctorId,
      ...(dateFilter && { date: dateFilter }),
    },
    include: {
      patient: { include: { user: { select: { email: true } } } },
    },
    orderBy: { date: "asc" },
  });
}

// ─── Get all appointments for a patient ──────────────────────────────────────
// Used in Block 3 → Section 3.1 (My data)
export async function getAppointmentsByPatient(patientId: string) {
  return prisma.appointment.findMany({
    where: { patientId },
    include: {
      doctor: { include: { user: { select: { email: true } } } },
    },
    orderBy: { date: "desc" },
  });
}

// ─── Get all doctors with their appointments on a date (for calendar grid) ────
// Used in Block 1 → Section 1.2 (Calendar)
export async function getDoctorScheduleByDate(date: string) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return prisma.doctorProfile.findMany({
    include: {
      user: { select: { email: true } },
      appointments: {
        where: { date: { gte: start, lte: end } },
        include: { patient: true },
        orderBy: { date: "asc" },
      },
    },
  });
}
