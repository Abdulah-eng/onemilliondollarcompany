// src/components/customer/mycoach/SharedFilesCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileList from './FileListItem'; // UPDATED IMPORT PATH

const SharedFilesCard = () => {
    return (
        <Card className="shadow-lg border-none animate-fade-in min-w-0">
            <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-xl font-semibold">Shared Files</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 min-w-0">
                <FileList />
            </CardContent>
        </Card>
    );
};

export default SharedFilesCard;
