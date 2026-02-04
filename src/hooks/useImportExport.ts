import { toast } from 'sonner';
import { type Category, type MovieInfo } from '@/models/MovieModel';
import { SYSTEM_CATEGORY_IMPORTED } from '@/services/MovieDbService';
import { OmdbApi, omdbApiService } from '@/services/OmdbApiService';
import { utilityApiService } from '@/services/UtilityApiService';
import { toMovieDetail } from '@/utils/MovieFileHelper';
import { useMovieLibrary } from '@/hooks/useMovieLibrary';
import { APP_TITLE, APP_VERSION } from '@/utils/Helper';
import logger from '@/core/logger';

interface MovieItem {
  imdbID: string;
  title: string;
  year: string;
  posterURL: string;
}

interface MovieCategoryItem {
  categoryName: string;
  movies: MovieItem[];
}

interface ImportExportFile {
  app: string;
  version: string;
  data: MovieCategoryItem[];
}

const fetchFullMovieInfo = async (
  imdbID: string,
): Promise<MovieInfo | null> => {
  try {
    logger.info(`Fetching full data for IMDb ID: ${imdbID}`);
    const omdbResult = await omdbApiService.getMovieByImdbId(imdbID);

    if (omdbResult.Response === OmdbApi.ReservedWords.False) {
      logger.error(
        `OMDb returned False for imdbID: ${imdbID}: ${omdbResult.Error}`,
      );
      return null;
    }

    const movieDetail = toMovieDetail(omdbResult);

    let posterBlob: Blob | undefined = undefined;
    if (movieDetail.poster !== OmdbApi.ReservedWords.NotAvailable) {
      try {
        posterBlob = await utilityApiService.getPosterImage(movieDetail.poster);
      } catch (err) {
        logger.error(`Failed to fetch poster for ${imdbID}:`, err);
      }
    }

    const movieInfo: MovieInfo = {
      imdbID: movieDetail.imdbID,
      title: movieDetail.title,
      year: movieDetail.year,
      detail: movieDetail,
      poster: posterBlob
        ? {
            url: movieDetail.poster,
            mime: posterBlob.type,
            blob: posterBlob,
          }
        : undefined,
    };

    return movieInfo;
  } catch (err) {
    logger.error(`Error in MovieDetailFetcher for ${imdbID}:`, err);
    return null;
  }
};

export const useImportExport = () => {
  const {
    movies,
    categories,
    getCategory,
    handleAddMovie,
    handleAddCategory,
    handleAddMovieToCategory,
  } = useMovieLibrary();

  return {
    exportMovies: (categoryIds: number[]): string => {
      const exportData: MovieCategoryItem[] = [];

      categoryIds.forEach((catId) => {
        const category = categories.find((c: Category) => c.id === catId);
        if (!category) return;

        const moviesInCat = movies.filter((m: MovieInfo) =>
          m.categories?.some((c) => c.id === catId),
        );

        if (moviesInCat.length > 0) {
          const item: MovieCategoryItem = {
            categoryName: category.name,
            movies: moviesInCat.map(
              (m: MovieInfo): MovieItem => ({
                imdbID: m.imdbID,
                title: m.title,
                year: m.year,
                posterURL: m.poster?.url || '',
              }),
            ),
          };
          exportData.push(item);
        }
      });

      const exportFile: ImportExportFile = {
        app: APP_TITLE,
        version: APP_VERSION,
        data: exportData,
      };

      const exportString = JSON.stringify(exportFile, null, 2);

      return exportString;
    },

    importMovies: async (jsonFile: unknown) => {
      try {
        const importFile: ImportExportFile = jsonFile as ImportExportFile;
        // Assuming "Import" category exists in state/DB
        const importCategory = getCategory(SYSTEM_CATEGORY_IMPORTED);

        let successCount = 0;
        let failedCount = 0;

        await Promise.all(
          importFile.data.map(async (mc) => {
            let category = categories.find((c) => c.name === mc.categoryName);
            if (!category) {
              await handleAddCategory(mc.categoryName);
              category = getCategory(mc.categoryName);
            }

            await Promise.all(
              mc.movies.map(async (item) => {
                const foundMovie = movies.find((m) => m.imdbID === item.imdbID);

                if (!foundMovie) {
                  const newMovie = await fetchFullMovieInfo(item.imdbID);

                  if (newMovie) {
                    await handleAddMovie(newMovie);
                    successCount++;
                  } else {
                    failedCount++;
                    return;
                  }
                }
                handleAddMovieToCategory(item.imdbID, importCategory!);
                handleAddMovieToCategory(item.imdbID, category!);
              }),
            );
          }),
        );
        const message = [
          successCount > 0 ? `${successCount} new movies added` : undefined,
          failedCount > 0
            ? `${failedCount} movies failed to import.`
            : undefined,
        ]
          .filter(Boolean)
          .join(', ');

        toast.success(`Import completed. ${message}`);
      } catch (err) {
        logger.error('Failed to import movies:', err);
        toast.error('Import failed. Invalid file format.');
      }
    },
  };
};
