// app/doctor/emr/[patientId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { getMedicalRecordsByPatient, createMedicalRecord } from '@/actions/medical-records';
import { addDiagnosis, deleteDiagnosis } from '@/actions/diagnosis';
import { addPrescription, deletePrescription } from '@/actions/prescription';

export default function EMRPage() {
    const params = useParams();
    const patientId = params.patientId as string;

    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newRecordNotes, setNewRecordNotes] = useState('');
    const [diagnosisName, setDiagnosisName] = useState('');
    const [prescriptionName, setPrescriptionName] = useState('');

    // 1. Բեռնում ենք պացիենտի պատմությունը (ՈՒՂՂՎԱԾ Է՝ ուղարկում ենք ուղիղ տեքստ)
    const loadEMRHistory = async () => {
        setIsLoading(true);
        try {
            const history = await getMedicalRecordsByPatient(patientId);
            if (history) setRecords(history);
        } catch (error) {
            console.error("EMR բեռնման սխալ:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) loadEMRHistory();
    }, [patientId]);

    // 2. Նոր գրառում (այցի նկարագրություն)
    const handleCreateRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // ՈՒՂՂՎԱԾ Է՝ ավելացրել ենք doctorId ժամանակավոր արժեքով
            await createMedicalRecord({ 
                patientId, 
                doctorId: "temp-doc-id", 
                notes: newRecordNotes 
            });
            setNewRecordNotes('');
            await loadEMRHistory(); 
        } catch (error) {
            alert('Սխալ գրառման ժամանակ։');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Ախտորոշում ավելացնել և ջնջել
    const handleAddDiagnosis = async (recordId: string) => {
        if (!diagnosisName.trim()) return;
        try {
            // ՈՒՂՂՎԱԾ Է՝ ավելացրել ենք description դաշտը
            await addDiagnosis({ 
                recordId, 
                title: diagnosisName, 
                description: "Առանց նկարագրության" 
            });
            setDiagnosisName('');
            await loadEMRHistory();
        } catch (error) {
            alert('Չհաջողվեց ավելացնել ախտորոշումը։');
        }
    };

    const handleDeleteDiagnosis = async (diagnosisId: string) => {
        try {
            await deleteDiagnosis(diagnosisId);
            await loadEMRHistory();
        } catch (error) {
            alert('Չհաջողվեց ջնջել ախտորոշումը։');
        }
    };

    // 4. Դեղատոմս ավելացնել և ջնջել
    const handleAddPrescription = async (recordId: string) => {
        if (!prescriptionName.trim()) return;
        try {
            await addPrescription({ recordId, medication: prescriptionName, dosage: "Ըստ նշանակման" });
            setPrescriptionName('');
            await loadEMRHistory();
        } catch (error) {
            alert('Չհաջողվեց ավելացնել դեղատոմսը։');
        }
    };

    const handleDeletePrescription = async (prescriptionId: string) => {
        try {
            await deletePrescription(prescriptionId);
            await loadEMRHistory();
        } catch (error) {
            alert('Չհաջողվեց ջնջել դեղատոմսը։');
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Բեռնվում է պացիենտի քարտը...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6">
            <div className="bg-slate-800 rounded-xl p-6 text-white shadow-md">
                <h1 className="text-2xl font-bold mb-1">Էլեկտրոնային Բժշկական Քարտ (EMR)</h1>
                <p className="text-slate-300">Պացիենտի ID: {patientId.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ՁԱԽ ԿՈՂՄ: Նոր Գրառում */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleCreateRecord} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Նոր Այցի Գրառում</h2>
                        <textarea 
                            required
                            rows={4}
                            value={newRecordNotes}
                            onChange={(e) => setNewRecordNotes(e.target.value)}
                            placeholder="Բժշկի նշումներ..."
                            className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 mb-4 resize-none"
                        ></textarea>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 disabled:bg-teal-400"
                        >
                            {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել Գրառումը'}
                        </button>
                    </form>
                </div>

                {/* ԱՋ ԿՈՂՄ: Պատմություն */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-800">Այցերի Պատմություն</h2>
                    {records.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                            Այս պացիենտը դեռ պատմություն չունի:
                        </div>
                    ) : (
                        records.map((record) => (
                            <div key={record.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                                <div className="border-b border-slate-100 pb-4 mb-4">
                                    <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                        Ամսաթիվ: {new Date(record.createdAt).toLocaleDateString('hy-AM')}
                                    </span>
                                    <p className="mt-4 text-slate-700 whitespace-pre-wrap">{record.notes}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Ախտորոշումներ */}
                                    <div>
                                        <h3 className="font-semibold text-slate-800 mb-3">🔬 Ախտորոշումներ</h3>
                                        <ul className="space-y-2 mb-4">
                                            {record.diagnoses?.map((diag: any) => (
                                                <li key={diag.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded border">
                                                    <span>{diag.title}</span>
                                                    <button onClick={() => handleDeleteDiagnosis(diag.id)} className="text-red-500">❌</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={diagnosisName}
                                                onChange={(e) => setDiagnosisName(e.target.value)}
                                                placeholder="Նոր..." 
                                                className="flex-1 border p-2 rounded text-sm outline-none"
                                            />
                                            <button onClick={() => handleAddDiagnosis(record.id)} className="bg-slate-800 text-white px-3 rounded text-sm">Ավելացնել</button>
                                        </div>
                                    </div>

                                    {/* Դեղատոմսեր */}
                                    <div>
                                        <h3 className="font-semibold text-slate-800 mb-3">💊 Դեղատոմսեր</h3>
                                        <ul className="space-y-2 mb-4">
                                            {record.prescriptions?.map((presc: any) => (
                                                <li key={presc.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded border">
                                                    <span>{presc.medication}</span>
                                                    <button onClick={() => handleDeletePrescription(presc.id)} className="text-red-500">❌</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={prescriptionName}
                                                onChange={(e) => setPrescriptionName(e.target.value)}
                                                placeholder="Նշանակել..." 
                                                className="flex-1 border p-2 rounded text-sm outline-none"
                                            />
                                            <button onClick={() => handleAddPrescription(record.id)} className="bg-slate-800 text-white px-3 rounded text-sm">Ավելացնել</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}