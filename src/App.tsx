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
import { About } from '@/components/About';
import { APP_TITLE, pluralName } from '@/utils/Helper';
import { Button } from './components/ui/button';

function App() {
  const { movies, loadMovies } = useMovieLibrary();
  const { hasActiveFilters, filteredMovies } = useMovieFilters();
  const appRef = useRef(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [aboutVisible, setAboutVisible] = useState<boolean>(false);

  useEffect(() => {
    if (appRef.current) {
      return;
    }

    const loadingId = setTimeout(() => {
      appRef.current = true;
      const loadAll = async () => {
        await loadMovies();
        setLoaded(true);
      };
      void loadAll();
    }, 500);

    return () => clearTimeout(loadingId);
  }, [loadMovies]);

  if (!loaded) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Spinner className='h-10 w-10 text-blue-600' />
        <span className='font-bold'>Loading {APP_TITLE}</span>
      </div>
    );
  }

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
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
