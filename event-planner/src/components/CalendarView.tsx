'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import '@/styles/calendar.css';

export default function CalendarView() {
  const [events, setEvents] = useState<any[]>([]);
  const [importanceFilter, setImportanceFilter] = useState<'all' | 'normal' | 'important' | 'critical'>('all');
  const router = useRouter();

useEffect(() => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, 'events'), where('userId', '==', user.uid));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const calendarEvents = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        date: data.datetime?.toDate ? data.datetime.toDate().toISOString().split('T')[0] : null,
        importance: data.importance || 'normal',
      };
    });
    setEvents(calendarEvents);
  });

  return () => unsubscribe();
}, []);


  const filteredEvents = events.filter((event) => {
    return importanceFilter === 'all' || event.importance === importanceFilter;
  });

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <select
        className="mb-4 p-2 border rounded text-shadow-teal-400"
        value={importanceFilter}
        onChange={(e) => setImportanceFilter(e.target.value as any)}
      >
        <option value="all">Усі</option>
        <option value="normal">Звичайна</option>
        <option value="important">Важлива</option>
        <option value="critical">Критична</option>
      </select>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={filteredEvents}
        height="auto"
        eventClassNames={(arg) => {
          const importance = arg.event.extendedProps.importance;
          switch (importance) {
            case 'critical':
              return ['bg-red-500', 'text-white'];
            case 'important':
              return ['bg-yellow-400', 'text-black'];
            default:
              return ['bg-green-400', 'text-black'];
          }
        }}
        eventClick={(info) => {
          const eventId = info.event.id;
          router.push(`/events/${eventId}`);
        }}
      />
    </div>
  );
}
