import EventList from './EventList';

export default async function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Available Events</h1>
      <EventList />
    </div>
  );
} 