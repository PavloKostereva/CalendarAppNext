'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { EventItem } from '@/types/event';

export default function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [datetime, setDatetime] = useState('');
  const [importance, setImportance] = useState('звичайна');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert('Будь ласка, увійдіть.');
      return;
    }

    const newEvent: Omit<EventItem, 'id'> = {
      userId: user.uid,
      title,
      description,
      datetime: new Date(datetime),
      importance: importance as EventItem['importance'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        datetime: Timestamp.fromDate(newEvent.datetime),
        createdAt: Timestamp.fromDate(newEvent.createdAt!),
        updatedAt: Timestamp.fromDate(newEvent.updatedAt!),
      });
      router.push('/');
    } catch (error) {
      console.error('Помилка додавання події:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Назва події"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border rounded p-2"
      />
      <textarea
        placeholder="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded p-2"
      />
      <input
        type="datetime-local"
        value={datetime}
        onChange={(e) => setDatetime(e.target.value)}
        required
        className="w-full border rounded p-2"
      />
      <select
        value={importance}
        onChange={(e) => setImportance(e.target.value)}
        className="w-full border rounded p-2"
      >
        <option value="звичайна">Звичайна</option>
        <option value="важлива">Важлива</option>
        <option value="критична">Критична</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
        Додати подію
      </button>
    </form>
  );
}
