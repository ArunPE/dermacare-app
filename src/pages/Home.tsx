import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Shield, Clock, Award, Users, LayoutDashboard, ShieldCheck, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAdmin, user } = useAuth();

  if (isAdmin) {
    return (
      <div className="space-y-12">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">Clinic Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here's what's happening at the clinic today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/admin" data-testid="admin-manage-appointments" className="group bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all">
            <div className="bg-emerald-50 p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Manage Appointments</h3>
            <p className="text-slate-500 text-sm">Review, confirm, or reschedule patient bookings.</p>
          </Link>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-sm">
            <div className="bg-blue-50 p-4 rounded-2xl inline-block mb-6">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">Patient Records</h3>
            <p className="text-slate-500 text-sm">Access and update patient medical histories and reports.</p>
          </div>

          <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 shadow-sm">
            <div className="bg-white p-4 rounded-2xl inline-block mb-6">
              <ShieldCheck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 mb-2">System Settings</h3>
            <p className="text-purple-700/60 text-sm">Configure clinic hours, doctor availability, and services.</p>
          </div>
        </div>

        <section className="bg-emerald-900 text-white rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Admin Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">Add New Doctor</button>
                <button className="bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">Generate Daily Report</button>
                <button className="bg-emerald-800 hover:bg-emerald-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors">Broadcast Message</button>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur p-6 rounded-2xl border border-white/10 w-full md:w-auto">
              <p className="text-xs text-emerald-300 uppercase font-bold tracking-widest mb-2">Security Status</p>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-8 md:p-16">
        <div className="relative z-10 max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-800 text-emerald-300 text-xs font-bold tracking-wider uppercase mb-4">
              Expert Dermatological Care
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              Healthy Skin, <br />
              <span className="text-emerald-400">Confident You.</span>
            </h1>
            <p className="text-emerald-100/80 text-lg mt-6 max-w-lg">
              Experience the next generation of skin care with our world-class specialists and advanced technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/booking"
              data-testid="hero-book-button"
              className="bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition-all flex items-center space-x-2 shadow-xl"
            >
              <span>Book Appointment</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/doctors"
              data-testid="hero-doctors-button"
              className="bg-emerald-800/50 backdrop-blur text-white border border-emerald-700 px-8 py-4 rounded-full font-bold hover:bg-emerald-800 transition-all"
            >
              Meet Our Doctors
            </Link>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <img
            src="https://picsum.photos/seed/dermatology/1000/1000"
            alt="Clinic"
            className="object-cover w-full h-full opacity-40 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-900 via-transparent to-emerald-900"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: Users, label: 'Happy Patients', value: '15k+' },
          { icon: Award, label: 'Expert Doctors', value: '25+' },
          { icon: Clock, label: 'Years Experience', value: '12+' },
          { icon: Shield, label: 'Success Rate', value: '99%' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-emerald-50 text-center shadow-sm"
          >
            <div className="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-600 mb-4">
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-emerald-900">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Services/Departments Preview */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-900">Our Specialized Services</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We offer a comprehensive range of dermatological treatments tailored to your unique skin needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'General Dermatology',
              desc: 'Treatment for common skin conditions like acne, eczema, and psoriasis.',
              img: 'https://picsum.photos/seed/skin1/600/400'
            },
            {
              title: 'Cosmetic Procedures',
              desc: 'Advanced aesthetic treatments including lasers, fillers, and rejuvenation.',
              img: 'https://picsum.photos/seed/skin2/600/400'
            },
            {
              title: 'Skin Cancer Screening',
              desc: 'Thorough examinations and early detection of skin malignancies.',
              img: 'https://picsum.photos/seed/skin3/600/400'
            }
          ].map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-3xl overflow-hidden border border-emerald-50 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 space-y-4">
                <h3 className="text-xl font-bold text-emerald-900">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                <Link to="/departments" className="inline-flex items-center text-emerald-600 font-semibold text-sm hover:underline">
                  Learn More <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-50 rounded-3xl p-8 md:p-16 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold text-emerald-900">Ready to transform your skin?</h2>
        <p className="text-slate-600 max-w-xl mx-auto text-lg">
          Join thousands of satisfied patients and start your journey to healthier skin today.
        </p>
        <div className="flex justify-center">
          <Link
            to="/booking"
            className="bg-emerald-600 text-white px-10 py-4 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
