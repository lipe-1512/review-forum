import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import type { Movie } from '../types/movie';
import MovieRow from '../components/MovieRow';
import styles from './HomePage.module.css';

function HomePage() {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await apiClient.get<Movie[]>('/movies');
        const allMovies = response.data;
        setPopularMovies(allMovies.slice(0, 10));
        setNewMovies(allMovies.slice(10));
      } catch (err) {
        setError("Não foi possível carregar os filmes.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  if (loading) return <p className={styles.loading}>A carregar...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <MovieRow title="Filmes Populares" movies={popularMovies} />
      <MovieRow title="Novos Lançamentos" movies={newMovies} />
    </div>
  );
}

export default HomePage;
