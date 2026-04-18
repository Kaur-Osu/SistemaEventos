import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input     from '../components/common/Input';
import Textarea  from '../components/common/TextArea';
import Select    from '../components/common/Select';
import Button    from '../components/common/Button';
import { useToast }       from '../context/ToastContext';
import { eventosService } from '../services/eventosService';

const CATEGORIAS = [
  { value: 'festival',    label: 'Festival' },
  { value: 'teatro',      label: 'Teatro / Arte' },
  { value: 'deporte',     label: 'Deportes' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'conferencia', label: 'Conferencia' },
];

export default function CrearEvento() {
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    titulo: '', categoria: 'festival', fecha: '', ubicacion: '', descripcion: '',
  });
  const [imagenFile,    setImagenFile]    = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [zonas,         setZonas]         = useState([{ id: Date.now(), nombre: 'General', precio: '', capacidad: '' }]);
  const [isSubmitting,  setIsSubmitting]  = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Solo se permiten archivos de imagen.', 'error');
        return;
      }
      setImagenFile(file); setImagenPreview(URL.createObjectURL(file));
    }
  };

  const removeImagen = () => {
    setImagenFile(null); setImagenPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const agregarZona  = () => setZonas(p => [...p, { id: Date.now(), nombre: '', precio: '', capacidad: '' }]);
  const eliminarZona = (id) => { if (zonas.length > 1) setZonas(p => p.filter(z => z.id !== id)); };
  const handleZona   = (id, campo, val) => setZonas(p => p.map(z => z.id === id ? { ...z, [campo]: val } : z));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Crear el evento con las zonas
      const res = await eventosService.crear({
        ...formData,
        zonas: zonas.map(z => ({ nombre: z.nombre, precio: Number(z.precio), capacidad: Number(z.capacidad) })),
      });

      // 2. Si hay imagen, subirla por separado
      if (imagenFile && res.idEvento) {
        const fd = new FormData();
        fd.append('imagen', imagenFile);
        fd.append('portada', 'true');
        await eventosService.subirImagen(res.idEvento, fd).catch(() => null);
      }

      addToast('¡Evento creado! Pronto será revisado por un administrador.', 'success');
      navigate('/organizador/eventos');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 font-body">
      <div className="mb-7">
        <h1 className="text-3xl font-display text-dark tracking-wide">Crear Nuevo Evento</h1>
        <p className="text-muted text-sm mt-1">Completa todos los campos para publicar tu evento en el catálogo.</p>
      </div>

      <div className="bg-white rounded-2xl border border-line p-6 sm:p-8">
        <form onSubmit={handleSubmit}>

          {/* Banner */}
          <h2 className="text-base font-bold text-dark mb-4 pb-3 border-b border-line">Banner del evento</h2>
          <div className="mb-8">
            <div className={`border-2 border-dashed rounded-xl overflow-hidden transition-all ${!imagenPreview ? 'border-line hover:border-primary hover:bg-surface' : 'border-transparent p-0'}`}>
              {!imagenPreview ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <label htmlFor="img-crear" className="cursor-pointer text-sm font-semibold text-primary hover:text-primary/80">
                    Subir imagen
                    <input ref={fileInputRef} id="img-crear" type="file" className="sr-only" accept="image/*" onChange={handleImagen} />
                  </label>
                  <p className="text-xs text-muted">PNG, JPG o WEBP · máx. 5 MB</p>
                </div>
              ) : (
                <div className="relative h-56 group">
                  <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button type="button" variant="danger" size="sm" onClick={removeImagen}>Cambiar imagen</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info general */}
          <h2 className="text-base font-bold text-dark mb-5 pb-3 border-b border-line">Información general</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-1 mb-8">
            <div className="md:col-span-2">
              <Input label="Título del evento" name="titulo" placeholder="Ej. ROCK EN LA VILLA 2026" value={formData.titulo} onChange={handleChange} required />
            </div>
            <Select label="Categoría" id="categoria" name="categoria" options={CATEGORIAS} value={formData.categoria} onChange={handleChange} />
            <Input label="Fecha y hora" name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
            <div className="md:col-span-2">
              <Input label="Ubicación / Recinto" name="ubicacion" placeholder="Dirección completa o nombre del recinto" value={formData.ubicacion} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Textarea label="Descripción" name="descripcion" rows={4} placeholder="Cuéntale a tu público qué encontrarán en este evento..." value={formData.descripcion} onChange={handleChange} required />
            </div>
          </div>

          {/* Zonas */}
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-line">
            <h2 className="text-base font-bold text-dark">Zonas y boletos</h2>
            <Button type="button" variant="ghost" size="sm" onClick={agregarZona} className="text-primary hover:bg-primary/10"
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>}
            >
              Agregar zona
            </Button>
          </div>

          <div className="space-y-3 mb-8">
            {zonas.map(zona => (
              <div key={zona.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-surface border border-line rounded-xl relative">
                {zonas.length > 1 && (
                  <button type="button" onClick={() => eliminarZona(zona.id)}
                    className="absolute -top-2 -right-2 bg-white border border-line text-muted hover:text-error hover:border-error/40 p-1.5 rounded-full shadow-sm transition-all">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Nombre de zona</label>
                  <input type="text" placeholder="Ej. VIP, General..." value={zona.nombre} onChange={e => handleZona(zona.id, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                </div>
                <div className="sm:w-1/3">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Precio (MXN)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                    <input type="number" placeholder="0.00" min="0" step="0.01" value={zona.precio} onChange={e => handleZona(zona.id, 'precio', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                  </div>
                </div>
                <div className="sm:w-1/3">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Capacidad</label>
                  <input type="number" placeholder="Aforo" min="1" value={zona.capacidad} onChange={e => handleZona(zona.id, 'capacidad', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                </div>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-line">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting}>Crear evento</Button>
          </div>

        </form>
      </div>
    </div>
  );
}