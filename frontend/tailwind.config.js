/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 1. Colores de Marca y Estado (Página 1)
        primary: '#2563EB',
        secondary: '#7C3AED',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        
        // 2. UI Neutra (Página 2)
        surface: '#F8FAFC',
        line: '#E2E8F0',
        muted: '#64748B',
        dark: '#0F172A',

        // 3. Temas por Categoría (Páginas 2 y 3)
        festival: { main: '#DC2626', accent: '#FBBF24' },
        teatro: { main: '#7C3AED', accent: '#F59E0B' },
        corporativo: { main: '#1E3A8A', accent: '#64748B' },
        deporte: { main: '#059669', accent: '#F97316' },
        conferencia: { main: '#0284C7', accent: '#06B6D4' }
      },
      fontFamily: {
        // 4. Tipografía (Página 4)
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}