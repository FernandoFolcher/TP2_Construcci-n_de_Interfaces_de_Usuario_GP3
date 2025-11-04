import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌐 UnaHur Anti-Social Net
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Inicio
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <Link to="/perfil" className="navbar-link">
                  Perfil
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/crear-post" className="navbar-link">
                  Crear Post
                </Link>
              </li>
              <li className="navbar-item">
                <span className="navbar-user">👤 {user?.nickName}</span>
              </li>
              <li className="navbar-item">
                <button onClick={logout} className="navbar-button">
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/registro" className="navbar-link">
                  Registrarse
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

