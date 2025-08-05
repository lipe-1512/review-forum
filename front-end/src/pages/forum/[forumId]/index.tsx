import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../Forum.css'
import { listAll, getById } from '@/services/ForumService';
import { create, listAll as listAllComments } from '@/services/CommentService';
import Comments from '@/components/Comments/Comments';
import { useUsername } from '@/hooks/useUsername';

export default function Forum() {
  const router = useRouter();
  const { forumId } = router.query;
  const { username } = useUsername();
  const [forumData, setForumData] = useState<any>([]);
  const [newCommentInput, setNewCommentInput] = useState<any>('');
  const [replyToCommentId, setReplyToCommentId] = useState<any>(null);
  const [commentsData, setCommentsData] = useState<any[]>([]);

  useEffect(() => {
    if (forumId) {
      fetchForum();
      fetchComments();
    }
  }, [forumId]);

  const fetchForum = async () => {
    const forum = await getById(parseInt(forumId as string));
    setForumData(forum);
  };

  const fetchComments = async () => {
    try {
      const comments = await listAllComments(parseInt(forumId as string));
      setCommentsData(comments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const saveComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    
    let comment = {
      'forum': forumData.id,
      'username': username,
      'replyToCommentId': replyToCommentId || null,
      'content': newCommentInput,
    }
    
    try {
      const response = await create(comment);
      const createdComment = response.data;
      
      setCommentsData(prevComments => [createdComment, ...prevComments]);
      
      setNewCommentInput('');
      setReplyToCommentId(null);
      
      console.log('Comentário criado com sucesso:', createdComment);
    } catch (error) {
      console.error('Erro ao criar comentário:', error);
    }
  };

  return (
    <div className='forum-page-container'>
      <h1>{forumData.title}</h1>
      <h4>Descrição: {forumData.description}</h4>
      <p>Autor: {forumData.username}</p>
      <p>Filme: {(forumData?.related_movie?.name)}</p>

      <div className="comments-container">
        <h2 className="comments-title">Comentários</h2>
        <div className="comment-form">
          <input 
            type="text" 
            placeholder="Digite seu comentário..." 
            className="comment-input"
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
          />
          <button className="submit-button" onClick={saveComment}>Enviar</button>
        </div>
        
        <Comments 
          forumId={parseInt(forumId as string)} 
          comments={commentsData}
        />
      </div>
    </div>
  );
}