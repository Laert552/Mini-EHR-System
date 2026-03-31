'use client';

import { useState } from 'react';

type Diagnosis = { id: string; title: string; description: string };
type Prescription = { id: string; medication: string; dosage: string };

type Props = {
  record: {
    id: string;
    notes: string;
    createdAt: Date;
    diagnoses: Diagnosis[];
    prescriptions: Prescription[];
  };
};

export default function MedicalRecordCard({ record }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition text-left"
      >
        <div className="space-y-0.5">
          <p className="text-xs text-slate-400">
            {new Date(record.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
          <p className="text-sm font-medium text-slate-800 line-clamp-1">{record.notes}</p>
          <div className="flex gap-3 text-xs text-slate-500 pt-0.5">
            <span>🔬 Ախտորոշումներ: {record.diagnoses.length}</span>
            <span>💊 Նշանակումներ: {record.prescriptions.length}</span>
          </div>
        </div>
        <span
          className="ml-4 text-slate-400 text-lg shrink-0 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-4 bg-slate-50 border-t border-slate-100">

          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Բժշկի նշանակումներ</p>
            <p className="text-sm text-slate-700 whitespace-pre-wrap">{record.notes}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">🔬 Ախտորոշումներ</p>
            {record.diagnoses.length === 0 ? (
              <p className="text-xs text-slate-400">Ախտորոշուներ չկան</p>
            ) : (
              <ul className="space-y-1.5">
                {record.diagnoses.map((d) => (
                  <li key={d.id} className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-slate-800">{d.title}</p>
                    {d.description && d.description !== 'Առանց նկարագրության' && (
                      <p className="text-xs text-slate-500 mt-0.5">{d.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">💊 Նշանակումներ</p>
            {record.prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400">Նշանակունմերը չկան</p>
            ) : (
              <ul className="space-y-1.5">
                {record.prescriptions.map((p) => (
                  <li key={p.id} className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-slate-800">{p.medication}</p>
                    <span className="text-xs text-slate-500 shrink-0">{p.dosage}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
