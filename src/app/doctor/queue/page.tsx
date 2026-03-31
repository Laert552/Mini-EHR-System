'use client';

import { useState, useEffect } from 'react';
import { getTodayQueue } from '@/actions/doctor';
import Link from 'next/link';

export default function DoctorQueuePage() {
    const [queueList, setQueueList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadQueue() {
            try {
                const data = await getTodayQueue("temp-doc-id");
                if (data) {
                    setQueueList(data);
                }
            } catch (error) {
                console.error("Հերթի բեռնման սխալ:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadQueue();
    }, []);

    const currentPatient = queueList.length > 0 ? queueList[0] : null;
    const waitingPatients = queueList.length > 1 ? queueList.slice(1) : [];

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500">Բեռնվում է այսօրվա հերթը...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Օրվա Այցեր և հերթ</h1>
                <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium">
                    Այսօր։ {new Date().toLocaleDateString('hy-AM')}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-4 text-center">
                    <h2 className="text-lg font-medium text-slate-500">Ընթացիկ Պացիենտ</h2>
                    
                    {currentPatient ? (
                        <>
                            <div className="text-5xl font-extrabold text-teal-600 tracking-wider">
                                #{currentPatient.id.slice(-4).toUpperCase()} 
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-800">{currentPatient.patient?.fullName}</p>
                                <p className="text-slate-500">Գրանցված ժամը՝ {currentPatient.time}</p>
                            </div>
                            
                            <Link 
                                href={`/doctor/emr/${currentPatient.patientId}`}
                                className="w-full mt-4 px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors block"
                            >
                                Բացել Էլ. Քարտը (EMR)
                            </Link>
                        </>
                    ) : (
                        <div className="py-8 text-slate-400">
                            <span className="text-4xl block mb-2">🎉</span>
                            Այս պահին հերթում սպասող չկա
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800">
                            Սպասող Պացիենտներ ({waitingPatients.length})
                        </h2>
                    </div>
                    
                    <div className="divide-y divide-slate-100">
                        {waitingPatients.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                Սպասող պացիենտներ չկան:
                            </div>
                        ) : (
                            waitingPatients.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                                            #{appointment.id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{appointment.patient?.fullName}</p>
                                            <p className="text-sm text-slate-500">{appointment.time}</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                        Սպասում է
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}