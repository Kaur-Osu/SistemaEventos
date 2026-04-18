import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Extraemos el objeto pathname, que representa la ruta actual
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que pathname cambie, el navegador subirá al inicio
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Puedes usar 'smooth' si prefieres una animación suave
    });
  }, [pathname]);

  // Este componente no renderiza nada visualmente
  return null;
};

export default ScrollToTop;