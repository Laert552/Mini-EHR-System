import { getAllPatients } from "@/actions/patient";
import Link from "next/link";

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center shrink-0">
      {letters}
    </div>
  );
}

export default async function EMRIndexPage() {
  const patients = await getAllPatients();

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Էլ․ Բժշկական Քարտ (EMR)</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ընտրեք պացիենտին՝ քարտը բացելու համար</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold">
          {patients.length} պացիենտ
        </span>
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Պացիենտների ցուցակ</h2>
        </div>

        {patients.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
            <span className="text-5xl">🗂️</span>
            <p className="text-sm font-medium">Պացիենտներ չկան</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {patients.map((p, idx) => (
              <div
                key={p.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-400 w-6 shrink-0">{idx + 1}</span>
                  <Initials name={p.fullName} />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{p.fullName}</p>
                    <p className="text-xs text-slate-500 truncate">{p.user?.email}</p>
                  </div>
                </div>

                <Link
                  href={`/doctor/emr/${p.id}`}
                  className="shrink-0 ml-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition group-hover:shadow-sm"
                >
                  Բացել EMR
                  <span className="text-teal-200">→</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
