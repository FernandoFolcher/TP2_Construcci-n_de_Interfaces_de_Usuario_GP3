import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { getPostById, getCommentsByPostId, createComment, getImagesByPostId } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import '../styles/PostDetalle.css';

const PostDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para el formulario de comentarios
  const [commentContent, setCommentContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return;

      try {
        const [postData, commentsData, images] = await Promise.all([
          getPostById(parseInt(id)),
          getCommentsByPostId(parseInt(id)),
          getImagesByPostId(parseInt(id))
        ]);

        setPost({ ...postData, PostImages: images });
        setComments(commentsData);
      } catch (err) {
        console.error('Error al cargar el post:', err);
        setError('No se pudo cargar la publicación');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setCommentError('');
    setSuccess('');

    if (!isAuthenticated || !user) {
      setCommentError('Debes iniciar sesión para comentar');
      return;
    }

    if (!commentContent.trim()) {
      setCommentError('El comentario no puede estar vacío');
      return;
    }

    setSubmitting(true);

    try {
      const newComment = await createComment({
        content: commentContent.trim(),
        userId: user.id,
        postId: parseInt(id!),
      });

      // Agregar el comentario nuevo a la lista
      setComments([...comments, { ...newComment, User: user }]);
      setCommentContent('');
      setSuccess('¡Comentario agregado exitosamente!');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al crear comentario:', err);
      setCommentError('No se pudo agregar el comentario. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Publicación no encontrada'}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="post-detalle-container">
      <button onClick={() => navigate(-1)} className="back-link">
        ← Volver
      </button>

      <article className="post-detalle">
        <header className="post-detalle-header">
          <div className="post-author-info">
            <span className="author-icon-large">👤</span>
            <div>
              <h3 className="author-name-large">{post.User?.nickName || 'Anónimo'}</h3>
              <span className="post-date-large">
                {new Date(post.createdAt).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        <div className="post-detalle-body">
          <p className="post-description-large">{post.description}</p>

          {post.PostImages && post.PostImages.length > 0 && (
            <div className="post-images-large">
              {post.PostImages.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt="Post"
                  className="post-image-large"
                />
              ))}
            </div>
          )}

          {post.Tags && post.Tags.length > 0 && (
            <div className="post-tags-large">
              {post.Tags.map((tag) => (
                <span key={tag.id} className="post-tag-large">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Sección de comentarios */}
      <section className="comments-section">
        <h2 className="comments-title">
          💬 Comentarios ({comments.length})
        </h2>

        {/* Formulario para agregar comentario */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            {commentError && <div className="comment-error">{commentError}</div>}
            {success && <div className="comment-success">{success}</div>}

            <textarea
              className="comment-textarea"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={4}
              disabled={submitting}
            />
            <button
              type="submit"
              className="comment-submit-btn"
              disabled={submitting}
            >
              {submitting ? 'Publicando...' : 'Publicar comentario'}
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>
              <a href="/login" className="login-link">Inicia sesión</a> para dejar un comentario
            </p>
          </div>
        )}

        {/* Lista de comentarios */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">
              No hay comentarios aún. ¡Sé el primero en comentar!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">
                    👤 {comment.User?.nickName || 'Anónimo'}
                  </span>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString('es-AR')}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetalle;

