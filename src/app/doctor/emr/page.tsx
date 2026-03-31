'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getMedicalRecordsByPatient, createMedicalRecord } from '@/actions/medical-records';
import { getPatientByUserId } from '@/actions/patient';

export default function PatientEMRPage() {
    const params = useParams();
    const patientId = params.patientId as string;

    const [patient, setPatient] = useState<any>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                const [patientData, history] = await Promise.all([
                    getPatientByUserId(patientId), // Սա կաշխատի, եթե patientId-ն իրական է
                    getMedicalRecordsByPatient(patientId)
                ]);
                
                setPatient(patientData);
                setRecords(history || []);
            } catch (error) {
                console.error("Տվյալների բեռնման սխալ:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [patientId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!diagnosis || !notes) return alert("Խնդրում ենք լրացնել բոլոր դաշտերը");

        setIsSubmitting(true);
        try {
            await createMedicalRecord({
                patientId,
                diagnosis,
                notes,
                date: new Date().toISOString()
            } as any);
            alert("Գրառումը պահպանվեց");
            setDiagnosis('');
            setNotes('');
            const updatedHistory = await getMedicalRecordsByPatient(patientId);
            setRecords(updatedHistory || []);
        } catch (error) {
            alert("Սխալ պահպանման ժամանակ");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Բեռնվում է...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4">
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{patient?.fullName || "Պացիենտ"}</h1>
                    <p className="text-slate-500">ID: {patientId} • Էլ. փոստ՝ {patient?.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span>✍️</span> Նոր Ախտորոշում
                    </h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Ախտորոշում (ICD-10)</label>
                            <input 
                                type="text" 
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                                placeholder="Օր.՝ J06.9 Սուր վերին շնչառական վարակ" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Նշանակումներ</label>
                            <textarea 
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Գրեք բուժման ընթացքը..." 
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                            ></textarea>
                        </div>

                        <button 
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-disabled:opacity-50"
                        >
                            {isSubmitting ? "Պահպանվում է..." : "Պահպանել և Ավարտել"}
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span>🕰️</span> Բժշկական Պատմություն
                    </h2>
                    
                    <div className="space-y-4">
                        {records.length === 0 ? (
                            <p className="text-slate-400 text-center py-10">Պատմությունը դատարկ է</p>
                        ) : (
                            records.map((record) => (
                                <div key={record.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-800">{record.diagnosis}</span>
                                        <span className="text-xs text-slate-400">{new Date(record.createdAt).toLocaleDateString('hy-AM')}</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{record.notes}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}