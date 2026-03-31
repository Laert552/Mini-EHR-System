import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPatientByUserId } from "@/actions/patient";
import { getAppointmentsByPatient } from "@/actions/appointment";
import { getLabResultsByPatient } from "@/actions/lab-results";
import MedicalRecordCard from "./MedicalRecordCard";

export default async function PatientProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as { role?: string }).role !== "PATIENT") redirect("/");

  const patient = await getPatientByUserId(session.user.id);
  if (!patient) {
    return (
      <div className="p-8 text-center text-red-500">
        Պացիենտի պրոֆիլը չի գտնվել։
      </div>
    );
  }

  const [appointments, labResults] = await Promise.all([
    getAppointmentsByPatient(patient.id),
    getLabResultsByPatient(patient.id),
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">

      {/* Profile card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
          {patient.fullName ? patient.fullName.charAt(0) : "P"}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">{patient.fullName}</h1>
          <div className="mt-2 text-slate-500 space-y-1">
            <p>📧 Email: {patient.user?.email || "—"}</p>
            <p>
              🎂 Ծննդյան ամսաթիվ:{" "}
              {new Date(patient.birthDate).toLocaleDateString("ru-RU")}
            </p>
            <p>
              👤 Սեռ:{" "}
              {patient.gender === "MALE"
                ? "Արական"
                : patient.gender === "FEMALE"
                  ? "Իգական"
                  : "Այլ"}
            </p>
          </div>
        </div>
      </div>

      {/* Medical records */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Բժշկական քարտ</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {patient.medicalRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Բժշկական քարտը դատարկ է։ Կապվեք ձեր բժշկի հետ՝ առաջին գրառումը կատարելու համար։
            </div>
          ) : (
            <div>
              {patient.medicalRecords.map((record) => (
                <MedicalRecordCard key={record.id} record={record} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lab results */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Իմ անալիզները</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {labResults.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Անալիզներ դեռ չկան։
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {labResults.map((res) => (
                <div key={res.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">{res.title}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(res.createdAt).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <a
                    href={`/api/files/download/${res.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    Ներբեռնել PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointments */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Իմ այցերը</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              Այցերի պատմությունը դատարկ է։
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {appointments.map((app) => (
                <div key={app.id} className="p-6">
                  <p className="font-semibold text-slate-800">
                    {new Date(app.date).toLocaleDateString("ru-RU")}
                  </p>
                  <p className="text-sm text-slate-600">
                    Կարգավիճակ: {app.status} | Բժիշկ: {app.doctor?.specialty || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
