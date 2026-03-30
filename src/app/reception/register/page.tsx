export default function RegisterPage() {
    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Նոր Պացիենտի Գրանցում</h1>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Անուն */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Անուն</label>
                        <input 
                            type="text"
                            placeholder="Օր․՝ Դավիթ"
                            className="placeholder-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    {/* Ազգանուն */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ազգանուն</label>
                        <input 
                            type="text"
                            placeholder="Օր․՝ Դավթյան"
                            className="placeholder-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                    {/* Հեռախոսահամար */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Հեռախոսահամար</label>
                        <input 
                            type="tel"
                            placeholder="+374 __ ___ ___"
                            className="placeholder-gray-500 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>

                    {/* Ծննդյան Ամսաթիվ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ծննդյան Ամսաթիվ</label>
                        <input 
                            type="date"
                            className="placeholder-gray-500w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>
                {/* Գրանցման կոճակ */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Գրանցել Պացիենտին
                    </button>
                </div>
            </form>     
        </div>
    );
}