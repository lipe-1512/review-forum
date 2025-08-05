import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import './Comments.css';
import { listAll } from '@/services/CommentService';

interface CommentsProps {
  forumId?: number;
  comments?: any[];
}

const Comments: React.FC<CommentsProps> = ({ forumId, comments }) => {
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dateString;
    }
  };

  useEffect(() => {
    if (comments) {
      setCommentsData(comments);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [comments]);


  if (loading) {
    return (
      <div className="comments-container">
        <h3>Comentários</h3>
        <div className="loading">Carregando comentários...</div>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <h3>Comentários</h3>
      <div className="comments-list">
        {commentsData.map((comment: any) => (
          <Comment
            id={comment.id}
            author={comment.username}
            content={comment.content}
            date={formatDate(comment.modified_at)}
          />
        ))}
      </div>
    </div>
  );
};

export default Comments; 