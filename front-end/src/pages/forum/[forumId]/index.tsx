import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../Forum.css'
import { listAll, getById } from '@/services/ForumService';
import { Comments } from '@/components/Comments/Comments';
import { commentsData } from '@/data/commentsData';

export default function Forum() {
  const router = useRouter();
  const { forumId } = router.query;
  const [forumData, setForumData] = useState<any>([]);

  useEffect(() => {
    if (forumId) {
      fetchForum();
    }
  }, [forumId]);

  const fetchForum = async () => {
    const forum = await getById(parseInt(forumId as string));
    setForumData(forum);
  };

  return (
    <div className='forum-page-container'>
      <h1>{forumData.title}</h1>
      <h4>Descrição: {forumData.description}</h4>
      <p>Autor: {forumData.username}</p>
      <pre>{JSON.stringify(forumData.related_movie)}</pre>

      <div className="comments-container">
        <h2 className="comments-title">Comments</h2>
        <div className="comment-form">
          <input 
            type="text" 
            placeholder="Digite seu comentário..." 
            className="comment-input"
          />
          <button className="submit-button">Enviar</button>
        </div>
        <div className="comments-list">
          {/* Comentário Principal */}
          <div className="comment-item">
            <div className="comment-content">
              <div className="comment-header">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                  alt="Veronica" 
                  className="user-avatar" 
                />
                <div className="comment-info">
                  <span className="user-name">Veronica</span>
                  <span className="timestamp">2h ago</span>
                </div>
              </div>
              <div className="comment-text">
                Excelente discussão sobre este filme! Realmente gostei da análise dos personagens.
              </div>
              <div className="comment-actions">
                <button className="like-button">👍 255</button>
                <button className="reply-button">Reply</button>
              </div>
            </div>
            {/* Resposta 1 */}
            <div className="comment-item">
              <div className="comment-content">
                <div className="comment-header">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                    alt="Andrew" 
                    className="user-avatar" 
                  />
                  <div className="comment-info">
                    <span className="user-name">Andrew</span>
                    <span className="timestamp">2h ago</span>
                  </div>
                </div>
                <div className="comment-text">
                  Concordo totalmente! O desenvolvimento do personagem principal foi incrível.
                </div>
                <div className="comment-actions">
                  <button className="like-button">👍 18</button>
                  <button className="reply-button">Reply</button>
                </div>
              </div>
              {/* Resposta 2 (aninhada) */}
              <div className="comment-item">
                <div className="comment-content">
                  <div className="comment-header">
                    <img 
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" 
                      alt="Halina B." 
                      className="user-avatar" 
                    />
                    <div className="comment-info">
                      <span className="user-name">Halina B.</span>
                      <span className="timestamp">1h ago</span>
                    </div>
                  </div>
                  <div className="comment-text">
                    Especialmente na cena do clímax, foi muito emocionante!
                  </div>
                  <div className="comment-actions">
                    <button className="like-button">👍 11</button>
                    <button className="reply-button">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}