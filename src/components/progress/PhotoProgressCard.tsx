// src/components/customer/progress/PhotoProgressCard.tsx
import { PhotoEntry } from '@/mockdata/progress/mockProgressData';
import { Button } from '@/components/ui/button';
import { Camera, ArrowRight } from 'lucide-react';

export default function PhotoProgressCard({ photos }: { photos: PhotoEntry[] }) {
  const latestPhoto = photos[photos.length - 1];
  const previousPhoto = photos[photos.length - 2];

  return (
    <div className="bg-card dark:bg-[#0d1218] p-4 rounded-xl border border-border/50">
      <h3 className="font-semibold mb-4">Progression Photos</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {previousPhoto && (
            <div>
                <img src={previousPhoto.imageUrl} alt="Previous" className="aspect-square w-full object-cover rounded-lg" />
                <p className="text-xs text-center mt-1 text-muted-foreground">{previousPhoto.date}</p>
            </div>
        )}
        {latestPhoto && (
             <div>
                <img src={latestPhoto.imageUrl} alt="Latest" className="aspect-square w-full object-cover rounded-lg" />
                <p className="text-xs text-center mt-1 text-muted-foreground">{latestPhoto.date}</p>
            </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="w-full"><Camera className="h-4 w-4 mr-2" />Add Photo</Button>
        <Button variant="ghost" className="w-full">View All <ArrowRight className="h-4 w-4 ml-2" /></Button>
      </div>
    </div>
  );
}
