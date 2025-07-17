import EditEventForm from '@/components/EditEventForm';

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Редагування події</h1>
      <EditEventForm eventId={params.id} />
    </main>
  );
}
