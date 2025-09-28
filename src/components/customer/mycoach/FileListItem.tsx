// src/components/customer/mycoach/FileListItem.tsx (NEW HELPER)
import { Download, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Assuming a file type from coachData.ts
interface FileItem {
    id: number;
    name: string;
    description: string;
}

const FileListItem: React.FC<{ file: FileItem }> = ({ file }) => (
    <div key={file.id} className="flex items-center justify-between p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 min-w-0">
        <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                <File className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
                <h4 className="font-medium overflow-hidden whitespace-nowrap text-ellipsis">{file.name}</h4>
                <p className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">{file.description}</p>
            </div>
        </div>
        <Button variant="ghost" size="sm" className="flex-shrink-0 ml-2">
            <Download className="w-4 h-4" />
        </Button>
    </div>
);

const FileList: React.FC = () => {
    const files = sharedFiles; // Assume sharedFiles is imported or passed as prop

    return files.length > 0 ? (
        <div className="space-y-4">
            {files.map(file => <FileListItem key={file.id} file={file} />)}
        </div>
    ) : (
        <p className="text-center text-muted-foreground p-6">Your coach has not shared any files with you yet.</p>
    );
}

export default FileList;
