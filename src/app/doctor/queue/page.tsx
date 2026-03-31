'use client';

import { useState, useEffect } from 'react';
import { getAppointmentsByDate } from '@/actions/appointment';
import Link from 'next/link';

function fmt(date: string | Date) {
  return new Date(date).toLocaleTimeString('hy-AM', { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
      {initials}
    </div>
  );
}

export default function DoctorQueuePage() {
  const [queueList, setQueueList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await getAppointmentsByDate(today);
        if (data) setQueueList(data);
      } catch {
        console.error('Հերթի բեռնման սխալ');
      } finally {
        setIsLoading(false);
      }
    }
    loadQueue();
  }, []);

  const currentPatient = queueList.length > 0 ? queueList[0] : null;
  const waitingPatients = queueList.length > 1 ? queueList.slice(1) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-500">
        <span className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        Բեռնվում է...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Օրվա Հերթ</h1>
          <p className="text-sm text-slate-500 mt-0.5">Ընթացիկ պացիենտ + սպասող ցուցակ</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 text-sm font-semibold">
          {new Date().toLocaleDateString('hy-AM', { weekday: 'short', day: 'numeric', month: 'long' })}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ընդամենը', value: queueList.length, color: 'text-slate-700' },
          { label: 'Ընթացիկ', value: currentPatient ? 1 : 0, color: 'text-teal-600' },
          { label: 'Սպասում են', value: waitingPatients.length, color: 'text-amber-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Current patient card */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-teal-600">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Ընթացիկ Պացիենտ</h2>
          </div>

          <div className="p-6 flex flex-col items-center text-center space-y-4">
            {currentPatient ? (
              <>
                <div className="w-20 h-20 rounded-full bg-teal-50 border-4 border-teal-200 flex items-center justify-center text-teal-700 font-extrabold text-2xl">
                  {currentPatient.patient?.fullName?.charAt(0) ?? '?'}
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900">{currentPatient.patient?.fullName}</p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Ժամ՝ <span className="font-semibold text-teal-600">{fmt(currentPatient.date)}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    #{currentPatient.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <Link
                  href={`/doctor/emr/${currentPatient.patientId}`}
                  className="w-full py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition text-center block"
                >
                  Բացել EMR Քարտը →
                </Link>
              </>
            ) : (
              <div className="py-10 flex flex-col items-center gap-3 text-slate-400">
                <span className="text-5xl">🎉</span>
                <p className="text-sm font-medium">Հերթ դատարկ է</p>
              </div>
            )}
          </div>
        </div>

        {/* Waiting list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Սպասում են</h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {waitingPatients.length} հոգի
            </span>
          </div>

          {waitingPatients.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-slate-400">
              <span className="text-4xl">✅</span>
              <p className="text-sm font-medium">Սպասող պացիենտ չկա</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {waitingPatients.map((appt, idx) => (
                <div
                  key={appt.id}
                  className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 2}
                    </span>
                    <Avatar name={appt.patient?.fullName ?? '?'} />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{appt.patient?.fullName}</p>
                      <p className="text-xs text-slate-500">{fmt(appt.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Սպասում է
                    </span>
                    <Link
                      href={`/doctor/emr/${appt.patientId}`}
                      className="text-teal-600 hover:text-teal-800 text-xs font-semibold"
                    >
                      EMR →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
