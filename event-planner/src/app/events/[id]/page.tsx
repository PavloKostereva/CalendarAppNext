'use client';

import dynamic from 'next/dynamic';
// import EventManager from '../../../components/EventManager'

const EventManager = dynamic(() => import('@/components/EventManager'), { ssr: false });
export default function EventsPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Усі події</h1>
      <EventManager />
    </main>
  );
}
