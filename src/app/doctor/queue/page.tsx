export default function DoctorQueuePage() {
    // Ֆեյք տվյալներ վիզուալը կառուցելու համար
    const currentPatient = { number: "A-014", name: "Անահիտ Մարտիրոսյան", time: "10:30" };
    const queueList = [
    { number: "A-015", name: "Աննա Սարգսյան", time: "11:00", status: "Սպասում է" },
    { number: "A-016", name: "Գոռ Վարդանյան", time: "11:30", status: "Սպասում է" },
    { number: "A-017", name: "Մարիա Պողոսյան", time: "12:00", status: "Սպասում է" },
  ];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Օրվա Այցեր և հերթ</h1>
                <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-lg font-medium">
                    Այսօր։ {new Date().toLocaleDateString('hy-AM')}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Live Queue - Ընթացիկ Պացիենտ */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-lg font-medium text-slate-500">Ընթացիկ Պացիենտ</h2>
                    <div className="text-5xl font-extrabold text-teal-600 tracking-wider">
                        {currentPatient.number}
                    </div>
                    <div>
                        <p className="text-xl font-bold text-slate-800">{currentPatient.name}</p>
                        <p className="text-slate-500">Գրանցված ժամը՝ {currentPatient.time}</p>
                    </div>
                    <button className="w-full mt-4 px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors">
                        Ավարտել Ընդունելությունը
                    </button>
                </div>

                {/* Իրեն կցված պացիենտների ցանկ */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-lg font-semibold text-slate-800">Սպասող Պացիենտներ</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {queueList.map((patient, idx) => (
                            <div
                                key={idx}
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                        {patient.number}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{patient.name}</p>
                                        <p className="text-sm text-slate-500">{patient.time}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                    {patient.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}