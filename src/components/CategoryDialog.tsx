import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Check, X, Lock, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMovieLibraryStore } from '@/store/useMovieLibraryStore';
import { useCategoryDialog } from '@/hooks/useCategoryDialog';
import {
  SYSTEM_CATEGORY_SEARCHED,
  SYSTEM_CATEGORY_UPLOADED,
} from '@/services/MovieDbService';
import { cn } from '@/lib/utils';
import { APP_TITLE } from '@/utils/Helper';

export const CategoryDialog = () => {
  const { isOpen, close, selectedMovies } = useCategoryDialog();
  const {
    categories,
    movies,
    addCategory,
    removeCategory,
    updateCategory,
    batchAddMoviesToCategory,
    batchRemoveMoviesFromCategory,
  } = useMovieLibraryStore();

  // Get the latest movie state from the store to ensure categories are up to date
  const activeMovies = selectedMovies.map(
    (sm) => movies.find((m) => m.imdbID === sm.imdbID) || sm,
  );

  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editingName, setEditingName] = useState('');

  // Reset state when dialog closes or movie changes
  useEffect(() => {
    if (!isOpen) {
      setNewCategoryName('');
      setEditingCategoryId(null);
      setEditingName('');
    }
  }, [isOpen]);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleStartEdit = (id: number, name: string) => {
    setEditingCategoryId(id);
    setEditingName(name);
  };

  const handleSaveEdit = (id: number) => {
    if (editingName.trim()) {
      updateCategory(id, editingName.trim());
      setEditingCategoryId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingName('');
  };

  const handleToggleCategoryForMovies = (category: any) => {
    if (activeMovies.length === 0) return;

    const movieIDs = activeMovies.map((m) => m.imdbID);
    const moviesWithCategory = activeMovies.filter((m) =>
      m.categories?.some((c) => c.id === category.id),
    );

    const allHaveIt = moviesWithCategory.length === activeMovies.length;

    if (allHaveIt) {
      batchRemoveMoviesFromCategory(movieIDs, category);
    } else {
      batchAddMoviesToCategory(movieIDs, category);
    }
  };

  const isSystemCategory = (name: string) => {
    return (
      name === SYSTEM_CATEGORY_SEARCHED || name === SYSTEM_CATEGORY_UPLOADED
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className='w-[calc(100%-2rem)] sm:max-w-106.25 rounded-lg'>
        <DialogHeader>
          <DialogTitle>
            {activeMovies.length === 1
              ? `Manage Categories for "${activeMovies[0].title}"`
              : `Manage Categories for ${activeMovies.length} movies`}
          </DialogTitle>
          <DialogDescription>
            {activeMovies.length > 0
              ? 'Select categories to assign to these movies, or create new ones.'
              : `Create and manage categories for ${APP_TITLE}.`}
          </DialogDescription>
        </DialogHeader>

        <div className='flex gap-2 my-4'>
          <Input
            placeholder='New category name...'
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddCategory();
            }}
          />
          <Button
            onClick={handleAddCategory}
            size='icon'
            disabled={!newCategoryName.trim()}>
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <div className='bg-accent/20 rounded-md p-2 max-h-75 overflow-y-auto space-y-2'>
          {categories.length === 0 && (
            <p className='text-center text-muted-foreground py-4 text-sm'>
              No categories yet.
            </p>
          )}

          {categories.map((category) => {
            const moviesWithCategory = activeMovies.filter((m) =>
              m.categories?.some((c) => c.id === category.id),
            );
            const allHaveIt =
              activeMovies.length > 0 &&
              moviesWithCategory.length === activeMovies.length;
            const someHaveIt =
              activeMovies.length > 0 &&
              moviesWithCategory.length > 0 &&
              moviesWithCategory.length < activeMovies.length;

            const isEditing = editingCategoryId === category.id;
            const isSystem = isSystemCategory(category.name);

            return (
              <div
                key={category.id}
                className={cn(
                  'flex items-center justify-between p-2 rounded-md transition-colors',
                  activeMovies.length > 0 && !isEditing && !isSystem
                    ? 'hover:bg-accent cursor-pointer'
                    : 'bg-transparent',
                  allHaveIt || someHaveIt ? 'bg-accent/50' : '',
                  isSystem ? 'opacity-70' : '',
                )}
                onClick={() => {
                  if (activeMovies.length > 0 && !isEditing && !isSystem) {
                    handleToggleCategoryForMovies(category);
                  }
                }}>
                {isEditing ? (
                  <div
                    className='flex flex-1 items-center gap-2'
                    onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className='h-8'
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(category.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-8 w-8 text-green-500'
                      onClick={() => handleSaveEdit(category.id)}>
                      <Check className='h-4 w-4' />
                    </Button>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='h-8 w-8 text-red-500'
                      onClick={handleCancelEdit}>
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className='flex items-center gap-3'>
                      {activeMovies.length > 0 && (
                        <div
                          className={cn(
                            'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                            allHaveIt || someHaveIt
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground',
                            isSystem ? 'opacity-50' : '',
                          )}>
                          {allHaveIt && (
                            <Check className='h-3 w-3 text-primary-foreground' />
                          )}
                          {someHaveIt && (
                            <Minus className='h-3 w-3 text-primary-foreground' />
                          )}
                        </div>
                      )}
                      <span className='font-medium flex items-center gap-2'>
                        {category.name}
                        {isSystem && (
                          <Lock className='w-3 h-3 text-muted-foreground' />
                        )}
                        <span className='text-xs text-muted-foreground font-normal'>
                          (
                          {
                            movies.filter((m) =>
                              m.categories?.some((c) => c.id === category.id),
                            ).length
                          }
                          )
                        </span>
                      </span>
                    </div>

                    {!isSystem && (
                      <div
                        className='flex items-center'
                        onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-foreground'
                          onClick={() =>
                            handleStartEdit(category.id, category.name)
                          }>
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-muted-foreground hover:text-destructive'
                          onClick={() => {
                            if (
                              confirm(
                                `Delete category "${category.name}"? This will remove it from all movies.`,
                              )
                            ) {
                              removeCategory(category.id);
                            }
                          }}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
