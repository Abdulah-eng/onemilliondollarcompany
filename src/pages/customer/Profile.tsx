import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ProfileInfo from '@/components/customer/profile/ProfileInfo';
import GoalsAndPreferences from '@/components/customer/profile/GoalsAndPreferences';
import PaymentSettings from '@/components/customer/profile/PaymentSettings';
import LegalInfo from '@/components/customer/profile/LegalInfo';

const ProfilePage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="px-2">
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-1 text-lg text-muted-foreground">Manage your personal information, goals, settings, and more.</p>
      </div>
      
      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="goals">Goals & Prefs</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <ProfileInfo />
        </TabsContent>
        <TabsContent value="goals" className="mt-6">
          <GoalsAndPreferences />
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
          <PaymentSettings />
        </TabsContent>
        <TabsContent value="legal" className="mt-6">
          <LegalInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
