'use client';

import { useState } from 'react';
import { registerPatient } from '@/actions/auth'; 

export default function RegisterPatient() {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthDate: '',
    gender: 'MALE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const dataToSend = {
        ...formData,
        birthDate: new Date(formData.birthDate).toISOString(), 
        gender: formData.gender as "MALE" | "FEMALE",
      };

      const response = await registerPatient(dataToSend);
      
      alert('Պացիենտը հաջողությամբ գրանցվեց համակարգում։');
      setFormData({ fullName: '', email: '', password: '', birthDate: '', gender: 'MALE' });
      
    } catch (error) {
      console.error("Գրանցման խնդիր:", error);
      alert('Սխալ տեղի ունեցավ գրանցման ժամանակ (կամ էլ. փոստն արդեն զբաղված է)։');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Նոր Պացիենտի Գրանցում</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Ամբողջական Անուն */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ամբողջական Անուն</label>
            <input 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              type="text" 
              placeholder="Արամ Խաչատրյան" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Էլ. Փոստ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Էլ. Փոստ (Լոգին)</label>
            <input 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              type="email" 
              placeholder="aram@example.com" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Գաղտնաբառ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Գաղտնաբառ</label>
            <input 
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              type="password" 
              placeholder="********" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Ծննդյան ամսաթիվ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ծննդյան ամսաթիվ</label>
            <input 
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              type="date" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Սեռ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Սեռ</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="MALE">Արական</option>
              <option value="FEMALE">Իգական</option>
            </select>
          </div>

        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Գրանցվում է...' : 'Գրանցել Պացիենտին'}
          </button>
        </div>
      </form>
    </div>
  );
}