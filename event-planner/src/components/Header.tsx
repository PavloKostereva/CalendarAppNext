'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">Планувальник подій</Link>

      <nav className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm hidden sm:inline">
              👤 {user.displayName || user.email}
            </span>
            <Link href="/add-event" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">Додати подію</Link>
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-500">Вийти</button>
          </>
        ) : (
          <>
            <Link href="/register" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500">Увійти</Link>
            <Link href="/login" className="bg-green-600 px-3 py-1 rounded hover:bg-green-500">Реєстрація</Link>
          </>
        )}
      </nav>
    </header>
  );
}
