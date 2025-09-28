// src/components/customer/mycoach/UnifiedSharedFiles.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, File, FileText, Image, Video, Music, Archive, Eye, FolderOpen } from 'lucide-react';
import { sharedFiles } from '@/mockdata/mycoach/coachData';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
        case 'doc':
        case 'docx':
            return FileText;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
            return Image;
        case 'mp4':
        case 'mov':
        case 'avi':
            return Video;
        case 'mp3':
        case 'wav':
        case 'flac':
            return Music;
        case 'zip':
        case 'rar':
        case '7z':
            return Archive;
        default:
            return File;
    }
};

const getFileTypeColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'pdf':
            return 'from-red-500/20 to-red-600/10 text-red-600';
        case 'doc':
        case 'docx':
            return 'from-blue-500/20 to-blue-600/10 text-blue-600';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'webp':
            return 'from-green-500/20 to-green-600/10 text-green-600';
        case 'mp4':
        case 'mov':
        case 'avi':
            return 'from-purple-500/20 to-purple-600/10 text-purple-600';
        case 'mp3':
        case 'wav':
        case 'flac':
            return 'from-orange-500/20 to-orange-600/10 text-orange-600';
        default:
            return 'from-primary/20 to-primary/10 text-primary';
    }
};

interface FileItemProps {
    file: (typeof sharedFiles)[0];
    index: number;
}

const FileItem: React.FC<FileItemProps> = ({ file, index }) => {
    const Icon = getFileIcon(file.name);
    const colorClass = getFileTypeColor(file.name);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
        >
            <div className="flex items-center justify-between p-4 border rounded-xl bg-card hover:bg-accent/5 transition-all duration-300 hover:shadow-md hover:border-primary/20">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className={cn(
                        "w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-105",
                        colorClass
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="font-medium text-foreground overflow-hidden whitespace-nowrap text-ellipsis group-hover:text-primary transition-colors">
                            {file.name}
                        </h4>
                        <p className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                            {file.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Shared {file.date}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-60 hover:opacity-100 transition-all hover:bg-primary/10"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-60 hover:opacity-100 transition-all hover:bg-primary/10"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

interface FileListProps {
    isDrawer?: boolean;
}

const FileList: React.FC<FileListProps> = ({ isDrawer = false }) => {
    if (sharedFiles.length === 0) {
        return (
            <Card className="shadow-lg border-0 rounded-2xl">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <FolderOpen className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">No files yet</h4>
                    <p className="text-muted-foreground text-sm">
                        Your coach hasn't shared any files with you yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3">
            {sharedFiles.map((file, index) => (
                <FileItem key={file.id} file={file} index={index} />
            ))}
        </div>
    );
};

interface UnifiedSharedFilesProps {
    className?: string;
}

const UnifiedSharedFiles: React.FC<UnifiedSharedFilesProps> = ({ className }) => {
    return (
        <Card className={cn("shadow-lg border-0 rounded-2xl animate-fade-in", className)}>
            <CardHeader className="p-6 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                            <File className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-semibold">Shared Files</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                {sharedFiles.length} file{sharedFiles.length !== 1 ? 's' : ''} shared
                            </p>
                        </div>
                    </div>
                    {sharedFiles.length > 0 && (
                        <Button variant="outline" size="sm" className="hover:bg-primary/5">
                            View All
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
                <FileList />
            </CardContent>
        </Card>
    );
};

// Drawer Content Component for mobile
export const SharedFilesDrawerContent = () => {
    return (
        <div className="h-full overflow-y-auto p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <File className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Shared Files</h3>
                    <p className="text-sm text-muted-foreground">
                        {sharedFiles.length} file{sharedFiles.length !== 1 ? 's' : ''} from your coach
                    </p>
                </div>
            </div>
            <Separator />
            <FileList isDrawer={true} />
        </div>
    );
};

export default UnifiedSharedFiles;