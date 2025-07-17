'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { EventItem } from '@/types/event';

export default function EditEventForm({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadEvent = async () => {
      const docRef = doc(db, 'events', eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEvent({
          id: docSnap.id,
          ...data,
          datetime: data.datetime.toDate(),
        } as EventItem);
      }
    };
    loadEvent();
  }, [eventId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      const docRef = doc(db, 'events', eventId);
      await updateDoc(docRef, {
        title: event.title,
        description: event.description,
        datetime: Timestamp.fromDate(new Date(event.datetime)),
        importance: event.importance,
        updatedAt: new Date(),
      });
      router.push('/');
    } catch (err) {
      console.error('Помилка оновлення:', err);
    }
  };

  if (!event) return <p>Завантаження...</p>;

  return (
    <form onSubmit={handleUpdate} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        value={event.title}
        onChange={(e) => setEvent({ ...event, title: e.target.value })}
        className="w-full border rounded p-2"
      />
      <textarea
        value={event.description}
        onChange={(e) => setEvent({ ...event, description: e.target.value })}
        className="w-full border rounded p-2"
      />
      <input
        type="datetime-local"
        value={new Date(event.datetime).toISOString().slice(0, 16)}
        onChange={(e) => setEvent({ ...event, datetime: new Date(e.target.value) })}
        className="w-full border rounded p-2"
      />
      <select
        value={event.importance}
        onChange={(e) =>
          setEvent({ ...event, importance: e.target.value as EventItem['importance'] })
        }
        className="w-full border rounded p-2"
      >
        <option value="звичайна">Звичайна</option>
        <option value="важлива">Важлива</option>
        <option value="критична">Критична</option>
      </select>
      <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded">
        Зберегти зміни
      </button>
    </form>
  );
}
