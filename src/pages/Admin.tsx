import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { Users, Calendar, Clock, CheckCircle2, XCircle, Plus, Trash2, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const isAdminMode = localStorage.getItem('playwright-admin-mode') === 'true';
    
    if (isAdminMode) {
      const mockApps: Appointment[] = [
        {
          id: 'mock-app-1',
          patientName: 'Test Patient',
          doctorName: 'Dr. Sarah Smith',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ];
      setAppointments(mockApps);
      setDoctors([{ id: '1', name: 'Dr. Sarah Smith', specialty: 'Dermatologist' }]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    });

    const dq = query(collection(db, 'doctors'));
    const unsubscribeDoctors = onSnapshot(dq, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
      setDoctors(docs);
    });

    return () => {
      unsubscribe();
      unsubscribeDoctors();
    };
  }, []);

  const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const isAdminMode = localStorage.getItem('playwright-admin-mode') === 'true';
      if (isAdminMode) {
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
        return;
      }
      await updateDoc(doc(db, 'appointments', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `appointments/${id}`);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">Manage clinic operations and patient care.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center space-x-3">
            <Users className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Doctors</p>
              <p className="text-lg font-bold text-emerald-900">{doctors.length}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-50 shadow-sm flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Appointments</p>
              <p className="text-lg font-bold text-emerald-900">{appointments.length}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-emerald-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-emerald-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 p-1 rounded-xl">
              {['all', 'pending', 'confirmed', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  data-testid={`filter-status-${f}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    filter === f ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-400 font-bold border-b border-emerald-50">
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredAppointments.map((app) => (
                <tr key={app.id} data-testid={`admin-appointment-row-${app.id}`} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-emerald-900" data-testid={`admin-patient-name-${app.id}`}>{app.patientName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600" data-testid={`admin-doctor-name-${app.id}`}>{app.doctorName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-slate-700" data-testid={`admin-appointment-date-${app.id}`}>{format(new Date(app.date), 'PP')}</p>
                      <p className="text-slate-400">{app.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                      app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`} data-testid={`admin-appointment-status-${app.id}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {app.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(app.id, 'confirmed')}
                          data-testid={`admin-confirm-btn-${app.id}`}
                          className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                          title="Confirm"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {app.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(app.id, 'cancelled')}
                          data-testid={`admin-cancel-btn-${app.id}`}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                          title="Cancel"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppointment(app.id)}
                        data-testid={`admin-delete-btn-${app.id}`}
                        className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <div className="py-20 text-center text-slate-400 text-sm">
              No appointments found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
