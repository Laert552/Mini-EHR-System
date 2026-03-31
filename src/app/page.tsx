import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl text-center space-y-8">
        
        {/* Վերնագիր */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4">
            🏥 Էլեկտրոնային Առողջապահական Համակարգ
          </h1>
          <p className="text-lg text-slate-600">
            Բարի գալուստ գլխավոր էջ։ Խնդրում ենք ընտրել ձեր դերը համակարգի համապատասխան բաժին մուտք գործելու համար.
          </p>
        </div>

        {/* Քարտեր դեպի մեր սարքած բաժինները */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          
          {/* Ընդունարանի Քարտ */}
          <Link 
            href="/reception/register" 
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">👩‍💻</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Ընդունարան</h2>
            <p className="text-sm text-slate-500">Պացիենտների գրանցում և բժիշկների օրացույց</p>
          </Link>

          {/* Բժշկի Քարտ */}
          <Link 
            href="/doctor/queue" 
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">🩺</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">Բժիշկ</h2>
            <p className="text-sm text-slate-500">Օրվա հերթեր (Live Queue) և Էլեկտրոնային Քարտ (EMR)</p>
          </Link>

          {/* Պացիենտի Քարտ */}
          <Link 
            href="/patient/profile" 
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">👤</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Պացիենտ</h2>
            <p className="text-sm text-slate-500">Անձնական տվյալներ և լաբորատոր անալիզների արդյունքներ</p>
          </Link>

        </div>

      </div>
    </div>
  );
}