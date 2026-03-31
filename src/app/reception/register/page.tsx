'use client';

import { useState, useEffect } from 'react';
import { registerPatient } from '@/actions/auth'; 
import { getAllDoctors } from '@/actions/doctor';
import { createAppointment } from '@/actions/appointment';

type Doctor = {
  id: string;
  specialty: string;
  user: { email: string };
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-semibold text-slate-700">{label}</label>
    {children}
  </div>
);

const inputCls =
  'w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';

export default function RegisterPatient() {
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: '',
    gender: 'MALE',
    doctorId: '',
  });

  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await getAllDoctors();
        setDoctors(data as any);
      } catch {
        console.error('Բժիշկների բեռնման սխալ');
      }
    }
    loadDoctors();
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!formData.doctorId) {
      setError('Խնդրում ենք ընտրել բժշկին');
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(),
        gender: formData.gender as 'MALE' | 'FEMALE',
      };

      const newUser = await registerPatient(dataToSend);

      if (formData.doctorId && newUser.patientProfile?.id) {
        await createAppointment({
          doctorId: formData.doctorId,
          patientId: newUser.patientProfile.id,
          date: new Date().toISOString(),
        });
      }

      setSuccess('Պացիենտը հաջողությամբ գրանցվեց համակարգում։');
      setFormData({ fullName: '', email: '', password: '', birthDate: '', gender: 'MALE', doctorId: '' });
    } catch (err: any) {
      setError(err?.message ?? 'Սխալ տեղի ունեցավ գրանցման ժամանակ։');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Նոր Պացիենտի Գրանցում</h1>
        <p className="mt-1 text-sm text-slate-500">Լրացրեք բոլոր դաշտերը նոր պացիենտ ավելացնելու համար</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Section: Personal info */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Անձնական Տվյալներ</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Ամբողջական Անուն">
            <input required value={formData.fullName} onChange={set('fullName')}
              type="text" placeholder="Արամ Խաչատրյան" className={inputCls} />
          </Field>
          <Field label="Ծննդյան ամսաթիվ">
            <input required value={formData.birthDate} onChange={set('birthDate')}
              type="date" className={inputCls} />
          </Field>
          <Field label="Սեռ">
            <select value={formData.gender} onChange={set('gender')} className={inputCls}>
              <option value="MALE">Արական</option>
              <option value="FEMALE">Իգական</option>
            </select>
          </Field>
        </div>

        {/* Section: Account */}
        <div className="px-6 py-4 border-y border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Մուտքի Տվյալներ</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Էլ. Փոստ (Լոգին)">
            <input required value={formData.email} onChange={set('email')}
              type="email" placeholder="aram@example.com" className={inputCls} />
          </Field>
          <Field label="Գաղտնաբառ">
            <input required value={formData.password} onChange={set('password')}
              type="password" placeholder="********" className={inputCls} />
          </Field>
        </div>

        {/* Section: Assign doctor */}
        <div className="px-6 py-4 border-y border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Բժշկի Նշանակում</h2>
        </div>
        <div className="p-6">
          <Field label="Ընտրեք Բժշկին">
            <select required value={formData.doctorId} onChange={set('doctorId')} className={inputCls}>
              <option value="">— Ընտրել բժիշկ —</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.specialty} — {doc.user?.email}
                </option>
              ))}
            </select>
          </Field>
          {doctors.length === 0 && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              ⚠ Բժիշկների ցուցակը դատարկ է
            </p>
          )}
        </div>

        {/* Alerts */}
        {success && (
          <div className="mx-6 mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="mx-6 mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            ✕ {error}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Գրանցվում է...
              </>
            ) : (
              'Գրանցել Պացիենտին'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
