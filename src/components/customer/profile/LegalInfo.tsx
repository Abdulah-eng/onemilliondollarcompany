import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LegalInfo = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-md rounded-2xl p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          <a href="#" className="text-primary-500 font-medium mt-2 block">Read Privacy Policy</a>
        </CardContent>
      </Card>
      
      <Card className="shadow-md rounded-2xl p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-muted-foreground">
            By using our services, you agree to our Terms & Conditions. These terms govern your use of the platform.
          </p>
          <a href="#" className="text-primary-500 font-medium mt-2 block">Read Terms & Conditions</a>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalInfo;
