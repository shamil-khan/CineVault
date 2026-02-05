import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  Download,
  Upload,
  Check,
  ChevronRight,
  FileJson,
  AlertOctagon,
  RotateCcw,
  Zap,
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
import { useMovieLibrary } from '@/hooks/useMovieLibrary';
import { useMovieProcessor } from '@/hooks/useMovieProcessor';
import { useImportExport } from '@/hooks/useImportExport';
import { useDataManagementDialog } from '@/hooks/useDataManagementDialog';
import { cn } from '@/lib/utils';
import { APP_TITLE } from '@/utils/Helper';
import logger from '@/core/logger';

export const DataManagementDialog = () => {
  const { isOpen, close } = useDataManagementDialog();
  const { movies, userCategories, handleClearLibrary, handleFactoryReset } =
    useMovieLibrary();
  const { clear } = useMovieProcessor();
  const { exportMovies, importMovies } = useImportExport();
  const [deleteCategories, setDeleteCategories] = useState(false);
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (confirm(`Delete ALL movies from ${APP_TITLE}?`)) {
      clear();
      await handleClearLibrary(deleteCategories);
      setDeleteCategories(false);
    }
  };

  const handleFullFactoryReset = async () => {
    if (
      confirm(
        `Are you absolutely sure you want to FACTORY RESET ${APP_TITLE}?\n\nThis will completely wipe the database and re-initialize it. EVERYTHING will be lost permanently.`,
      )
    ) {
      if (
        confirm(
          `Final Warning: This is irreversible. Do you really want to proceed with the Factory Reset?`,
        )
      ) {
        clear();
        await handleFactoryReset();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='w-[calc(100%-2rem)] sm:max-w-106.25 rounded-lg top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 max-h-[90vh] overflow-y-auto'>
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

          {/* Danger Zone Section */}
          <AccordionItem value='delete'>
            <AccordionTrigger>
              <h4 className='text-sm font-semibold flex items-center gap-2 text-destructive'>
                <AlertOctagon className='h-5 w-5' /> Danger Zone
              </h4>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-6 pt-4'>
                {/* Factory Reset - Premium UI */}
                <div className='relative group'>
                  <div className='absolute -inset-0.5 bg-linear-to-r from-red-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200'></div>
                  <div className='relative bg-white dark:bg-zinc-900 rounded-2xl border border-red-100 dark:border-red-900/30 p-5 space-y-4'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-1.5'>
                        <div className='flex items-center gap-2 text-red-600 dark:text-red-400'>
                          <Zap className='w-5 h-5 fill-current' />
                          <h5 className='font-bold text-base tracking-tight'>
                            Factory Reset
                          </h5>
                        </div>
                        <p className='text-xs text-muted-foreground leading-relaxed'>
                          Completely wipe the database and restore to initial
                          state. This will remove ALL movies, custom categories,
                          and settings.
                        </p>
                      </div>
                      <div className='bg-red-50 dark:bg-red-950/30 p-2.5 rounded-xl'>
                        <RotateCcw className='w-5 h-5 text-red-600 dark:text-red-400' />
                      </div>
                    </div>

                    <Button
                      variant='destructive'
                      onClick={handleFullFactoryReset}
                      className='w-full h-11 bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 border-none shadow-lg shadow-red-200 dark:shadow-none transition-all duration-300 active:scale-[0.98] font-bold rounded-xl'>
                      Perform Factory Reset
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                <div className='relative flex items-center gap-4 py-2'>
                  <div className='flex-1 h-px bg-zinc-100 dark:bg-zinc-800' />
                  <span className='text-[10px] font-bold text-zinc-400 uppercase tracking-widest'>
                    or
                  </span>
                  <div className='flex-1 h-px bg-zinc-100 dark:bg-zinc-800' />
                </div>

                {/* Simple Delete */}
                <div className='space-y-4 px-1'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg'>
                      <AlertOctagon className='w-4 h-4 text-zinc-500' />
                    </div>
                    <div className='space-y-0.5'>
                      <h6 className='text-sm font-semibold'>
                        Delete Movie Library
                      </h6>
                      <p className='text-[11px] text-muted-foreground'>
                        Remove all movies. Keep or delete categories below.
                      </p>
                    </div>
                  </div>

                  {userCategories.length > 0 && (
                    <div className='flex items-center justify-between rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-3.5 transition-all'>
                      <div className='space-y-1'>
                        <p className='text-xs font-bold'>Category Retention</p>
                        <p className='text-[10px] text-muted-foreground'>
                          Include custom categories in deletion
                        </p>
                      </div>

                      <Button
                        type='button'
                        variant={deleteCategories ? 'destructive' : 'outline'}
                        size='sm'
                        onClick={() => setDeleteCategories((prev) => !prev)}
                        className={cn(
                          'h-8 px-4 rounded-lg text-[11px] font-bold transition-all',
                          !deleteCategories &&
                            'hover:bg-zinc-200 dark:hover:bg-zinc-800',
                        )}>
                        {deleteCategories ? 'Delete All' : 'Keep Categories'}
                      </Button>
                    </div>
                  )}

                  <Button
                    variant='outline'
                    className='w-full h-10 border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 font-semibold rounded-xl transition-all'
                    onClick={handleClearLibraryWithReset}>
                    Clear Movies Only
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          variant='ghost'
          onClick={close}
          className='w-full flex items-center gap-2'>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};
