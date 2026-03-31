'use client';

import { useState } from 'react';
import { deleteLabResult } from '@/actions/lab-results';

type LabResult = {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: Date;
};

export default function LabsClient({
  initialResults,
}: {
  patientId: string;
  initialResults: LabResult[];
}) {
  const [results, setResults] = useState<LabResult[]>(initialResults);

  const handleDelete = async (id: string) => {
    if (!confirm('Ջնջե՞լ այս ֆայլը:')) return;
    try {
      await deleteLabResult(id);
      setResults((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert('Ջնջման սխալ։');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Իմ Անալիզները</h1>
          <p className="text-sm text-slate-500 mt-0.5">Բժշկի կողմից ուղարկված ֆայլեր</p>
        </div>
        <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
          {results.length} ֆայլ
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Իմ Ֆայլերը</h2>
        </div>

        {results.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
            <span className="text-5xl">🗃️</span>
            <p className="text-sm font-medium">Ֆայլեր դեռ չկան</p>
            <p className="text-xs">Բժիշկը դեռ ֆայլ չի ուղարկել</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {results.map((res) => (
              <div key={res.id} className="px-5 py-4 flex items-center gap-4 hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 text-xs font-bold">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{res.title || 'Անալիզի արդյունք'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(res.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <a
                    href={`/api/files/download/${res.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition"
                  >
                    Ներբեռնել
                  </a>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                  >
                    Ջնջել
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
