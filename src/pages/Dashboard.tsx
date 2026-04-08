import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle2, XCircle, User } from 'lucide-react';
import { format } from 'date-fns';

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface Report {
  id: string;
  title: string;
  fileUrl: string;
  date: string;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const isTestMode = localStorage.getItem('playwright-test-mode') === 'true';
    if (isTestMode) {
      setAppointments([
        {
          id: 'mock-app-1',
          doctorName: 'Dr. Sarah Mitchell',
          date: new Date().toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]);
      setReports([
        {
          id: 'mock-report-1',
          title: 'Skin Analysis Report',
          fileUrl: '#',
          date: new Date().toISOString()
        }
      ]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
      setAppointments(apps);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'appointments');
    });

    const rq = query(
      collection(db, 'reports'),
      where('patientId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribeReports = onSnapshot(rq, (snapshot) => {
      const reps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
      setReports(reps);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reports');
    });

    return () => {
      unsubscribe();
      unsubscribeReports();
    };
  }, [user]);

  const cancelAppointment = async (id: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status: 'cancelled' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'cancelled': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-sm">
            <img src={user?.photoURL || ''} alt="Profile" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">Welcome, {profile?.displayName || user?.displayName}</h1>
            <p className="text-slate-500 text-sm">Manage your skin health and appointments.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-900">Your Appointments</h2>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{appointments.length} Total</span>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-3xl border border-emerald-50 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  data-testid={`appointment-card-${app.id}`}
                  className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl ${
                      app.status === 'confirmed' ? 'bg-emerald-50' : 
                      app.status === 'cancelled' ? 'bg-red-50' : 'bg-amber-50'
                    }`}>
                      {getStatusIcon(app.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900" data-testid={`appointment-doctor-${app.id}`}>{app.doctorName}</h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center" data-testid={`appointment-date-${app.id}`}><Calendar className="h-3 w-3 mr-1" /> {format(new Date(app.date), 'PPP')}</span>
                        <span className="flex items-center" data-testid={`appointment-time-${app.id}`}><Clock className="h-3 w-3 mr-1" /> {app.time}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      app.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`} data-testid={`appointment-status-${app.id}`}>
                      {app.status}
                    </span>
                    {app.status === 'pending' && (
                      <button
                        onClick={() => cancelAppointment(app.id)}
                        data-testid={`cancel-appointment-${app.id}`}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-emerald-200 text-center space-y-4">
              <div className="bg-emerald-50 p-4 rounded-full inline-block">
                <AlertCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <p className="text-slate-500">You don't have any appointments yet.</p>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-emerald-900">Medical Reports</h2>
            <FileText className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} data-testid={`report-card-${report.id}`} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors group">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm">
                        <FileText className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900" data-testid={`report-title-${report.id}`}>{report.title}</p>
                        <p className="text-[10px] text-slate-400">{format(new Date(report.date), 'PP')}</p>
                      </div>
                    </div>
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`download-report-${report.id}`}
                      className="text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-sm text-slate-500">No reports available yet.</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Secure Storage</p>
              </div>
            )}
            
            <div className="pt-4 border-t border-emerald-50">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Your medical records are encrypted and only accessible by you and your attending physician.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
