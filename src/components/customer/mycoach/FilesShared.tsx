// src/components/customer/mycoach/FilesShared.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { sharedFiles } from '@/mockdata/mycoach/coachData';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FilesShared = () => {
  return (
    <Card className="shadow-lg border-none animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Shared Files</CardTitle>
      </CardHeader>
      <CardContent>
        {sharedFiles.length > 0 ? (
          <div className="space-y-4">
            {sharedFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-4 border rounded-xl bg-background/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <file.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium">{file.name}</h4>
                    <p className="text-sm text-muted-foreground">{file.description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground p-6">Your coach has not shared any files with you yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesShared;
