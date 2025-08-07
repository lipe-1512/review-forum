import React from 'react';
import type { Movie } from '../types/movie';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const poster = movie.posterUrl || `https://placehold.co/400x600/1f2937/99AABB?text=${movie.name.replace(/\s/g, '+')}`;

  return (
    <div className={styles.card}>
      <div className={styles.posterContainer}>
        <img
          src={poster}
          alt={`Poster de ${movie.name}`}
          className={styles.poster}
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x600/1f2937/ffffff?text=Error'; }}
        />
      </div>
      <div className={styles.overlay}>
        <p className={styles.title}>{movie.name}</p>
      </div>
    </div>
  );
};

export default MovieCard;