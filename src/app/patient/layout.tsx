// app/patient/layout.tsx
import Link from 'next/link';
import { signOut } from '@/lib/auth';

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  async function logoutAction() {
    'use server';
    await signOut({ redirectTo: '/' });
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-blue-50/30">
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-blue-100 shadow-sm flex flex-col">
        <div className="p-6 border-b border-blue-50">
          <h2 className="text-xl font-bold text-blue-600">👤 Իմ Պորտալը</h2>
        </div>
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2">
          <Link 
            href="/patient/profile" 
            className="shrink-0 px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            🪪 Իմ Տվյալները
          </Link>
          <Link 
            href="/patient/labs" 
            className="shrink-0 px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            🔬 Անալիզներ և Ֆայլեր
          </Link>
        </nav>
        {/* Գլխավոր էջ վերադառնալու կոճակը */}
        <div className="mt-auto p-4 border-t border-gray-100 space-y-2">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
          >
            <span>🏠</span> Գլխավոր էջ
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors font-medium"
            >
              <span>🚪</span> Ելք
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}