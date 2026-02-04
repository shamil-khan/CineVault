import { useState } from 'react';
import { Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompactFolderUpload } from '@/components/CompactFolderUpload';
import { FileProcessingPanel } from '@/components/library/FileProcessingPanel';
import { LibrarySearchBar } from '@/components/library/LibrarySearchBar';
import { LibraryFilterBar } from '@/components/library/LibraryFilterBar';
import { LibraryFilterToggleGroup } from '@/components/library/LibraryFilterToggleGroup';
import { useDataManagementDialog } from '@/hooks/useDataManagementDialog';

export const LibraryHeader = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
  const { open: openDataManagement } = useDataManagementDialog();

  return (
    <div className='p-4 space-y-4'>
      <div className='flex w-full items-center flex-col sm:flex-row gap-4 sm:gap-2 relative z-20'>
        <div className='w-full sm:flex-1'>
          <LibrarySearchBar />
        </div>

        <div className='flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto'>
          <CompactFolderUpload
            onUploaded={(fileNames) => setUploadedFileNames(fileNames)}
            uploadedFileNames={uploadedFileNames}
          />

          <LibraryFilterToggleGroup
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          <Button
            variant='outline'
            size='icon'
            onClick={openDataManagement}
            title='Manage Data'>
            <Database className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {showFilters && <LibraryFilterBar />}
      <FileProcessingPanel fileNames={uploadedFileNames} />
    </div>
  );
};
