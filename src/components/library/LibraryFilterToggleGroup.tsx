import { Button } from '@/components/ui/button';
import { Heart, Eye, EyeOff, HeartOff, ListFilter } from 'lucide-react';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import { cn } from '@/lib/utils';
import { ActionTooltip } from '../ActionTooltip';
import { TooltipProvider } from '@radix-ui/react-tooltip';

interface LibraryFilterToggleGroupProps {
  onToggleFilters: () => void;
}

export const LibraryFilterToggleGroup = ({
  onToggleFilters,
}: LibraryFilterToggleGroupProps) => {
  const { filters, onFiltersUpdated } = useMovieFilters();

  const FavoriteIcon =
    filters.isFavorite === undefined
      ? Heart
      : filters.isFavorite
        ? Heart
        : HeartOff;

  const WatchedIcon =
    filters.isWatched === undefined ? Eye : filters.isWatched ? Eye : EyeOff;

  return (
    <div
      className='flex items-center gap-0'
      onClick={(e) => e.stopPropagation()}>
      <TooltipProvider>
        <div className='flex w-full justify-around items-center max-w-sm mx-auto gap-1'>
          <ActionTooltip
            label={
              filters.isFavorite === undefined
                ? 'All Movies (toggle to Favorites)'
                : filters.isFavorite
                  ? 'Show Favorites (toggle to Unfavorited)'
                  : 'Show Unfavorited (toggle to All)'
            }
            variant='rose'>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'h-10 w-10 rounded-xl',
                'bg-rose-500/10 border border-rose-500/20 active:bg-rose-500/30',
                'active:scale-90 transition-all',
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFiltersUpdated({
                  ...filters,
                  isFavorite:
                    filters.isFavorite === undefined
                      ? true
                      : filters.isFavorite
                        ? false
                        : undefined,
                });
              }}>
              <FavoriteIcon
                className={cn(
                  'w-5 h-5',
                  filters.isFavorite === undefined
                    ? 'text-zinc-600'
                    : 'fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]',
                )}
              />
            </Button>
          </ActionTooltip>

          {/* 2. WATCH - Emerald Border Glow */}
          <ActionTooltip
            label={
              filters.isWatched === undefined
                ? 'All Movies (toggle to Watched)'
                : filters.isWatched
                  ? 'Show Watched (toggle to Unwatched)'
                  : 'Show Unwatched (toggle to All)'
            }
            variant='emerald'>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'h-10 w-10 rounded-xl',
                'bg-emerald-500/10 border border-emerald-500/20 active:bg-emerald-500/30',
                'active:scale-90 transition-all',
              )}
              onClick={(e) => {
                e.stopPropagation();
                onFiltersUpdated({
                  ...filters,
                  isWatched:
                    filters.isWatched === undefined
                      ? true
                      : filters.isWatched
                        ? false
                        : undefined,
                });
              }}>
              <WatchedIcon
                className={cn(
                  'w-5 h-5',
                  filters.isWatched === undefined
                    ? 'text-zinc-600'
                    : 'text-emerald-600 fill-emerald-600/30',
                )}
              />
            </Button>
          </ActionTooltip>

          {/* 3. Filters - Sky */}
          <ActionTooltip label='Show Filters' variant='sky'>
            <Button
              variant='ghost'
              size='icon'
              className={cn(
                'h-10 w-10 rounded-xl',
                'bg-sky-500/10 border border-sky-500/20 active:bg-sky-500/30',
                'active:scale-90 transition-all',
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFilters();
              }}>
              <ListFilter className='text-sky-600 drop-shadow-[0_2px_4px_rgba(2,132,199,0.2)]' />
            </Button>
          </ActionTooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
