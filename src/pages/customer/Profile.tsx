import ProfileHeader from '@/components/customer/profile/ProfileHeader';
import PersonalInfoSection from '@/components/customer/profile/PersonalInfoSection';
import PaymentAndLegal from '@/components/customer/profile/PaymentAndLegal';
import PaymentHistoryTable from '@/components/customer/profile/PaymentHistoryTable';

const ProfilePage = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="px-2">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-lg text-muted-foreground">View all your profile details here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileHeader />
          <PersonalInfoSection />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <PaymentAndLegal />
          <PaymentHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
