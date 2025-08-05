import React from 'react';

interface CommentProps {
  id: number;
  author: string;
  content: string;
  date: string;
}

const Comment: React.FC<CommentProps> = ({ author, content, date }) => {

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="author">{author}</span>
        <span className="date">{date}</span>
      </div>
      <div className="content">
        {content}
      </div>
    </div>
  );
};

export default Comment; 