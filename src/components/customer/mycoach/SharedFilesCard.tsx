// src/components/customer/mycoach/SharedFilesCard.tsx (UPDATED)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Assuming the import path for the new helper is correct
import FileList from './FileListItem'; 

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
