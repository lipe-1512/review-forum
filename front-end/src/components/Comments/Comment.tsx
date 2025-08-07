import React, { useState } from 'react';
import { update } from '@/services/CommentService';
import { useUsername } from '@/hooks/useUsername';

interface CommentProps {
  id: number;
  author: string;
  content: string;
  date: string;
  replyToCommentId?: number | null;
  onCommentUpdated?: (updatedComment: any) => void;
  onReply?: (commentId: number) => void;
  isReply?: boolean;
}

const Comment: React.FC<CommentProps> = ({ 
  id, 
  author, 
  content, 
  date, 
  replyToCommentId,
  onCommentUpdated, 
  onReply,
  isReply = false 
}) => {
  const { username } = useUsername();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleEdit = () => {
    setEditedContent(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;
    
    try {
      const updatedComment = await update(id, {
        content: editedContent
      });
      
      setIsEditing(false);
      if (onCommentUpdated) {
        onCommentUpdated(updatedComment);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
  };

  const handleReply = () => {
    if (onReply) {
      onReply(id);
    }
  };

  return (
    <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <span className="author">{author}</span>
        <span className="date">{date}</span>
        {username === author && (
          <button onClick={handleEdit} className="edit-comment-btn">
            ✏️
          </button>
        )}
        
        {!isReply && onReply && (
          <button onClick={handleReply} className="reply-comment-btn">
            💬 Responder
          </button>
        )}
      </div>
      <div className="content">
        {isEditing ? (
          <div className="comment-edit-container">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="comment-edit-input"
              rows={3}
              autoFocus
            />
            <div className="comment-edit-buttons">
              <button onClick={handleSave} className="save-comment-btn">✓</button>
              <button onClick={handleCancel} className="cancel-comment-btn">✕</button>
            </div>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default Comment; 