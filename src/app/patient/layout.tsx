import Link from "next/link";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-blue-50/30">
            <aside className="w-64 bg-white border-r border-blue-100 shadow-sm flex flex-col">
                <div className="p-6 border-b border-blue-50">
                    <h2 className="text-xl font-bold text-blue-600">👤 Իմ Պորտալը</h2>
                </div>
                <nav className="flex-1 p-4 flex flxe-col space-y-2">
                    <Link
                        href="/patient/profile"
                        className="px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                    >
                        🪪 Իմ Տվյալները
                    </Link>
                    <Link
                        href="patient/labs"
                        className="px-4 py-2 rounded-md hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                    >
                            🔬 Անալիզներ և Ֆայլեր
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}