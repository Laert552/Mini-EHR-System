export default function PatientEMRPage() {
  // Ֆեյք տվյալներ պացիենտի և նրա պատմության համար
  const patientInfo = {
    name: "Արամ Խաչատրյան",
    id: "P-84729",
    age: 34,
    bloodType: "A (II) Rh+",
  };

  const medicalHistory = [
    { date: "15 Փետրվար 2026", doctor: "Դոկտոր Հակոբյան (Թերապևտ)", diagnosis: "Սուր շնչառական վարակ", notes: "Նշանակվել է հանգիստ, շատ տաք հեղուկներ:" },
    { date: "10 Նոյեմբեր 2025", doctor: "Դոկտոր Մարտիրոսյան (Սրտաբան)", diagnosis: "Արյան բարձր ճնշում", notes: "Նշանակվել է Էնալապրիլ, դիետայի փոփոխություն:" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Պացիենտի գլխավոր ինֆորմացիա */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{patientInfo.name}</h1>
          <p className="text-slate-500 font-medium">ID: {patientInfo.id} • Տարիք՝ {patientInfo.age} • Արյան խումբ՝ {patientInfo.bloodType}</p>
        </div>
        <button className="px-4 py-2 bg-teal-50 text-teal-700 font-medium rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors">
          Փոխել պացիենտին
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Ձախ կողմ: Նոր Ախտորոշման/Նշանակման ավելացում */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>✍️</span> Նոր Ախտորոշում
          </h2>
          
          <form className="space-y-5">
            {/* Ախտորոշում */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Հիմնական Ախտորոշում (ICD-10)</label>
              <input 
                type="text" 
                placeholder="Օր.՝ J06.9 Սուր վերին շնչառական վարակ..." 
                className="w-full px-4 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Նշանակումներ / Գրառումներ */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Նշանակումներ և Գրառումներ</label>
              <textarea 
                rows={4}
                placeholder="Գրեք դեղատոմսը և բուժման ընթացքը..." 
                className="w-full px-4 py-2 border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              ></textarea>
            </div>

            {/* Ֆայլերի վերբեռնում (PDF/Images) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Կցել անալիզներ կամ նկարներ (PDF, JPG)</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-teal-400 hover:bg-teal-50 transition-colors cursor-pointer">
                <div className="space-y-1 text-center">
                  <span className="text-3xl">📄</span>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <span className="relative font-medium text-teal-600 hover:text-teal-500">
                      Ընտրեք ֆայլ
                    </span>
                    <p className="pl-1">կամ քաշեք գցեք այստեղ</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, PDF մինչև 10MB</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="button" 
                className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                Պահպանել և Ավարտել
              </button>
            </div>
          </form>
        </div>

        {/* Աջ կողմ: Բժշկական Պատմություն (History) */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>🕰️</span> Բժշկական Պատմություն
          </h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {medicalHistory.map((record, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Ժամանակացույցի կետը */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <span className="w-3 h-3 bg-slate-500 rounded-full"></span>
                </div>
                
                {/* Բուն Քարտը */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{record.diagnosis}</span>
                  </div>
                  <p className="text-sm text-teal-600 font-medium mb-2">{record.date} • {record.doctor}</p>
                  <p className="text-slate-600 text-sm">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}