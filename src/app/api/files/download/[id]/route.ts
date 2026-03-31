import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase";

// Extracts the storage path from a Supabase public URL
function extractStoragePath(publicUrl: string): string | null {
  const marker = "/storage/v1/object/public/lab-results/";
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  // Decode in case path contains encoded characters (e.g. Armenian filenames)
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  // Not authenticated — send to login
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const { id } = await context.params;

  const labResult = await prisma.labResult.findUnique({
    where: { id },
    select: { id: true, patientId: true, fileUrl: true, title: true },
  });

  if (!labResult) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Access control
  const role = (session.user as { role?: string }).role;
  let allowed = false;

  if (role === "PATIENT") {
    // Patient can only download their own files
    const patient = await prisma.patientProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    allowed = !!patient && patient.id === labResult.patientId;
  } else if (role === "DOCTOR" || role === "ADMIN") {
    // Any authenticated doctor or admin can download
    allowed = true;
  }

  if (!allowed) {
    return new NextResponse("Access denied", { status: 403 });
  }

  // Get storage path from the saved public URL
  const storagePath = extractStoragePath(labResult.fileUrl);
  if (!storagePath) {
    return new NextResponse("File path invalid", { status: 422 });
  }

  // Generate a short-lived signed URL (60 seconds)
  const { data, error } = await supabaseAdmin.storage
    .from("lab-results")
    .createSignedUrl(storagePath, 60);

  if (error || !data?.signedUrl) {
    console.error("Signed URL error:", error);
    return new NextResponse("Could not generate download link", { status: 500 });
  }

  // Fetch the actual file bytes from Supabase
  const fileRes = await fetch(data.signedUrl);
  if (!fileRes.ok) {
    return new NextResponse("File fetch failed", { status: 502 });
  }

  const buffer = await fileRes.arrayBuffer();

  // Safe filename for Content-Disposition
  const rawName = `${labResult.title || "lab-result"}.pdf`;
  const encodedName = encodeURIComponent(rawName);

  // Return file bytes directly — browser will download, not open
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodedName}`,
      "Content-Length": buffer.byteLength.toString(),
      "Cache-Control": "no-store",
    },
  });
}
