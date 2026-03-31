'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

import { getMedicalRecordsByPatient, createMedicalRecord } from '@/actions/medical-records';
import { addDiagnosis, deleteDiagnosis } from '@/actions/diagnosis';
import { addPrescription, deletePrescription } from '@/actions/prescription';
import { uploadLabResult, getLabResultsByPatient } from '@/actions/lab-results';

export default function EMRPage() {
    const params = useParams();
    const patientId = params.patientId as string;

    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newRecordNotes, setNewRecordNotes] = useState('');
    const [diagnosisName, setDiagnosisName] = useState('');
    const [prescriptionName, setPrescriptionName] = useState('');
    const [labTitle, setLabTitle] = useState('');
    const [isUploadingLab, setIsUploadingLab] = useState(false);
    const [labResults, setLabResults] = useState<any[]>([]);

    const loadEMRHistory = async () => {
        setIsLoading(true);
        try {
            const [history, labs] = await Promise.all([
                getMedicalRecordsByPatient(patientId),
                getLabResultsByPatient(patientId),
            ]);
            if (history) setRecords(history);
            if (labs) setLabResults(labs);
        } catch (error) {
            console.error("EMR բեռնման սխալ:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) loadEMRHistory();
    }, [patientId]);

    const handleCreateRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
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

    const handleAddDiagnosis = async (recordId: string) => {
        if (!diagnosisName.trim()) return;
        try {
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

    const handleUploadLab = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLab(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            await uploadLabResult(patientId, labTitle.trim() || file.name, fd);
            setLabTitle('');
            await loadEMRHistory();
            alert('Ֆայլը հաջողությամբ վերբեռնվեց։');
        } catch (error) {
            alert('Ֆայլի վերբեռնումը ձախողվեց։');
        } finally {
            setIsUploadingLab(false);
            e.target.value = '';
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Բեռնվում է պացիենտի քարտը...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
            <div className="bg-teal-500 rounded-xl p-6 text-white shadow-md">
                <h1 className="text-2xl font-bold mb-1">Էլեկտրոնային Բժշկական Քարտ (EMR)</h1>
                <p className="text-slate-300">Պացիենտի ID: {patientId.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                            className="w-full bg-teal-500 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 disabled:bg-teal-400"
                        >
                            {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել Գրառումը'}
                        </button>
                    </form>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">📎 Վերբեռնել անալիզի ֆայլ</h2>
                        <input
                            type="text"
                            value={labTitle}
                            onChange={(e) => setLabTitle(e.target.value)}
                            placeholder="Ֆայլի վերնագիր (ոչ պարտադիր)"
                            className="w-full p-2.5 border border-slate-300 rounded-lg outline-none mb-3"
                        />
                        <label className="w-full inline-flex justify-center cursor-pointer bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                            {isUploadingLab ? 'Վերբեռնվում է...' : 'Ընտրել PDF և վերբեռնել'}
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleUploadLab}
                                disabled={isUploadingLab}
                            />
                        </label>
                        <p className="text-xs text-slate-500 mt-2">Այս ֆայլը կերևա նաև պացիենտի էջում՝ ներբեռնելու համար։</p>
                    </div>
                </div>

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
                                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                                            <input 
                                                type="text" 
                                                value={diagnosisName}
                                                onChange={(e) => setDiagnosisName(e.target.value)}
                                                placeholder="Նոր..." 
                                                className="flex-1 border p-2 rounded text-sm outline-none"
                                            />
                                            <button onClick={() => handleAddDiagnosis(record.id)} className="bg-teal-500 text-white px-1 rounded text-sm">Ավելացնել</button>
                                        </div>
                                    </div>

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
                                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                                            <input 
                                                type="text" 
                                                value={prescriptionName}
                                                onChange={(e) => setPrescriptionName(e.target.value)}
                                                placeholder="Նշանակել..." 
                                                className="flex-1 border p-2 rounded text-sm outline-none"
                                            />
                                            <button onClick={() => handleAddPrescription(record.id)} className="bg-teal-500 text-white px-1 rounded text-sm">Ավելացնել</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">📄 Վերբեռնված ֆայլեր</h3>
                        {labResults.length === 0 ? (
                            <p className="text-slate-500 text-sm">Վերբեռնված ֆայլեր դեռ չկան։</p>
                        ) : (
                            <div className="space-y-2">
                                {labResults.map((res) => (
                                    <div key={res.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-slate-200 rounded-lg px-3 py-2">
                                        <div>
                                            <p className="font-medium text-slate-800">{res.title}</p>
                                            <p className="text-xs text-slate-500">{new Date(res.createdAt).toLocaleDateString('hy-AM')}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 italic sm:text-right">Միայն պացիենտի համար</span>
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