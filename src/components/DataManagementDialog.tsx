import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Check,
  ChevronRight,
  FileJson,
  AlertOctagon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  SYSTEM_CATEGORY_IMPORT,
  SYSTEM_CATEGORY_SEARCHED,
  SYSTEM_CATEGORY_UPLOADED,
} from '@/services/MovieDbService';
import { useMovieLibrary } from '@/hooks/useMovieLibrary';
import { useMovieProcessor } from '@/hooks/useMovieProcessor';
import { useImportExport } from '@/hooks/useImportExport';
import { useDataManagementDialog } from '@/hooks/useDataManagementDialog';
import { cn } from '@/lib/utils';
import { APP_TITLE } from '@/utils/Helper';
import logger from '@/core/logger';

export const DataManagementDialog = () => {
  const { isOpen, close } = useDataManagementDialog();
  const { movies, categories, handleClearLibrary } = useMovieLibrary();
  const { clear } = useMovieProcessor();
  const { exportMovies, importMovies } = useImportExport();
  const [deleteCategories, setDeleteCategories] = useState(false);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userCategories = categories.filter(
    (c) =>
      c.name !== SYSTEM_CATEGORY_IMPORT &&
      c.name !== SYSTEM_CATEGORY_SEARCHED &&
      c.name !== SYSTEM_CATEGORY_UPLOADED,
  );

  const toggleCategory = (id: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleExport = () => {
    if (selectedCatIds.length === 0) {
      toast.error('Please select at least one category to export');
      return;
    }
    const exportFile = exportMovies(selectedCatIds);
    const blob = new Blob([exportFile], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 1. Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `${APP_TITLE.toLowerCase().replace(' ', '')}_export_${new Date().toISOString().split('.')[0]}Z.json`;
    document.body.appendChild(link);
    link.click();

    // 4. Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Movies exported successfully');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      toast.error('Please select a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await importMovies(json);
      } catch (err) {
        toast.error('Failed to parse JSON file');
        logger.error('Failed to parse JSON file', err);
      }
    };
    reader.readAsText(file);

    // Reset input
    e.target.value = '';
  };

  const handleClearLibraryWithReset = async () => {
    clear();
    await handleClearLibrary(deleteCategories);
    setDeleteCategories(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='w-[calc(100%-2rem)] sm:max-w-md rounded-lg'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FileJson className='w-5 h-5 text-blue-500' />
            Manage Movie Data
          </DialogTitle>
          <DialogDescription>
            Export movies with categories or import from a JSON file or Delete
            whole library.
          </DialogDescription>
        </DialogHeader>

        <Accordion type='single' collapsible defaultValue='plans'>
          {/* Export Section */}
          <AccordionItem value='export' disabled={userCategories.length === 0}>
            <AccordionTrigger>
              <h4 className='text-sm font-semibold flex items-center gap-2'>
                <Download className='w-4 h-4' />
                Export Movies With Categories
              </h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1'>
                  {userCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={cn(
                        'flex items-center justify-between p-2 rounded-md border cursor-pointer transition-all text-sm',
                        selectedCatIds.includes(cat.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'hover:bg-accent border-transparent',
                      )}>
                      <span className='truncate'>{cat.name}</span>
                      <span className='text-xs text-muted-foreground font-normal'>
                        (
                        {
                          movies.filter((m) =>
                            m.categories?.some((c) => c.id === cat.id),
                          ).length
                        }
                        )
                      </span>
                      {selectedCatIds.includes(cat.id) && (
                        <Check className='w-4 h-4 shrink-0' />
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleExport}
                  className='w-full'
                  disabled={selectedCatIds.length === 0}>
                  Download JSON
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Import Section */}
          <AccordionItem value='import'>
            <AccordionTrigger>
              <h4 className='text-sm font-semibold flex items-center gap-2'>
                <Upload className='w-4 h-4' />
                Import Movies With Categories
              </h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3'>
                <p className='text-xs text-muted-foreground'>
                  Select a CineVault JSON file to import movies and categories.
                </p>
                <input
                  type='file'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept='.json,application/json'
                  className='hidden'
                />
                <Button
                  variant='outline'
                  onClick={handleImportClick}
                  className='w-full flex items-center gap-2'>
                  Choose File
                  <ChevronRight className='w-4 h-4 ml-auto' />
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Delete Section */}
          <AccordionItem value='delete'>
            <AccordionTrigger>
              <h4 className='text-sm font-semibold flex items-center gap-2 text-destructive'>
                <AlertOctagon className='h-5 w-5' /> Delete {APP_TITLE}?
              </h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-3'>
                <p className='text-xs text-muted-foreground'>
                  This will permanently delete ALL movies, files, and posters
                  from your local database. This action cannot be undone.
                </p>
                {userCategories.length > 0 && (
                  <>
                    <div className='mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 max-h-40 overflow-y-auto'>
                      <p className='mb-2 text-xs font-medium text-destructive'>
                        Categories in {APP_TITLE}
                      </p>
                      <ul className='space-y-1 text-xs'>
                        {userCategories.map((category) => (
                          <li
                            key={category.id}
                            className='flex items-center justify-between'>
                            <span>{category.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className='mt-4 flex items-center justify-between rounded-md border p-3'>
                      <div className='space-y-1'>
                        <p className='text-sm font-medium'>
                          Also delete categories
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          If enabled, all categories will be removed. Otherwise
                          categories are kept.
                        </p>
                      </div>

                      <Button
                        type='button'
                        variant={deleteCategories ? 'destructive' : 'outline'}
                        size='sm'
                        onClick={() => setDeleteCategories((prev) => !prev)}>
                        {deleteCategories ? 'Will delete' : 'Keep categories'}
                      </Button>
                    </div>
                  </>
                )}
                <Button
                  variant='destructive'
                  className='w-full'
                  onClick={handleClearLibraryWithReset}>
                  Delete
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};
