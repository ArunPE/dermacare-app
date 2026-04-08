import React from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Heart, Sparkles, Microscope, Activity } from 'lucide-react';

const DEPARTMENTS = [
  {
    title: 'Medical Dermatology',
    icon: Shield,
    desc: 'Diagnosis and treatment of skin, hair, and nail conditions including acne, psoriasis, and dermatitis.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    title: 'Cosmetic Dermatology',
    icon: Sparkles,
    desc: 'Advanced aesthetic treatments to enhance skin appearance, including lasers, Botox, and chemical peels.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    title: 'Surgical Dermatology',
    icon: Microscope,
    desc: 'Specialized surgical procedures for skin cancer removal and other dermatological surgeries.',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    title: 'Pediatric Dermatology',
    icon: Heart,
    desc: 'Expert care for skin conditions in infants, children, and adolescents in a child-friendly environment.',
    color: 'bg-pink-50 text-pink-600'
  },
  {
    title: 'Phototherapy',
    icon: Zap,
    desc: 'Controlled light treatments for chronic skin conditions like vitiligo and severe eczema.',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    title: 'Diagnostic Lab',
    icon: Activity,
    desc: 'In-house laboratory services for rapid and accurate skin biopsy and pathology results.',
    color: 'bg-teal-50 text-teal-600'
  }
];

export default function Departments() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">Our Departments</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Comprehensive dermatological care across specialized departments, 
          equipped with the latest medical technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DEPARTMENTS.map((dept, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`inline-flex p-4 rounded-2xl mb-6 transition-transform group-hover:scale-110 ${dept.color}`}>
              <dept.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">{dept.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {dept.desc}
            </p>
            <div className="mt-8 pt-6 border-t border-emerald-50">
              <button className="text-emerald-600 text-xs font-bold uppercase tracking-widest hover:underline">
                View Services
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-emerald-900 text-white rounded-3xl p-12 overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Why Choose Our Clinic?</h2>
            <div className="space-y-4">
              {[
                'Board-certified dermatologists with years of experience',
                'State-of-the-art diagnostic and treatment facilities',
                'Personalized care plans for every patient',
                'Convenient online booking and digital reports'
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="bg-emerald-400 rounded-full p-1">
                    <Shield className="h-3 w-3 text-emerald-900" />
                  </div>
                  <span className="text-emerald-100 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-emerald-800/50 backdrop-blur p-8 rounded-2xl border border-emerald-700">
            <p className="italic text-emerald-100 text-lg leading-relaxed">
              "The care I received at Dermacare was exceptional. The doctors are truly experts and the facility is top-notch."
            </p>
            <div className="mt-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-emerald-400"></div>
              <div>
                <p className="font-bold text-sm">Jane Doe</p>
                <p className="text-emerald-400 text-xs">Patient since 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
