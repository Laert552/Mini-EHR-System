
export default function PatientProfilePage() {
  const patientData = {
    fullName: "Արամ Խաչատրյան",
    birthDate: "12 Մայիս 1990",
    phone: "+374 99 123 456",
    email: "aram.kh@example.com",
    bloodType: "A (II) Rh+",
    allergies: "Պենիցիլին, Ծաղկափոշի",
    chronicConditions: "Չկան"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Անձնական Քարտ</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
            ԱԽ
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{patientData.fullName}</h2>
            <p className="text-slate-500 mt-1">Պացիենտի ID: PAT-883920</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Կոնտակտային Տվյալներ</h3>
            <div>
              <p className="text-sm text-slate-500">Ծննդյան ամսաթիվ</p>
              <p className="font-medium text-slate-800">{patientData.birthDate}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Հեռախոս</p>
              <p className="font-medium text-slate-800">{patientData.phone}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Էլ. փոստ</p>
              <p className="font-medium text-slate-800">{patientData.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Բժշկական Տվյալներ</h3>
            <div>
              <p className="text-sm text-slate-500">Արյան խումբ</p>
              <p className="font-medium text-red-600">{patientData.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Ալերգիաներ</p>
              <p className="font-medium text-slate-800">{patientData.allergies}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Քրոնիկ հիվանդություններ</p>
              <p className="font-medium text-slate-800">{patientData.chronicConditions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}