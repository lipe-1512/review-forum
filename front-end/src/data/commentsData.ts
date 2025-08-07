import React, { useState } from 'react';
import './Comments.css';

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentProps {
  comment: Comment;
  onReply: (commentId: number) => void;
  level?: number;
}

const CommentItem: React.FC<CommentProps> = ({ comment, onReply, level = 0 }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="comment-item" style={{ marginLeft: `${level * 20}px` }}>
      <div className="comment-content">
        <div className="comment-header">
          <div className="comment-info">
            <span className="user-name">{comment.user.name}</span>
            <span className="timestamp">{comment.timestamp}</span>
          </div>
        </div>
        
        <div className="comment-text">
          {comment.content}
        </div>
        
        <div className="comment-actions">
          <button 
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            👍 {likeCount}
          </button>
          <button 
            className="reply-button"
            onClick={() => onReply(comment.id)}
          >
            Reply
          </button>
        </div>
      </div>
      
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </div>
  );
};

interface CommentsProps {
  comments: Comment[];
}

export const Comments: React.FC<CommentsProps> = ({ comments }) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments</h2>
      
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite seu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button type="submit" className="submit-button">
          Enviar
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
};