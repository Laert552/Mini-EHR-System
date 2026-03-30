import Link from 'next/link';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Կողային Մենյու (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600">🏥 Ընդունարան</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-col space-y-2">
          <Link 
            href="/reception/register" 
            className="px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            👤 Նոր Գրանցում
          </Link>
          <Link 
            href="/reception/calendar" 
            className="px-4 py-2 rounded-md hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors font-medium"
          >
            📅 Օրացույց և Այցեր
          </Link>
        </nav>
      </aside>

      {/* Գլխավոր Բովանդակություն */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}