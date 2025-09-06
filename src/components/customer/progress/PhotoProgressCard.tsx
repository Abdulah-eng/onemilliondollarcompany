// src/components/customer/progress/PhotoProgressCard.tsx
import { PhotoEntry } from '@/mockdata/progress/mockProgressData';
import { Button } from '@/components/ui/button';
import { Camera, Maximize, GitCompare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PhotoProgressCard({ photos }: { photos: PhotoEntry[] }) {
  const sortedPhotos = [...photos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestPhoto = sortedPhotos[0];
  const olderPhotos = sortedPhotos.slice(1);

  return (
    <motion.div 
      className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Progress Photos</h3>
        <Button variant="outline" size="sm" className="gap-2"><Camera className="h-4 w-4" />Add New</Button>
      </div>
      
      {/* Latest Photo Section */}
      {latestPhoto && (
        <div className="mb-6 rounded-xl overflow-hidden relative group">
          <img 
            src={latestPhoto.imageUrl} 
            alt={`Latest progress photo taken on ${latestPhoto.date}`} 
            className="w-full aspect-[3/4] object-cover" 
          />
          <div className="absolute top-0 left-0 p-3 bg-background/50 backdrop-blur-sm rounded-br-lg text-sm font-semibold text-foreground/80">
            Latest: {new Date(latestPhoto.date).toLocaleDateString()}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <Button variant="ghost" className="h-10 w-10 p-0 text-white hover:bg-white/20">
              <Maximize className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Photo Snapshots Section */}
      {olderPhotos.length > 0 && (
        <>
          <h4 className="text-lg font-semibold mb-3">Snapshots</h4>
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
            {olderPhotos.map((photo) => (
              <div key={photo.id} className="flex-shrink-0 w-32 group relative">
                <img 
                  src={photo.imageUrl} 
                  alt={`Progress photo on ${photo.date}`} 
                  className="aspect-[3/4] w-full object-cover rounded-lg" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 rounded-lg">
                  <Button variant="ghost" className="h-10 w-10 p-0 text-white hover:bg-white/20 mb-2">
                    <Maximize className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" className="h-10 w-10 p-0 text-white hover:bg-white/20">
                    <GitCompare className="h-6 w-6" />
                  </Button>
                </div>
                <p className="text-xs text-center mt-1 text-muted-foreground">{new Date(photo.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
