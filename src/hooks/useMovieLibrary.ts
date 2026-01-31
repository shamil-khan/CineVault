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
    clearStore,
  } = useMovieLibraryStore();

  return {
    movies,
    categories,
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
    handleClearLibrary: clearStore,
  };
};
