import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import ClientRequests from '@/components/coach/client-overview/ClientRequests';
import ClientFilters from '@/components/coach/client-overview/ClientFilters';
import ClientList from '@/components/coach/client-overview/ClientList';
import ClientDetailModal from '@/components/coach/client-detail/ClientDetailModal';

// Mock data mapping request IDs to client data
const mockRequestToClientData = {
  '1': {
    name: 'Emily Clark',
    plan: 'Trial',
    status: 'Pending Review',
    color: 'bg-blue-500',
    profilePicture: 'https://i.pravatar.cc/150?u=emily-clark',
    personalInfo: {
      age: 25,
      gender: 'Female',
      height: '165 cm',
      weight: '68 kg',
      location: 'London, UK',
    },
    goals: ['Weight Loss', 'Energy'],
    preferences: {
      injuries: ['None'],
      allergies: ['None'],
      likes: ['Yoga', 'Swimming'],
      dislikes: ['Heavy lifting'],
      preferredProgramType: ['Fitness', 'Mental Health'],
    },
    vitalStats: {
      avgHeartRate: '72 bpm',
      avgSleep: '7.8 hours',
      avgHydration: '2.2 L',
      avgMood: 'Good',
    },
  },
  '2': {
    name: 'David Rodriguez',
    plan: 'Standard',
    status: 'Needs Feedback',
    color: 'bg-orange-500',
    profilePicture: 'https://i.pravatar.cc/150?u=david-rodriguez',
    personalInfo: {
      age: 32,
      gender: 'Male',
      height: '178 cm',
      weight: '82 kg',
      location: 'Manchester, UK',
    },
    goals: ['Muscle Gain', 'Nutrition'],
    preferences: {
      injuries: ['Lower back'],
      allergies: ['Shellfish'],
      likes: ['Weight training', 'Protein shakes'],
      dislikes: ['Cardio'],
      preferredProgramType: ['Fitness'],
    },
    vitalStats: {
      avgHeartRate: '68 bpm',
      avgSleep: '6.5 hours',
      avgHydration: '3.0 L',
      avgMood: 'Excellent',
    },
  },
  '3': {
    name: 'Jessica Williams',
    plan: 'Trial',
    status: 'Active',
    color: 'bg-green-500',
    profilePicture: 'https://i.pravatar.cc/150?u=jessica-williams',
    personalInfo: {
      age: 29,
      gender: 'Female',
      height: '170 cm',
      weight: '60 kg',
      location: 'Birmingham, UK',
    },
    goals: ['Better Sleep', 'Stress Reduction'],
    preferences: {
      injuries: ['None'],
      allergies: ['Nuts'],
      likes: ['Meditation', 'Pilates'],
      dislikes: ['High intensity workouts'],
      preferredProgramType: ['Mental Health'],
    },
    vitalStats: {
      avgHeartRate: '65 bpm',
      avgSleep: '8.2 hours',
      avgHydration: '2.8 L',
      avgMood: 'Great',
    },
  },
};

const ClientOverviewPage = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const handleClientRequestClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleCloseModal = () => {
    setSelectedClientId(null);
  };

  const selectedClient = selectedClientId ? mockRequestToClientData[selectedClientId as keyof typeof mockRequestToClientData] : null;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Client Management 🚀</h1>
          <p className="text-md text-muted-foreground">
            A detailed overview of all your clients, their status, and new requests.
          </p>
        </div>

        <ClientRequests onClientClick={handleClientRequestClick} />

        <div className="space-y-6">
          <ClientFilters />
          <ClientList />
        </div>
      </div>

      <ClientDetailModal
        client={selectedClient}
        isMobile={isMobile}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default ClientOverviewPage;
