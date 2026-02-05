import {
  SYSTEM_CATEGORY_IMPORTED,
  SYSTEM_CATEGORY_SEARCHED,
  SYSTEM_CATEGORY_UPLOADED,
} from '@/services/MovieDbService';
import { useMovieLibraryStore } from '@/store/useMovieLibraryStore';

export const useMovieLibrary = () => {
  const {
    movies,
    categories,
    loadMovies,
    addMovie,
    updateMovie,
    removeMovie,
    addCategory,
    removeCategory,
    getCategory,
    updateCategory,
    addMovieToCategory,
    removeMovieFromCategory,
    toggleMovieFavorite,
    toggleMovieWatched,
    selectedMovieIds,
    toggleMovieSelection,
    selectAllMovies,
    clearSelection,
    batchDeleteMovies,
    batchMarkFavorite,
    batchMarkWatched,
    batchAddMoviesToCategory,
    batchRemoveMoviesFromCategory,
    clearStore,
  } = useMovieLibraryStore();

  return {
    movies,
    categories,
    userCategories: categories.filter(
      (c) =>
        c.name !== SYSTEM_CATEGORY_IMPORTED &&
        c.name !== SYSTEM_CATEGORY_SEARCHED &&
        c.name !== SYSTEM_CATEGORY_UPLOADED,
    ),
    loadMovies,
    getCategory,
    handleAddMovie: addMovie,
    updateMovie,
    handleRemoveMovie: removeMovie,
    handleAddCategory: addCategory,
    handleRemoveCategory: removeCategory,
    handleUpdateCategory: updateCategory,
    handleAddMovieToCategory: addMovieToCategory,
    handleRemoveMovieFromCategory: removeMovieFromCategory,
    handleToggleMovieFavorite: toggleMovieFavorite,
    handleToggleMovieWatched: toggleMovieWatched,
    selectedMovieIds,
    handleToggleMovieSelection: toggleMovieSelection,
    handleSelectAllMovies: selectAllMovies,
    handleClearSelection: clearSelection,
    handleBatchDeleteMovies: batchDeleteMovies,
    handleBatchMarkFavorite: batchMarkFavorite,
    handleBatchMarkWatched: batchMarkWatched,
    handleBatchAddMoviesToCategory: batchAddMoviesToCategory,
    handleBatchRemoveMoviesFromCategory: batchRemoveMoviesFromCategory,
    handleClearLibrary: clearStore,
  };
};
