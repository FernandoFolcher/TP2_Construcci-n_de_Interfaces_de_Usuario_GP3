import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';
import { getPostsByUserId, getCommentsByPostId, getImagesByPostId } from '../services/api';
import Loading from '../components/Loading';
import '../styles/Perfil.css';

const Perfil = () => {
  const { user, logout } = useAuth();
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      try {
        // Usar el endpoint correcto con query param userId
        const userPostsData = await getPostsByUserId(user.id);

        // Obtener el conteo de comentarios e imágenes para cada post
        const postsWithDetails = await Promise.all(
          userPostsData.map(async (post) => {
            try {
              const [comments, images] = await Promise.all([
                getCommentsByPostId(post.id),
                getImagesByPostId(post.id)
              ]);
              return { 
                ...post, 
                commentCount: comments.length,
                PostImages: images
              };
            } catch {
              return { ...post, commentCount: 0, PostImages: [] };
            }
          })
        );

        setUserPosts(postsWithDetails);
      } catch (err) {
        console.error('Error al cargar publicaciones del usuario:', err);
        setError('No se pudieron cargar tus publicaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-info">
          <div className="perfil-avatar">👤</div>
          <div className="perfil-details">
            <h1 className="perfil-nickname">{user?.nickName}</h1>
            <p className="perfil-email">{user?.email}</p>
            <p className="perfil-stats">
              {userPosts.length} {userPosts.length === 1 ? 'publicación' : 'publicaciones'}
            </p>
          </div>
        </div>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      <div className="perfil-actions">
        <Link to="/crear-post" className="create-post-button">
          ✏️ Crear Nueva Publicación
        </Link>
      </div>

      <section className="perfil-posts">
        <h2 className="section-title">Mis Publicaciones</h2>
        
        {error && <div className="error-message">{error}</div>}

        {userPosts.length === 0 ? (
          <div className="empty-state">
            <p>Aún no has creado ninguna publicación.</p>
            <Link to="/crear-post" className="empty-state-link">
              Crear mi primera publicación →
            </Link>
          </div>
        ) : (
          <div className="posts-list">
            {userPosts.map((post) => (
              <div key={post.id} className="perfil-post-card">
                <div className="perfil-post-content">
                  <p className="perfil-post-description">{post.description}</p>
                  
                  {post.Tags && post.Tags.length > 0 && (
                    <div className="perfil-post-tags">
                      {post.Tags.map((tag) => (
                        <span key={tag.id} className="perfil-tag">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="perfil-post-meta">
                    <span className="perfil-post-date">
                      📅 {new Date(post.createdAt).toLocaleDateString('es-AR')}
                    </span>
                    <span className="perfil-post-comments">
                      💬 {post.commentCount || 0} comentarios
                    </span>
                  </div>
                </div>

                <Link to={`/post/${post.id}`} className="perfil-view-button">
                  Ver más →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Perfil;

