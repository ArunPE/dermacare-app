import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, LogOut, Menu, X, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile, logout, login, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Departments', path: '/departments' },
    { name: 'Doctors', path: '/doctors' },
  ];

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2" data-testid="nav-logo">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-900 tracking-tight">Dermacare</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.name.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    location.pathname === link.path ? 'text-emerald-600' : 'text-slate-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4" data-testid="user-menu">
                  <Link
                    to="/dashboard"
                    data-testid="nav-link-dashboard"
                    className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-emerald-600"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      data-testid="nav-link-admin"
                      className="flex items-center space-x-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                  <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-emerald-200">
                    <img src={user.photoURL || ''} alt="Profile" referrerPolicy="no-referrer" />
                  </div>
                  <button
                    onClick={logout}
                    data-testid="logout-button"
                    className="text-slate-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  data-testid="login-button"
                  className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-emerald-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-base font-medium text-slate-600"
                  >
                    {link.name}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-base font-medium text-slate-600"
                    >
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-base font-medium text-emerald-700"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left text-base font-medium text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      login();
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-emerald-100 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-emerald-600 p-1.5 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-emerald-900">Dermacare Clinic</span>
              </div>
              <p className="text-slate-500 max-w-sm">
                Advanced dermatological care with a focus on skin health and aesthetic excellence. 
                Our team of experts is dedicated to providing personalized treatments.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><Link to="/doctors">Our Doctors</Link></li>
                <li><Link to="/departments">Specialties</Link></li>
                <li><Link to="/booking">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 mb-4">Contact</h4>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li>Plot No. 45, Banjara Hills, Road No. 12</li>
                <li>Hyderabad, Telangana 500034, India</li>
                <li>contact@dermacare.clinic</li>
                <li>+91 40 2345 6789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-50 mt-12 pt-8 text-center text-slate-400 text-xs">
            © 2026 Dermacare Clinic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
