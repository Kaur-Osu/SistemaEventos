import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem('usuario_eventos');
      const storedToken = localStorage.getItem('token_eventos');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('usuario_eventos');
      localStorage.removeItem('token_eventos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('usuario_eventos', JSON.stringify(userData));
    localStorage.setItem('token_eventos', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('usuario_eventos');
    localStorage.removeItem('token_eventos');
  };

  // Actualiza solo los campos del usuario en sesión (ej. tras verificar correo)
  const updateUser = (cambios) => {
    const updated = { ...user, ...cambios };
    setUser(updated);
    localStorage.setItem('usuario_eventos', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};