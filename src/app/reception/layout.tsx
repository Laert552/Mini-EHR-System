import Link from 'next/link';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Կողային Մենյու (Sidebar) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600">🏥 Ընդունարան</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2">
          <Link 
            href="/reception/register" 
            className="shrink-0 px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            👤 Նոր Գրանցում
          </Link>
          <Link 
            href="/reception/calendar" 
            className="shrink-0 px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            📅 Օրացույց և Այցեր
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

      {/* Գլխավոր Բովանդակություն */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}