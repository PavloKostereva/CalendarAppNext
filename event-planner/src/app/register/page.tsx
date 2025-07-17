'use client';

import AuthForm from '@/components/AuthForm';
import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe();
  }, []);

  return <AuthForm />;
}
