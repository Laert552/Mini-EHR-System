"use server";

// Authentication-related server actions
"use server";

import { prisma } from "@/lib/prisma";
import { Gender, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// ─── Register a new PATIENT user + profile ───────────────────────────────────
export async function registerPatient(data: {
  email: string;
  password: string;
  fullName: string;
  birthDate: string; // ISO string
  gender: Gender;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      role: Role.PATIENT,
      patientProfile: {
        create: {
          fullName: data.fullName,
          birthDate: new Date(data.birthDate),
          gender: data.gender,
        },
      },
    },
    include: { patientProfile: true },
  });

  return user;
}

// ─── Register a new DOCTOR user + profile ────────────────────────────────────
export async function registerDoctor(data: {
  email: string;
  password: string;
  specialty: string;
  experience: number;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      role: Role.DOCTOR,
      doctorProfile: {
        create: {
          specialty: data.specialty,
          experience: data.experience,
        },
      },
    },
    include: { doctorProfile: true },
  });

  return user;
}
