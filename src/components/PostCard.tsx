import { Link } from 'react-router-dom';
import type { Post } from '../types';
import '../styles/PostCard.css';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="post-card fade-in">
      <div className="post-card-header">
        <div className="post-author">
          <span className="author-icon">👤</span>
          <span className="author-name">{post.User?.nickName || 'Anónimo'}</span>
        </div>
        <span className="post-date">
          {new Date(post.createdAt).toLocaleDateString('es-AR')}
        </span>
      </div>

      <div className="post-card-body">
        <p className="post-description">{post.description}</p>

        {post.PostImages && post.PostImages.length > 0 && (
          <div className="post-images">
            {post.PostImages.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt="Post"
                className="post-image"
              />
            ))}
          </div>
        )}

        {post.Tags && post.Tags.length > 0 && (
          <div className="post-tags">
            {post.Tags.map((tag) => (
              <span key={tag.id} className="post-tag">
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="post-card-footer">
        <span className="comment-count">
          💬 {post.commentCount || 0} comentarios
        </span>
        <Link to={`/post/${post.id}`} className="view-more-btn">
          Ver más →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;

