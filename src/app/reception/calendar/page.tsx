// app/reception/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
// Ներմուծում ենք բոլոր 5 ֆունկցիաները ճիշտ այնպես, ինչպես քո աղյուսակում է նշված
import { getAllDoctors } from '@/actions/doctor';
import { getAllPatients } from '@/actions/patient';
import { 
  createAppointment, 
  getDoctorScheduleByDate, 
  updateAppointmentStatus 
} from '@/actions/appointment';

export default function CalendarPage() {
  // Ցուցակների State-եր
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Օրացույցի (Աջ կողմի) State-եր
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]); // Այսօրվա ամսաթիվը
  const [appointments, setAppointments] = useState<any[]>([]);

  // Նոր այցի գրանցման (Ձախ կողմի) State-եր
  const [appointmentData, setAppointmentData] = useState({
    doctorId: '',
    patientId: '',
    date: '',
    time: '',
  });

  // 1. Էջը բացվելիս բեռնում ենք Drop-down-ների տվյալները (getAllDoctors, getAllPatients)
  useEffect(() => {
    async function loadDropdownData() {
      try {
        const docs = await getAllDoctors();
        const pats = await getAllPatients();
        if (docs) setDoctors(docs);
        if (pats) setPatients(pats);
      } catch (error) {
        console.error("Drop-down տվյալների բեռնման սխալ:", error);
      }
    }
    loadDropdownData();
  }, []);

  // 2. Երբ օրացույցի ամսաթիվը փոխվում է, բեռնում ենք այդ օրվա այցերը (getDoctorScheduleByDate)
  useEffect(() => {
    async function loadSchedule() {
      if (!scheduleDate) return;
      try {
        // Ենթադրում ենք, որ այս ֆունկցիան ստանում է ամսաթիվը և վերադարձնում այցերի զանգված
        const schedule = await getDoctorScheduleByDate(new Date(scheduleDate).toISOString());
        if (schedule) {
          setAppointments(schedule);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Օրացույցի բեռնման սխալ:", error);
      }
    }
    loadSchedule();
  }, [scheduleDate]);

  // 3. Նոր այցի գրանցում (createAppointment)
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSend = {
        doctorId: appointmentData.doctorId,
        patientId: appointmentData.patientId,
        date: new Date(appointmentData.date).toISOString(), // Տալիս ենք ճիշտ ISO ֆորմատ
        time: appointmentData.time,
      };

      await createAppointment(dataToSend);
      alert('Այցը հաջողությամբ գրանցվեց։');
      
      // Մաքրում ենք ֆորման
      setAppointmentData({ doctorId: '', patientId: '', date: '', time: '' });
      
      // Թարմացնում ենք աջ կողմի օրացույցը, որ նոր այցը միանգամից երևա
      setScheduleDate(appointmentData.date); 
    } catch (error) {
      console.error("Այցի գրանցման սխալ:", error);
      alert('Սխալ այցի գրանցման ժամանակ։');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Այցի հաստատում կամ չեղարկում (updateAppointmentStatus)
  const handleUpdateStatus = async (appointmentId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      alert(`Այցի կարգավիճակը փոխվեց հաջողությամբ:`);
      
      // Թարմացնում ենք տեսանելի ցուցակը
      setAppointments(prev => 
        prev.map(app => app.id === appointmentId ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      console.error("Կարգավիճակի փոփոխման սխալ:", error);
      alert('Չհաջողվեց փոխել կարգավիճակը:');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">📅 Օրացույց և Այցեր</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* === ՁԱԽ ԿՈՂՄ՝ ԳՐԱՆՑՈՒՄ === */}
        <div className="xl:col-span-1">
          <form onSubmit={handleBookAppointment} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-8">
            <h2 className="text-xl font-semibold mb-6 text-slate-700">Գրանցել Նոր Այց</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">Ընտրեք Բժշկին</label>
              <select 
                required
                value={appointmentData.doctorId}
                onChange={(e) => setAppointmentData({...appointmentData, doctorId: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
              >
                <option value="">-- Ընտրել --</option>
                {doctors?.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.fullName}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">Ընտրեք Պացիենտին</label>
              <select 
                required
                value={appointmentData.patientId}
                onChange={(e) => setAppointmentData({...appointmentData, patientId: e.target.value})}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none bg-white"
              >
                <option value="">-- Ընտրել --</option>
                {patients?.map((patient) => (
                  <option key={patient.id} value={patient.id}>{patient.fullName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Ամսաթիվ</label>
                <input 
                  required
                  type="date" 
                  value={appointmentData.date}
                  onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Ժամ</label>
                <input 
                  required
                  type="time" 
                  value={appointmentData.time}
                  onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? 'Գրանցվում է...' : 'Գրանցել Այցը'}
            </button>
          </form>
        </div>

        {/* === ԱՋ ԿՈՂՄ՝ ՕՐԱՑՈՒՅՑ ԵՎ ԿԱՐԳԱՎԻՃԱԿՆԵՐ === */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-125">
            {/* Օրացույցի Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="font-semibold text-slate-700">🕒 Օրվա Ժամանակացույց</h2>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500">Դիտել օրը՝</label>
                <input 
                  type="date" 
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="p-1.5 border border-slate-300 rounded-md text-sm text-slate-600 outline-none" 
                />
              </div>
            </div>
            
            {/* Այցերի Ցուցակ */}
            <div className="divide-y divide-slate-100">
              {appointments.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <span className="text-4xl mb-3 block">📭</span>
                  <p>Այս օրվա համար գրանցված այցեր չկան:</p>
                </div>
              ) : (
                appointments.map((app) => (
                  <div key={app.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition">
                    <div className="mb-3 sm:mb-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-lg text-slate-800">{app.time}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium 
                          ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                            app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'}`}>
                          {app.status === 'PENDING' ? 'Սպասվող' : app.status === 'CONFIRMED' ? 'Հաստատված' : 'Չեղարկված'}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">Պացիենտ՝ {app.patient?.fullName}</p>
                      <p className="text-sm text-slate-500">Բժիշկ՝ {app.doctor?.fullName}</p>
                    </div>

                    {/* Cancel/Confirm Կոճակներ */}
                    <div className="flex gap-2">
                      {app.status !== 'CONFIRMED' && app.status !== 'CANCELLED' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                            className="px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 text-sm font-medium transition"
                          >
                            Հաստատել
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'CANCELLED')}
                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-sm font-medium transition"
                          >
                            Չեղարկել
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}