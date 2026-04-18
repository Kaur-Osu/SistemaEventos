export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-line flex flex-col h-full animate-pulse">
      {/* Área de la imagen */}
      <div className="h-48 w-full bg-line/50"></div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex gap-4 mb-4">
          {/* Cuadro de fecha */}
          <div className="rounded-xl min-w-[3.5rem] h-14 bg-line/50 flex-shrink-0"></div>
          
          {/* Título y hora */}
          <div className="w-full">
            <div className="h-5 bg-line/50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-line/50 rounded w-1/2"></div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="h-4 bg-line/50 rounded w-full mb-6 flex-grow"></div>

        {/* Botón */}
        <div className="h-10 bg-line/50 rounded-xl w-full mt-auto"></div>
      </div>
    </div>
  );
}