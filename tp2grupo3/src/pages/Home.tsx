import { useState, useEffect } from 'react';
import type { Post, Tag } from '../types';
import { getPosts, getCommentsByPostId, getImagesByPostId, getTags } from '../services/api';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import '../styles/Home.css';

const Home = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar posts y tags al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, tagsData] = await Promise.all([
          getPosts(),
          getTags()
        ]);
        
        // Obtener el conteo de comentarios e imágenes para cada post
        const postsWithDetails = await Promise.all(
          postsData.map(async (post) => {
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

        // Ordenar por fecha más reciente
        const sortedPosts = postsWithDetails.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setAllPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
        setTags(tagsData);
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
        setError('No se pudieron cargar las publicaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar posts cuando cambia la etiqueta seleccionada
  useEffect(() => {
    if (selectedTag === null) {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post => 
        post.Tags?.some(tag => tag.id === selectedTag)
      );
      setFilteredPosts(filtered);
    }
  }, [selectedTag, allPosts]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Inicio</h1>
      </div>

      {/* Filtro de etiquetas */}
      <div className="tags-filter">
        <button 
          className={`filter-tag ${selectedTag === null ? 'active' : ''}`}
          onClick={() => setSelectedTag(null)}
        >
          Todas
        </button>
        {tags.map(tag => (
          <button
            key={tag.id}
            className={`filter-tag ${selectedTag === tag.id ? 'active' : ''}`}
            onClick={() => setSelectedTag(tag.id)}
          >
            #{tag.name}
          </button>
        ))}
      </div>

      {/* Feed estilo Twitter */}
      <div className="feed-container">
        {error && <div className="error-message">{error}</div>}
        
        {filteredPosts.length === 0 ? (
          <div className="empty-state">
            <p>
              {selectedTag 
                ? 'No hay publicaciones con esta etiqueta' 
                : 'No hay publicaciones aún. ¡Sé el primero en compartir algo!'}
            </p>
          </div>
        ) : (
          <div className="posts-feed">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

