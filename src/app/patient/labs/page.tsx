'use client';

import { useState, useEffect } from 'react';
import { uploadLabResult, getLabResultsByPatient, deleteLabResult } from '@/actions/lab-results';

export default function LabResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    
    const tempPatientId = "temp-patient-123";

    const loadResults = async () => {
        setIsLoading(true);
        try {
            const data = await getLabResultsByPatient(tempPatientId);
            if (data) setResults(data);
        } catch (error) {
            console.error("Անալիզների բեռնման սխալ:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadResults();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        await uploadLabResult(
            tempPatientId, 
            file.name, 
            fileFormData
        );

        alert('Ֆայլը հաջողությամբ վերբեռնվեց:');
        await loadResults();
    } catch (error) {
        console.error("Վերբեռնման սխալ:", error);
        alert('Վերբեռնումը ձախողվեց:');
    } finally {
        setIsUploading(false);
    }
};
    const handleDelete = async (id: string) => {
        if (!confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս արդյունքը:')) return;
        try {
            await deleteLabResult(id);
            loadResults();
        } catch (error) {
            alert('Ջնջման սխալ:');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800">🧪 Լաբորատոր Անալիզներ</h1>
                
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    {isUploading ? 'Վերբեռնվում է...' : '+ Ավելացնել PDF'}
                    <input 
                        type="file" 
                        accept=".pdf" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                        disabled={isUploading}
                    />
                </label>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                    Իմ փաստաթղթերը
                </div>

                {isLoading ? (
                    <div className="p-10 text-center text-slate-400">Բեռնվում է...</div>
                ) : results.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-medium">
                        Դեռևս վերբեռնված անալիզներ չկան:
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {results.map((res) => (
                            <div key={res.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">📄</span>
                                    <div>
                                        <p className="font-semibold text-slate-800">{res.fileName || 'Անալիզի արդյունք'}</p>
                                        <p className="text-xs text-slate-500">
                                            Ամսաթիվ՝ {new Date(res.createdAt).toLocaleDateString('hy-AM')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <a 
                                        href={res.fileUrl} 
                                        target="_blank" 
                                        className="text-blue-600 hover:underline text-sm font-medium"
                                    >
                                        Դիտել
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(res.id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
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