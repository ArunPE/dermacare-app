import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Playwright Mock Auth
    const isTestMode = localStorage.getItem('playwright-test-mode') === 'true';
    const isAdminMode = localStorage.getItem('playwright-admin-mode') === 'true';
    
    if (isTestMode || isAdminMode) {
      const mockUser = {
        uid: isAdminMode ? 'admin-user-123' : 'test-user-123',
        email: isAdminMode ? 'arun.pt.kumar@gmail.com' : 'test@example.com',
        displayName: isAdminMode ? 'Admin User' : 'Test Patient',
        photoURL: 'https://picsum.photos/seed/test/200',
        emailVerified: true,
      } as User;
      setUser(mockUser);
      setProfile({
        uid: isAdminMode ? 'admin-user-123' : 'test-user-123',
        email: isAdminMode ? 'arun.pt.kumar@gmail.com' : 'test@example.com',
        displayName: isAdminMode ? 'Admin User' : 'Test Patient',
        role: isAdminMode ? 'admin' : 'patient',
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          // Create default profile for new user
          const isBootstrapAdmin = user.email === 'arun.pt.kumar@gmail.com';
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: isBootstrapAdmin ? 'admin' : 'patient',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = profile?.role === 'admin' || user?.email === 'arun.pt.kumar@gmail.com';

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
