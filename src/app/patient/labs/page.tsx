
export default function PatientLabsPage() {
  const labResults = [
    { date: "10 Մարտ 2026", title: "Արյան ընդհանուր անալիզ", doctor: "Դոկտոր Մարտիրոսյան", status: "Պատրաստ է" },
    { date: "15 Փետրվար 2026", title: "Վիտամին D-ի ստուգում", doctor: "Դոկտոր Հակոբյան", status: "Պատրաստ է" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Անալիզներ և Հետազոտություններ</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ձախ կողմ՝ Անալիզների ցանկ */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-semibold text-slate-700">Իմ Ֆայլերը</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {labResults.map((lab, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded flex items-center justify-center">
                    📄
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{lab.title}</p>
                    <p className="text-sm text-slate-500">{lab.date} • {lab.doctor}</p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md font-medium hover:bg-blue-100">
                  Դիտել PDF
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Աջ կողմ՝ Վերբեռնում */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="font-semibold text-slate-700 mb-4">Վերբեռնել նոր պատասխան</h2>
          <p className="text-sm text-slate-500 mb-4">
            Եթե հանձնել եք անալիզներ այլ կլինիկայում, կարող եք կցել ձեր պատասխանները այստեղ։
          </p>
          
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition cursor-pointer">
            <span className="text-3xl block mb-2">📥</span>
            <span className="text-sm font-medium text-blue-600">Ընտրեք ֆայլ</span>
            <p className="text-xs text-slate-400 mt-1">PDF, JPG (մինչև 5MB)</p>
          </div>

          <button className="w-full mt-4 px-4 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-900 transition">
            Վերբեռնել
          </button>
        </div>

      </div>
    </div>
  );
}