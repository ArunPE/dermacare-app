import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { Search, Star, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  experience: string;
  rating: number;
}

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    specialty: 'Medical Dermatology',
    bio: 'Specialist in chronic skin conditions and autoimmune disorders.',
    image: 'https://picsum.photos/seed/doc1/400/400',
    experience: '12 Years',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialty: 'Cosmetic Surgery',
    bio: 'Expert in aesthetic rejuvenation and minimally invasive procedures.',
    image: 'https://picsum.photos/seed/doc2/400/400',
    experience: '15 Years',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Pediatric Dermatology',
    bio: 'Dedicated to providing gentle care for children and infants.',
    image: 'https://picsum.photos/seed/doc3/400/400',
    experience: '8 Years',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Dr. Michael Chen',
    specialty: 'Skin Cancer Specialist',
    bio: 'Focused on early detection and advanced surgical treatments.',
    image: 'https://picsum.photos/seed/doc4/400/400',
    experience: '20 Years',
    rating: 4.7
  }
];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-emerald-900 tracking-tight">Meet Our Specialists</h1>
          <p className="text-slate-500">World-class dermatologists dedicated to your skin health.</p>
        </div>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="doctor-search-input"
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-emerald-100 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredDoctors.map((doctor, i) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-3xl overflow-hidden border border-emerald-50 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-slate-700">{doctor.rating}</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-emerald-900" data-testid={`doctor-name-${doctor.id}`}>{doctor.name}</h3>
                <p className="text-emerald-600 text-sm font-medium" data-testid={`doctor-specialty-${doctor.id}`}>{doctor.specialty}</p>
              </div>
              
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                {doctor.bio}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-emerald-50">
                <div className="flex items-center text-slate-400 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{doctor.experience} exp.</span>
                </div>
                <Link
                  to="/booking"
                  state={{ doctorId: doctor.id, doctorName: doctor.name }}
                  data-testid={`book-doctor-${doctor.id}`}
                  className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-emerald-200">
          <p className="text-slate-500">No doctors found matching your search.</p>
        </div>
      )}
    </div>
  );
}
