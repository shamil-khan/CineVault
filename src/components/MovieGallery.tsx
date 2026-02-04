import { Trash2, Tags, X, CheckSquare, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MovieCard } from '@/components/MovieCard';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { useMovieLibrary } from '@/hooks/useMovieLibrary';
import { useCategoryDialog } from '@/hooks/useCategoryDialog';

export const MovieGallery = () => {
  const { filteredMovies } = useMovieFilters();
  const {
    movies,
    selectedMovieIds,
    handleSelectAllMovies,
    handleClearSelection,
    handleBatchDeleteMovies,
    handleBatchToggleFavorite,
    handleBatchToggleWatched,
  } = useMovieLibrary();
  const { open: openCategoryDialog } = useCategoryDialog();

  const selectionMode = selectedMovieIds.length > 0;

  const handleSelectAll = () => {
    handleSelectAllMovies(filteredMovies.map((m) => m.imdbID));
  };

  const handleDeleteSelected = () => {
    if (
      confirm(
        `Delete ${selectedMovieIds.length} movies from library and database?`,
      )
    ) {
      handleBatchDeleteMovies(selectedMovieIds);
    }
  };

  const handleManageCategories = () => {
    const selectedMovies = movies.filter((m) =>
      selectedMovieIds.includes(m.imdbID),
    );
    openCategoryDialog(selectedMovies);
  };

  return (
    <div className='relative'>
      {filteredMovies.length > 0 ? (
        <div className='grid grid-flow-row-dense grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-20'>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className='flex h-64 items-center justify-center '>
          <div className='relative flex rounded-full'>
            <div className='animate-pulse text-3xl font-semibold'>
              Filtered returns no movie.
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectionMode && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-2xl rounded-full px-4 py-2 flex items-center gap-2 sm:gap-4 animate-in slide-in-from-bottom-4'>
          <div className='flex items-center gap-2 border-r pr-2 sm:pr-4'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 rounded-full'
              onClick={handleClearSelection}>
              <X className='h-4 w-4' />
            </Button>
            <span className='text-sm font-bold whitespace-nowrap'>
              {selectedMovieIds.length} selected
            </span>
          </div>

          <div className='flex items-center gap-1 sm:gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='hidden sm:flex items-center gap-2'
              onClick={handleSelectAll}>
              <CheckSquare className='h-4 w-4' />
              Select All
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='sm:hidden'
              onClick={handleSelectAll}
              title='Select All'>
              <CheckSquare className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-[#d80f1c] hover:text-[#d80f1c] hover:bg-red-50'
              onClick={() => handleBatchToggleFavorite(selectedMovieIds)}
              title='Toggle Favorite'>
              <Heart className='h-5 w-5' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-amber-500 hover:text-amber-600 hover:bg-amber-50'
              onClick={() => handleBatchToggleWatched(selectedMovieIds)}
              title='Toggle Watched'>
              <Eye className='h-5 w-5' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-blue-500 hover:text-blue-600 hover:bg-blue-50'
              onClick={handleManageCategories}
              title='Manage Categories'>
              <Tags className='h-5 w-5' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-destructive hover:text-destructive hover:bg-destructive/10'
              onClick={handleDeleteSelected}
              title='Delete Selected'>
              <Trash2 className='h-5 w-5' />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
