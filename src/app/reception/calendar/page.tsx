// app/reception/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAllDoctors } from '@/actions/doctor';
import { getAllPatients } from '@/actions/patient';
import {
  createAppointment,
  getAppointmentsByDate,
  updateAppointmentStatus,
} from '@/actions/appointment';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Սպասվող',
  CONFIRMED: 'Հաստատված',
  CANCELLED: 'Չեղարկված',
};
const STATUS_CLS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition text-sm';

export default function CalendarPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    async function loadDropdownData() {
      const [docsRes, patsRes] = await Promise.allSettled([getAllDoctors(), getAllPatients()]);

      if (docsRes.status === 'fulfilled') {
        setDoctors(docsRes.value ?? []);
      } else {
        console.error('Բժիշկների բեռնման սխալ:', docsRes.reason);
      }

      if (patsRes.status === 'fulfilled') {
        setPatients(patsRes.value ?? []);
      } else {
        console.error('Պացիենտների բեռնման սխալ:', patsRes.reason);
      }
    }
    loadDropdownData();
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      if (!scheduleDate) return;
      try {
        const schedule = await getAppointmentsByDate(scheduleDate);
        setAppointments(schedule ?? []);
      } catch {
        console.error('Օրացույցի բեռնման սխալ');
      }
    }
    loadSchedule();
  }, [scheduleDate]);

  const set = (key: string) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
    setAppointmentData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const combined = appointmentData.time
        ? `${appointmentData.date}T${appointmentData.time}`
        : appointmentData.date;
      await createAppointment({
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        date: new Date(combined).toISOString(),
      });
      setAppointmentData({ doctorId: '', patientId: '', date: '', time: '' });
      setScheduleDate(appointmentData.date);
    } catch {
      alert('Սխալ այցի գրանցման ժամանակ։');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'CONFIRMED' | 'CANCELLED') => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch {
      alert('Չհաջողվեց փոխել կարգավիճակը:');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Օրացույց և Այցեր</h1>
          <p className="text-sm text-slate-500 mt-0.5">Կառավարեք բժշկական այցերը</p>
        </div>
        <span
          suppressHydrationWarning
          className="text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
        >
          {scheduleDate}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── LEFT: Book new appointment ── */}
        <div className="xl:col-span-1">
          <form
            onSubmit={handleBookAppointment}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-6 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <h2 className="font-semibold text-slate-800 text-sm uppercase tracking-wide">Գրանցել Նոր Այց</h2>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Բժիշկ</label>
                <select required value={appointmentData.doctorId} onChange={set('doctorId')} className={inputCls}>
                  <option value="">— Ընտրել բժիշկ —</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.specialty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Պացիենտ</label>
                <select required value={appointmentData.patientId} onChange={set('patientId')} className={inputCls}>
                  <option value="">— Ընտրել պացիենտ —</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ամսաթիվ</label>
                  <input required type="date" value={appointmentData.date} onChange={set('date')} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Ժամ</label>
                  <input required type="time" value={appointmentData.time} onChange={set('time')} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Գրանցվում է...
                  </>
                ) : '+ Գրանցել Այցը'}
              </button>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Schedule view ── */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header row with date picker */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-800">Ժամանակացույց</h2>
                <p className="text-xs text-slate-500 mt-0.5">{appointments.length} այց</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Ամսաթիվ</span>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Appointment list */}
            {appointments.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-slate-400 gap-3">
                <span className="text-5xl">📭</span>
                <p className="text-sm font-medium">Այս օրվա համար գրանցված այցեր չկան</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {appointments.map((app) => (
                  <div key={app.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 transition">

                    {/* Time badge */}
                    <div className="flex-shrink-0 w-16 text-center">
                      <span suppressHydrationWarning className="text-base font-bold text-slate-800 tabular-nums">
                        {new Date(app.date).toLocaleTimeString('hy-AM', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 truncate">{app.patient?.fullName}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CLS[app.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {STATUS_LABEL[app.status] ?? app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Բժիշկ՝ {app.doctor?.specialty}</p>
                    </div>

                    {/* Action buttons */}
                    {app.status === 'PENDING' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                          className="px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition"
                        >
                          ✓ Հաստատել
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                          className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                        >
                          ✕ Չեղարկել
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
