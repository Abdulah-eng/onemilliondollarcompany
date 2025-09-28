// src/components/customer/mycoach/SharedFilesDrawerContent.tsx
import { Separator } from '@/components/ui/separator';
import FileList from './FileListItem'; // UPDATED IMPORT PATH

const SharedFilesDrawerContent = () => {
    return (
        <div className="h-full overflow-y-auto p-6 space-y-4">
            <h3 className="text-xl font-bold">Shared Files</h3>
            <Separator />
            <FileList />
        </div>
    );
};

export default SharedFilesDrawerContent;
