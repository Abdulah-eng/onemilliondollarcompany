// src/components/customer/progress/PhotoProgressCard.tsx
import { PhotoEntry } from '@/mockdata/progress/mockProgressData';
import { Button } from '@/components/ui/button';
import { Camera, Maximize } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PhotoProgressCard({ photos }: { photos: PhotoEntry[] }) {
  return (
    <motion.div 
        className="bg-card dark:bg-[#0d1218] p-4 sm:p-6 rounded-2xl border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Progress Photos</h3>
        <Button variant="outline" size="sm"><Camera className="h-4 w-4 mr-2" />Add New</Button>
      </div>
      <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
        {photos.map((photo) => (
          <div key={photo.id} className="flex-shrink-0 w-32 group relative">
            <img src={photo.imageUrl} alt={`Progress on ${photo.date}`} className="aspect-[3/4] w-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize className="h-6 w-6 text-white" />
            </div>
            <p className="text-xs text-center mt-1 text-muted-foreground">{photo.date}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
