'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { EventItem } from '@/types/event';
import { useRouter } from 'next/navigation';

export default function EventList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'events'),
      where('userId', '==', user.uid),
      orderBy('datetime', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: EventItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        datetime: doc.data().datetime.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      } as EventItem));
      setEvents(items);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Ви дійсно хочете видалити цю подію?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      console.error('Помилка видалення:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-2">Мої події</h2>
      {events.length === 0 ? (
        <p>Подій ще немає.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="border rounded p-3">
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.datetime.toLocaleString()}</p>
              <p>{event.description}</p>
              <span className="text-xs px-2 py-1 rounded bg-black-200 inline-block mb-2">
                {event.importance}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/edit-event/${event.id}`)}
                  className="text-blue-600 hover:underline"
                >
                   Редагувати
                </button>
                <button
                  onClick={() => handleDelete(event.id!)}
                  className="text-red-600 hover:underline"
                >
                   Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
