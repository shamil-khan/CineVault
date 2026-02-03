import { create } from 'zustand';
import { type MovieInfo } from '@/models/MovieModel';

interface CategoryDialogState {
  isOpen: boolean;
  selectedMovies: MovieInfo[];
  open: (movies?: MovieInfo | MovieInfo[]) => void;
  close: () => void;
}

export const useCategoryDialog = create<CategoryDialogState>((set) => ({
  isOpen: false,
  selectedMovies: [],
  open: (movies) => {
    const movieArray = movies ? (Array.isArray(movies) ? movies : [movies]) : [];
    set({ isOpen: true, selectedMovies: movieArray });
  },
  close: () => set({ isOpen: false, selectedMovies: [] }),
}));
