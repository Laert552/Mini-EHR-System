// app/doctor/layout.tsx
import Link from 'next/link';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-teal-600">🩺 Բժշկի Տիրույթ</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col space-y-2">
          <Link 
            href="/doctor/queue" 
            className="px-4 py-2 rounded-md hover:bg-teal-50 text-slate-700 hover:text-teal-600 transition-colors font-medium"
          >
            📋 Օրվա Այցեր (Live Queue)
          </Link>
          <Link 
            href="/doctor/emr" 
            className="px-4 py-2 rounded-md hover:bg-teal-50 text-slate-700 hover:text-teal-600 transition-colors font-medium"
          >
            🗂️ Էլեկտրոնային Քարտ (EMR)
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-gray-100">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
          >
            <span>🏠</span> Գլխավոր էջ
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}