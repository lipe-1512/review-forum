import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../Forum.css'
import { listAll, getById, updateForum } from '@/services/ForumService';
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
  const [replyingToComment, setReplyingToComment] = useState<any>(null);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    if (forumId) {
      fetchForum();
      fetchComments();
    }
  }, [forumId]);

  useEffect(() => {
    if (forumData.title) {
      setEditedTitle(forumData.title);
    }
    if (forumData.description) {
      setEditedDescription(forumData.description);
    }
  }, [forumData.title, forumData.description]);

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

  const handleEditTitle = () => {
    setEditedTitle(forumData.title);
    setIsEditingTitle(true);
  };

  const handleEditDescription = () => {
    setEditedDescription(forumData.description);
    setIsEditingDescription(true);
  };

  const handleSaveTitle = async () => {
    if (!editedTitle.trim()) return;
    
    try {
      let updatedForum = {}
        updatedForum = await updateForum(forumData.id, {
          title: editedTitle,
          description: forumData.description
        });
      
      setForumData(updatedForum);
      setIsEditingTitle(false);
      console.log('Título atualizado com sucesso:', updatedForum);
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
    }
  };

  const handleSaveDescription = async () => {
    if (!editedDescription.trim()) return;
    
    try {
      const updatedForum = await updateForum(forumData.id, {
        title: forumData.title,
        description: editedDescription
      });
      
      setForumData(updatedForum);
      setIsEditingDescription(false);
      console.log('Descrição atualizada com sucesso:', updatedForum);
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setEditedTitle('');
    setEditedDescription('');
  };

  const handleCommentUpdated = (updatedComment: any) => {
    setCommentsData(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  const handleReplyToComment = (commentId: number) => {
    setReplyToCommentId(commentId);
    const comment = commentsData.find(c => c.id === commentId);
    setReplyingToComment(comment);
    const commentInput = document.querySelector('.comment-input') as HTMLInputElement;
    if (commentInput) {
      commentInput.focus();
    }
  };

  const saveComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    
    let comment = {
      'forumId': forumData.id,
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
      setReplyingToComment(null);
    } catch (error: any) {
      alert(error.response.data.message)
    }
  };

  const cancelReply = () => {
    setReplyToCommentId(null);
    setReplyingToComment(null);
  };

  return (
    <div className='forum-page-container'>
      <div className="forum-title-container">
        {isEditingTitle ? (
          <div className="title-edit-container">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="title-edit-input"
              autoFocus
            />
            <button onClick={handleSaveTitle} className="save-title-btn">✓</button>
            <button onClick={handleCancelEdit} className="cancel-title-btn">✕</button>
          </div>
        ) : (
          <div className="title-display-container">
            <h1>{forumData.title}</h1>
            {username === forumData.username && (
              <button onClick={handleEditTitle} className="edit-title-btn">
                ✏️
              </button>
            )}
          </div>
        )}
      </div>
      <div className="forum-description-container">
        {isEditingDescription ? (
          <div className="description-edit-container">
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="description-edit-input"
              rows={3}
              autoFocus
            />
            <div className="description-edit-buttons">
              <button onClick={handleSaveDescription} className="save-description-btn">✓</button>
              <button onClick={handleCancelEdit} className="cancel-description-btn">✕</button>
            </div>
          </div>
        ) : (
          <div className="description-display-container">
            <h4>Descrição: {forumData.description}</h4>
            {username === forumData.username && (
              <button onClick={handleEditDescription} className="edit-description-btn">
                ✏️
              </button>
            )}
          </div>
        )}
      </div>
      <p>Autor: {forumData.username}</p>
      <p>Filme: {(forumData?.related_movie?.name)}</p>

      <div className="comments-container">
        <h2 className="comments-title">Comentários</h2>
        <div className="comment-form">
          {replyingToComment && (
            <div className="reply-indicator">
              <span>Respondendo a: {replyingToComment.username}</span>
              <button onClick={cancelReply} className="cancel-reply-btn">✕</button>
            </div>
          )}
          <input 
            type="text" 
            placeholder={replyingToComment ? `Responder a ${replyingToComment.username}...` : "Digite seu comentário..."} 
            className="comment-input"
            value={newCommentInput}
            onChange={(e) => setNewCommentInput(e.target.value)}
          />
          <button className="submit-button" onClick={saveComment}>Enviar</button>
        </div>
        
        <Comments 
          forumId={parseInt(forumId as string)} 
          comments={commentsData}
          onCommentUpdated={handleCommentUpdated}
          onReply={handleReplyToComment}
        />
      </div>
    </div>
  );
}