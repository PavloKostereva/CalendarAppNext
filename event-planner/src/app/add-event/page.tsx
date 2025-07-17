'use client';

import EventForm from '@/components/EventForm';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';

export default function AddEventPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) return <p>Завантаження...</p>;

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Додати подію</h1>
      <EventForm />
    </div>
  );
}
