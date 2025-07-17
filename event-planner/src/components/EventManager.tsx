'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { EventItem } from '@/types/event';
import { onAuthStateChanged } from 'firebase/auth';
import dayjs from 'dayjs';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from 'next/navigation';

export default function EventManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [importanceFilter, setImportanceFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchEvents = async () => {
      const q = query(collection(db, 'events'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const data: EventItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as EventItem[];
      setEvents(data);
    };
    fetchEvents();
  }, [userId]);

  const filteredEvents = events.filter((event) => {
    const matchesImportance = importanceFilter
      ? event.importance === importanceFilter
      : true;

    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesImportance && matchesSearch;
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Перемкнути на {view === 'list' ? 'Календар' : 'Список'}
        </button>

        <select
          value={importanceFilter}
          onChange={(e) => setImportanceFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Уся важливість</option>
          <option value="normal">Звичайна</option>
          <option value="important">Важлива</option>
          <option value="critical">Критична</option>
        </select>

        <input
          type="text"
          placeholder="Пошук подій"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
      </div>

      {view === 'list' ? (
        <ul className="space-y-3">
          {filteredEvents.map((event) => (
            <li key={event.id} className="border p-3 rounded shadow">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {event.description || 'Без опису'}
              </p>
              <p className="text-sm">
                📅 {dayjs(event.datetime.toDate()).format('YYYY-MM-DD HH:mm')}
              </p>
              <p className="text-sm"> {event.importance}</p>
            </li>
          ))}
          {filteredEvents.length === 0 && <p>Немає подій за заданими критеріями.</p>}
        </ul>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          height="auto"
          events={filteredEvents.map((event) => ({
            id: event.id,
            title: event.title,
            date: event.datetime.toDate().toISOString().split('T')[0],
            importance: event.importance,
          }))}
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
            router.push(`/events/${info.event.id}`);
          }}
        />
      )}
    </div>
  );
}
