"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

export async function uploadLabResult(
  patientId: string,
  title: string,
  formData: FormData,
) {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are allowed");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File must be less than 10MB");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${patientId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { data, error } = await supabaseAdmin.storage
    .from("lab-results")
    .upload(filename, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: urlData } = supabaseAdmin.storage
    .from("lab-results")
    .getPublicUrl(data.path);

  return prisma.labResult.create({
    data: {
      patientId,
      title,
      fileUrl: urlData.publicUrl,
    },
  });
}

export async function getLabResultsByPatient(patientId: string) {
  return prisma.labResult.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteLabResult(labResultId: string) {
  return prisma.labResult.delete({ where: { id: labResultId } });
}
