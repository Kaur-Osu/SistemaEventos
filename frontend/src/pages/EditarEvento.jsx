import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input     from '../components/common/Input';
import Textarea  from '../components/common/TextArea';
import Select    from '../components/common/Select';
import Button    from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast }       from '../context/ToastContext';
import { eventosService } from '../services/eventosService';

const CATEGORIAS = [
  { value: 'festival',    label: 'Festival' },
  { value: 'teatro',      label: 'Teatro / Arte' },
  { value: 'deporte',     label: 'Deportes' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'conferencia', label: 'Conferencia' },
];

export default function EditarEvento() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToast } = useToast();

  const [isLoading,    setIsLoading]    = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evento,       setEvento]       = useState(null);
  const [formData,     setFormData]     = useState({ titulo: '', categoria: 'festival', fecha: '', ubicacion: '', descripcion: '' });
  const [imagenPreview, setImagenPreview] = useState(null);
  const [imagenFile,    setImagenFile]    = useState(null);
  const [zonas,         setZonas]         = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
  eventosService.obtenerDetalleOrganizador(id)
    .then(e => {
      setEvento(e);
      const fechaLocal = new Date(e.fecha).toISOString().slice(0, 16);
      setFormData({
        titulo     : e.titulo,
        categoria  : e.categoria,
        fecha      : fechaLocal,
        ubicacion  : e.ubicacion,
        descripcion: e.descripcion ?? '',
      });

      // Imagen: buscar portada o primera imagen disponible
      const portada = e.imagenes?.find(i => i.portada)?.urlImagen
                   ?? e.imagenes?.[0]?.urlImagen
                   ?? null;
      setImagenPreview(portada);

      // Zonas: el SP devuelve capacidadTotal, no capacidad
      setZonas((e.zonas ?? []).map(z => ({
        id        : z.idZona,
        idZona    : z.idZona,
        nombre    : z.nombre,
        precio    : z.precio,
        capacidad : z.capacidadTotal, // ← nombre correcto del SP
      })));
    })
    .catch(err => { addToast(err.message, 'error'); navigate('/organizador/eventos'); })
    .finally(() => setIsLoading(false));
}, [id]);

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
  const removeImagen    = () => { setImagenFile(null); setImagenPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const agregarZona     = () => setZonas(p => [...p, { id: Date.now(), idZona: null, nombre: '', precio: '', capacidad: '' }]);
  const eliminarZona    = (id) => { if (zonas.length > 1) setZonas(p => p.filter(z => z.id !== id)); };
  const handleZona      = (id, campo, val) => setZonas(p => p.map(z => z.id === id ? { ...z, [campo]: val } : z));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Editar datos generales
      await eventosService.editar(id, formData);

      // Sincronizar zonas: agregar nuevas, editar existentes
      for (const zona of zonas) {
        if (zona.idZona) {
          await eventosService.editarZona(zona.idZona, { nombre: zona.nombre, precio: Number(zona.precio), capacidad: Number(zona.capacidad) }).catch(() => null);
        } else {
          await eventosService.agregarZona(id, { nombre: zona.nombre, precio: Number(zona.precio), capacidad: Number(zona.capacidad) }).catch(() => null);
        }
      }

      // Subir nueva imagen si se seleccionó
      if (imagenFile) {
        const fd = new FormData();
        fd.append('imagen', imagenFile);
        fd.append('portada', 'true');
        await eventosService.subirImagen(id, fd).catch(() => null);
      }

      addToast('Cambios guardados correctamente.', 'success');
      navigate('/organizador/eventos');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 font-body">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-white border border-line rounded-xl text-muted hover:bg-surface hover:text-dark transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-display text-dark tracking-wide">Editar Evento</h1>
          <p className="text-muted text-sm mt-0.5">Actualiza la información de tu evento.</p>
        </div>
      </div>
      {!!evento?.listado && (
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3 animate-fade-in">
          <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-primary/90">
            <strong>Evento publicado.</strong> Al guardar cambios, el evento volverá a revisión y quedará invisible temporalmente.
          </p>
        </div>
      )}
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
                  <label htmlFor="img-edit" className="cursor-pointer text-sm font-semibold text-primary hover:text-primary/80">
                    Subir imagen
                    <input ref={fileInputRef} id="img-edit" type="file" className="sr-only" accept="image/*" onChange={handleImagen} />
                  </label>
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
              <Input label="Título" name="titulo" value={formData.titulo} onChange={handleChange} required />
            </div>
            <Select label="Categoría" id="categoria" name="categoria" options={CATEGORIAS} value={formData.categoria} onChange={handleChange} />
            <Input label="Fecha y hora" name="fecha" type="datetime-local" value={formData.fecha} onChange={handleChange} required />
            <div className="md:col-span-2">
              <Input label="Ubicación / Recinto" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <Textarea label="Descripción" name="descripcion" rows={4} value={formData.descripcion} onChange={handleChange} />
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
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Nombre</label>
                  <input type="text" value={zona.nombre} onChange={e => handleZona(zona.id, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                </div>
                <div className="sm:w-1/3">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Precio</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                    <input type="number" min="0" step="0.01" value={zona.precio} onChange={e => handleZona(zona.id, 'precio', e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                  </div>
                </div>
                <div className="sm:w-1/3">
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1">Capacidad</label>
                  <input type="number" min="1" value={zona.capacidad} onChange={e => handleZona(zona.id, 'capacidad', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-line focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none bg-white text-dark text-sm" required />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-line">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button>
            <Button type="submit" isLoading={isSubmitting}>Guardar cambios</Button>
          </div>

        </form>
      </div>
    </div>
  );
}