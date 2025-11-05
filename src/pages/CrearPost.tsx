import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Tag } from '../types';
import { getTags, createPost, createPostImage } from '../services/api';
import Loading from '../components/Loading';
import '../styles/CrearPost.css';

const CrearPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Error al cargar etiquetas:', err);
        setError('No se pudieron cargar las etiquetas');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageField = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleTagToggle = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (!user) {
      setError('Debes iniciar sesión para crear una publicación');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Crear el post
      const newPost = await createPost({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      });

      // 2. Crear las imágenes si hay URLs válidas
      const validImageUrls = imageUrls.filter((url) => url.trim() !== '');
      
      if (validImageUrls.length > 0) {
        await Promise.all(
          validImageUrls.map((url) =>
            createPostImage({
              url: url.trim(),
              postId: newPost.id,
            })
          )
        );
      }

      setSuccess(true);

      // Redirigir al perfil después de 2 segundos
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);
    } catch (err: any) {
      console.error('Error al crear publicación:', err);
      setError(
        err.response?.data?.message || 'No se pudo crear la publicación. Intenta nuevamente.'
      );
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (success) {
    return (
      <div className="success-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>¡Publicación creada exitosamente!</h2>
          <p>Redirigiendo a tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crear-post-container">
      <div className="crear-post-card">
        <h1 className="crear-post-title">Crear Nueva Publicación</h1>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="crear-post-form">
          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué estás pensando?"
              rows={6}
              disabled={submitting}
            />
          </div>

          {/* Imágenes */}
          <div className="form-group">
            <label className="form-label">Imágenes (opcional)</label>
            <p className="form-hint">Agrega URLs de imágenes para tu publicación</p>

            {imageUrls.map((url, index) => (
              <div key={index} className="image-url-field">
                <input
                  type="url"
                  className="form-input"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={submitting}
                />
                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImageField(index)}
                    className="remove-image-btn"
                    disabled={submitting}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddImageField}
              className="add-image-btn"
              disabled={submitting}
            >
              ➕ Agregar otra imagen
            </button>
          </div>

          {/* Etiquetas */}
          <div className="form-group">
            <label className="form-label">Etiquetas</label>
            <p className="form-hint">Selecciona las etiquetas que describan tu publicación</p>

            <div className="tags-container">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`tag-button ${
                    selectedTags.includes(tag.id) ? 'tag-selected' : ''
                  }`}
                  disabled={submitting}
                >
                  #{tag.name}
                </button>
              ))}
            </div>

            {selectedTags.length > 0 && (
              <p className="selected-tags-info">
                {selectedTags.length} {selectedTags.length === 1 ? 'etiqueta seleccionada' : 'etiquetas seleccionadas'}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-button"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearPost;

