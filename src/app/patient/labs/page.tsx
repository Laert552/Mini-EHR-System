import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPatientByUserId } from "@/actions/patient";
import { getLabResultsByPatient } from "@/actions/lab-results";
import LabsClient from "./LabsClient";

export default async function LabResultsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "PATIENT") redirect("/");

  const patient = await getPatientByUserId(session.user.id);
  if (!patient) {
    return (
      <div className="p-8 text-center text-red-500">
        Профиль пациента не найден.
      </div>
    );
  }

  const results = await getLabResultsByPatient(patient.id);

  return <LabsClient patientId={patient.id} initialResults={results} />;
}
