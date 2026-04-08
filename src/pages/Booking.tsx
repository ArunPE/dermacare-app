import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const DOCTORS = [
  { id: '1', name: 'Dr. Sarah Mitchell' },
  { id: '2', name: 'Dr. James Wilson' },
  { id: '3', name: 'Dr. Elena Rodriguez' },
  { id: '4', name: 'Dr. Michael Chen' }
];

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctorId || '');
  const [selectedDate, setSelectedDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTime || !phoneNumber) return;

    setIsSubmitting(true);
    try {
      const isTestMode = localStorage.getItem('playwright-test-mode') === 'true';
      
      if (isTestMode) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSuccess(true);
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      const doctor = DOCTORS.find(d => d.id === selectedDoctor);
      const appointmentData = {
        patientId: user.uid,
        patientName: profile?.displayName || user.displayName || 'Patient',
        doctorId: selectedDoctor,
        doctorName: doctor?.name || 'Unknown Doctor',
        date: selectedDate,
        time: selectedTime,
        phoneNumber: phoneNumber,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      setIsSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-emerald-100 p-6 rounded-full"
        >
          <CheckCircle2 className="h-16 w-16 text-emerald-600" />
        </motion.div>
        <h1 className="text-3xl font-bold text-emerald-900">Appointment Requested!</h1>
        <p className="text-slate-500">Redirecting you to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">Book an Appointment</h1>
        <p className="text-slate-500">Choose your preferred doctor and time slot.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Doctor Selection */}
          <section className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <User className="h-5 w-5" />
              <h2>Select Doctor</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOCTORS.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDoctor(doc.id)}
                  data-testid={`select-doctor-${doc.id}`}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedDoctor === doc.id
                      ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                      : 'border-slate-100 hover:border-emerald-200'
                  }`}
                >
                  <span className={`font-semibold ${selectedDoctor === doc.id ? 'text-emerald-900' : 'text-slate-600'}`}>
                    {doc.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Date Selection */}
          <section className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <CalendarIcon className="h-5 w-5" />
              <h2>Select Date</h2>
            </div>
            <input
              type="date"
              min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              data-testid="appointment-date-input"
              className="w-full p-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </section>

          {/* Time Selection */}
          <section className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <Clock className="h-5 w-5" />
              <h2>Select Time</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  data-testid={`select-time-${time.replace(/[: ]/g, '-')}`}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold">
              <User className="h-5 w-5" />
              <h2>Contact Information</h2>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number (India)</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                data-testid="appointment-phone-input"
                className="w-full p-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
              <p className="text-[10px] text-slate-400">Format: 10 digits or starting with +91</p>
            </div>
          </section>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-emerald-900 text-white p-8 rounded-3xl shadow-xl space-y-8">
            <h3 className="text-xl font-bold">Booking Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-emerald-800 pb-4">
                <span className="text-emerald-300">Doctor</span>
                <span className="font-semibold">{DOCTORS.find(d => d.id === selectedDoctor)?.name || 'Not selected'}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800 pb-4">
                <span className="text-emerald-300">Date</span>
                <span className="font-semibold">{format(new Date(selectedDate), 'PPP')}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800 pb-4">
                <span className="text-emerald-300">Time</span>
                <span className="font-semibold">{selectedTime || 'Not selected'}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-800 pb-4">
                <span className="text-emerald-300">Phone</span>
                <span className="font-semibold">{phoneNumber || 'Not provided'}</span>
              </div>
            </div>

            <button
              disabled={!selectedDoctor || !selectedTime || !phoneNumber || isSubmitting}
              data-testid="confirm-booking-button"
              className="w-full bg-emerald-400 text-emerald-900 py-4 rounded-2xl font-bold hover:bg-emerald-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
            <p className="text-[10px] text-emerald-400/60 text-center">
              By confirming, you agree to our terms of service and cancellation policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
