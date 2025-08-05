import React, { useEffect, useState } from 'react';
import Comments from '../../components/Comments/Comments';
import { listAll, createForum } from '@/services/ForumService';
import { listAll as listMovies } from '@/services/MovieService';
import { useUsername } from '@/hooks/useUsername';
import './Forum.css';

const ForumIndexPage: React.FC = () => {
  const [forums, setForums] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState<any[]>([]);
  const { username } = useUsername();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    movieId: 0,
    username: ''
  });

  useEffect(() => {
    fetchForums();
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const movies = await listMovies();
    setMovies(movies);
  };

  const fetchForums = async () => {
    try {
      const forumsData = await listAll();
      setForums(forumsData);
    } catch (error) {
      console.error('Erro ao buscar fóruns:', error);
    }
  };

  const handleCreateForum = async () => {
    
    createForum({...formData, username: username}).then((createdForum) => {
      console.log(createdForum);
      window.location.reload();
    });
    setFormData({ title: '', description: '', movieId: 0, username: '' });
    setIsModalOpen(false);
    await fetchForums();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'movieId' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="forum-index-page">
      <div className="forum-content">
        <div className="forum-header">
          <h1>Fóruns Disponíveis</h1>
          <button 
            className="add-forum-btn"
            onClick={() => setIsModalOpen(true)}
          >
            +
          </button>
        </div>
        
        <div className="forums-table-container">
          <table className="forums-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th>Autor</th>
                <th>Filme Relacionado</th>
              </tr>
            </thead>
            <tbody>
              {forums.map((forum) => (
                <tr key={forum.id}>
                  <td>{forum.id}</td>
                  <td>
                    <a 
                      href={`/forum/${forum.id}`}
                      className="forum-title-link"
                    >
                      {forum.title}
                    </a>
                  </td>
                  <td>{forum.description}</td>
                  <td>{forum.username}</td>
                  <td>{forum.related_movie?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Criar Novo Fórum</h2>
                <button 
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="title">Título do Fórum:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Digite o título do fórum"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descrição:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Digite a descrição do fórum"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="movieId">Filme:</label>
                  <select
                    id="movieId"
                    name="movieId"
                    value={formData.movieId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um filme</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="create-btn"
                  onClick={handleCreateForum}
                >
                  Criar Fórum
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumIndexPage;