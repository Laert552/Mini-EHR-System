// app/patient/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
// Ներմուծում ենք Section 3.1-ի ֆունկցիաները քո աղյուսակից
import { getPatientByUserId } from '@/actions/patient';
import { getAppointmentsByPatient } from '@/actions/appointment';

export default function PatientProfilePage() {
    const [patient, setPatient] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Քանի որ մուտքագրման (Login) համակարգը դեռ չի տալիս իրական մարդու ID-ն,
    // ժամանակավորապես դնում ենք ֆեյք ID, որպեսզի էջն աշխատի առանց error-ի
    const tempUserId = "temp-user-id-123";

    useEffect(() => {
        async function loadPatientData() {
            try {
                // 1. Բերում ենք պացիենտի պրոֆիլը (getPatientByUserId)
                const patientData = await getPatientByUserId(tempUserId);
                
                if (patientData) {
                    setPatient(patientData);
                    
                    // 2. Բերում ենք պացիենտի այցերը (getAppointmentsByPatient)
                    // (Ենթադրում ենք, որ ֆունկցիան ստանում է պացիենտի բուն ID-ն)
                    const apps = await getAppointmentsByPatient(patientData.id);
                    if (apps) setAppointments(apps);
                }
            } catch (error) {
                console.error("Տվյալների բեռնման սխալ:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        loadPatientData();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-slate-500">Բեռնվում են պրոֆիլի տվյալները...</div>;

    if (!patient) return <div className="p-8 text-center text-red-500">Պացիենտը չի գտնվել:</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-6">
            
            {/* ՊՐՈՖԻԼԻ ԳԼԽԱՎՈՐ ՄԱՍ */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    {patient.fullName ? patient.fullName.charAt(0) : 'Պ'}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-slate-800">{patient.fullName}</h1>
                    <div className="mt-2 text-slate-500 space-y-1">
                        <p>📧 Էլ. փոստ՝ {patient.email}</p>
                        <p>🎂 Ծննդյան ամսաթիվ՝ {new Date(patient.birthDate).toLocaleDateString('hy-AM')}</p>
                        <p>👤 Սեռ՝ {patient.gender === 'MALE' ? 'Արական' : 'Իգական'}</p>
                    </div>
                </div>
            </div>

            {/* ԱՅՑԵՐԻ ՑԱՆԿ */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Իմ Այցերը</h2>
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {appointments.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            Դուք դեռ գրանցված այցեր չունեք:
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {appointments.map((app) => (
                                <div key={app.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-lg text-slate-800">
                                                {new Date(app.date).toLocaleDateString('hy-AM')} | {app.time}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                                                ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                                                  app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                                                  'bg-yellow-100 text-yellow-700'}`}>
                                                {app.status === 'PENDING' ? 'Սպասվող' : app.status === 'CONFIRMED' ? 'Հաստատված' : 'Չեղարկված'}
                                            </span>
                                        </div>
                                        <p className="text-slate-600">Բժիշկ՝ <span className="font-medium">{app.doctor?.fullName || 'Չկա տվյալ'}</span></p>
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