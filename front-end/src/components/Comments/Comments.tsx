import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import './Comments.css';
import { listAll } from '@/services/CommentService';

interface CommentsProps {
  forumId?: number;
  comments?: any[];
  onCommentUpdated?: (updatedComment: any) => void;
  onReply?: (commentId: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ forumId, comments, onCommentUpdated, onReply }) => {
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

  // Organizar comentários: principais primeiro, depois respostas agrupadas
  const organizeComments = (comments: any[]) => {
    const mainComments = comments.filter(comment => !comment.replyToCommentId);
    const replies = comments.filter(comment => comment.replyToCommentId);
    
    return mainComments.map(mainComment => {
      const commentReplies = replies.filter(reply => reply.replyToCommentId === mainComment.id);
      return {
        ...mainComment,
        replies: commentReplies
      };
    });
  };

  if (loading) {
    return (
      <div className="comments-container">
        <h3>Comentários</h3>
        <div className="loading">Carregando comentários...</div>
      </div>
    );
  }

  const organizedComments = organizeComments(commentsData);

  return (
    <div className="comments-container">
      <h3>Comentários</h3>
      <div className="comments-list">
        {organizedComments.map((comment: any) => (
          <div key={comment.id} className="comment-group">
            <Comment
              id={comment.id}
              author={comment.username}
              content={comment.content}
              date={formatDate(comment.modified_at)}
              replyToCommentId={comment.replyToCommentId}
              onCommentUpdated={onCommentUpdated}
              onReply={onReply}
              isReply={false}
            />
            {comment.replies && comment.replies.length > 0 && (
              <div className="replies-container">
                {comment.replies.map((reply: any) => (
                  <Comment
                    key={reply.id}
                    id={reply.id}
                    author={reply.username}
                    content={reply.content}
                    date={formatDate(reply.modified_at)}
                    replyToCommentId={reply.replyToCommentId}
                    onCommentUpdated={onCommentUpdated}
                    onReply={onReply}
                    isReply={true}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments; 