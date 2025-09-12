import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
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
    name: 'John Smith',
    plan: 'Premium',
    status: 'Needs Feedback',
    color: 'bg-orange-500',
    profilePicture: 'https://i.pravatar.cc/150?u=john-smith',
    personalInfo: {
      age: 32,
      gender: 'Male',
      height: '178 cm',
      weight: '82 kg',
      location: 'Manchester, UK',
    },
    goals: ['Muscle Gain', 'Strength'],
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
    name: 'Sarah Johnson',
    plan: 'Standard',
    status: 'Active',
    color: 'bg-green-500',
    profilePicture: 'https://i.pravatar.cc/150?u=sarah-johnson',
    personalInfo: {
      age: 29,
      gender: 'Female',
      height: '170 cm',
      weight: '60 kg',
      location: 'Birmingham, UK',
    },
    goals: ['Flexibility', 'Stress Relief'],
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

const ClientRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const clientData = id ? mockRequestToClientData[id as keyof typeof mockRequestToClientData] : null;

  const handleClose = () => {
    navigate('/coach/dashboard');
  };

  if (!clientData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Request not found</p>
      </div>
    );
  }

  return (
    <ClientDetailModal
      client={clientData}
      isMobile={isMobile}
      onClose={handleClose}
    />
  );
};

export default ClientRequestPage;