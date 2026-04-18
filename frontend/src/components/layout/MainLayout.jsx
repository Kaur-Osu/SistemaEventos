import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-dark text-white/40 py-10 text-center text-sm border-t border-white/5">
        <p className="font-display text-xl tracking-widest text-white/80 mb-2">EVENTOS APP</p>
        <p>© {new Date().getFullYear()} Sistema de Eventos — Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}