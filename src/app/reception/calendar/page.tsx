// app/reception/calendar/page.tsx

export default function CalendarPage() {
  // Սա պարզապես ֆեյք զանգված է վիզուալը տեսնելու համար (կոմպոնենտները նկարելու համար)
  const timeSlots = [
    { time: "09:00", status: "free", patient: "" },
    { time: "09:30", status: "busy", patient: "Արամ Խաչատրյան" },
    { time: "10:00", status: "free", patient: "" },
    { time: "10:30", status: "busy", patient: "Աննա Սարգսյան" },
    { time: "11:00", status: "free", patient: "" },
    { time: "11:30", status: "free", patient: "" },
    { time: "12:00", status: "busy", patient: "Գոռ Վարդանյան" },
    { time: "12:30", status: "free", patient: "" },
  ];

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[80vh]">
      
      {/* Վերևի հատված՝ վերնագիր և ֆիլտրեր */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">📅 Օրացույց և Այցեր</h1>
        
        <div className="flex gap-4">
          {/* Ամսաթվի ընտրություն */}
          <input 
            type="date" 
            className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Բժշկի ընտրություն */}
          <select className="px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option>Բոլոր բժիշկները</option>
            <option>Դոկտոր Մարտիրոսյան (Սրտաբան)</option>
            <option>Դոկտոր Հակոբյան (Թերապևտ)</option>
          </select>
        </div>
      </div>

      {/* Ժամանակացույցի ցանց (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {timeSlots.map((slot, index) => (
          <div 
            key={index} 
            className={`p-5 rounded-xl border-2 transition-all duration-200 ${
              slot.status === 'free' 
                ? 'border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-300 cursor-pointer shadow-sm' 
                : 'border-red-100 bg-red-50 opacity-80 cursor-not-allowed'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xl font-bold text-gray-800">{slot.time}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                slot.status === 'free' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {slot.status === 'free' ? 'Ազատ է' : 'Զբաղված'}
              </span>
            </div>
            
            <p className="text-sm font-medium text-gray-600 mt-2 h-5">
              {slot.status === 'busy' && `👤 ${slot.patient}`}
              {slot.status === 'free' && 'Սեղմեք՝ գրանցելու համար'}
            </p>
          </div>
        ))}
      </div>
      
    </div>
  );
}