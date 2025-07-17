'use client';

import { useState } from 'react';
import EventList from '@/components/EventList';
import CalendarView from '@/components/CalendarView';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Планувальник подій</h1>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-orange-400' : 'bg-gray-200'}`}
        >
          Список
        </button>
        <button
          onClick={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded ${viewMode === 'calendar' ? 'bg-blue-600 text-orange-400' : 'bg-gray-200'}`}
        >
          Календар
        </button>
      </div>

      {viewMode === 'list' ? <EventList /> : <CalendarView />}
    </main>
  );
}
