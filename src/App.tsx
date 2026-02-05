import '@/App.css';
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useMovieLibrary } from '@/hooks/useMovieLibrary';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { MovieGallery } from '@/components/MovieGallery';
import { CategoryDialog } from '@/components/CategoryDialog';
import { DataManagementDialog } from '@/components/DataManagementDialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { About } from '@/components/About';
import { APP_TITLE, pluralName } from '@/utils/Helper';
import { Button } from '@/components/ui/button';

function App() {
  const { movies, loadMovies, isLoading } = useMovieLibrary();
  const { hasActiveFilters, filteredMovies } = useMovieFilters();
  const appRef = useRef(false);
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (appRef.current) {
      return;
    }

    const loadingId = setTimeout(() => {
      appRef.current = true;
      const loadAll = async () => {
        await loadMovies();
      };
      void loadAll();
    }, 500);

    return () => clearTimeout(loadingId);
  }, [loadMovies]);

  if (aboutVisible) {
    return <About onClose={() => setAboutVisible(false)} />;
  }

  return (
    <ErrorBoundary>
      <div className='p-1 w-full'>
        <div className='relative flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2 px-4'>
          <div className='flex items-center gap-3 order-2 sm:order-1'>
            <img
              src='/AppIcons/Web/android-chrome-192x192.png'
              alt='CineVault Logo'
              className='w-12 h-12 sm:w-15 sm:h-15'
            />
            <h3 className='text-xl sm:text-2xl font-bold text-center'>
              {APP_TITLE} has ({movies.length}) {pluralName(movies, 'movie')}
            </h3>
          </div>
          <div className='w-full flex justify-end sm:w-auto sm:absolute sm:right-4 order-1 sm:order-2'>
            <Button variant='ghost' onClick={() => setAboutVisible(true)}>
              About
            </Button>
          </div>
        </div>
        {hasActiveFilters && (
          <h6 className='text-md text-muted-foreground font-medium'>
            Filtering result {filteredMovies.length}{' '}
            {pluralName(filteredMovies, 'movie')}
          </h6>
        )}

        <LibraryHeader />
      </div>
      {movies.length === 0 ? (
        <div className='flex h-64 items-center justify-center '>
          <div className='relative flex rounded-full'>
            <div className='animate-pulse text-3xl font-semibold'>
              There is no movie in {APP_TITLE}.
            </div>
          </div>
        </div>
      ) : (
        <MovieGallery />
      )}

      <CategoryDialog />
      <DataManagementDialog />
      <Toaster
        position={isMobile ? 'top-center' : 'bottom-right'}
        expand={false}
        richColors
        closeButton
        toastOptions={{
          // Apply iOS styling to all toasts
          className:
            'rounded-[20px] backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 border-none shadow-2xl',
        }}
      />
      {isLoading && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-4 transition-all duration-300'>
          <div className='bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center gap-4'>
            <Spinner className='h-12 w-12 text-white' />
            <span className='text-white font-bold text-lg animate-pulse'>
              Loading {APP_TITLE}...
            </span>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

export default App;
