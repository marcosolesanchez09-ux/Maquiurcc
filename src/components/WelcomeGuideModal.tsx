import React from 'react';
import { BookOpen, Flame, Link2, ShoppingBag, Swords, X } from 'lucide-react';

interface WelcomeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeGuideModal: React.FC<WelcomeGuideModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-guide-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#151E29] border border-white/15 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-emerald-500/15 via-[#151E29] to-[#151E29]">
          <div>
            <p className="text-xs font-semibold text-emerald-400">
              Guía rápida de Maquiurcc.com
            </p>
            <h2
              id="welcome-guide-title"
              className="font-display text-3xl font-bold text-white mt-1"
            >
              Construye tu club, conecta la química y simula partidos
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Empiezas desde cero con <strong>750M €</strong> para montar un once ganador y tres suplentes antes de saltar al mercado diario.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar introducción"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#0F1620] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <BookOpen className="w-4 h-4 shrink-0" />
                <h3 className="font-display text-lg font-bold text-white">
                  1. Ficha con tus 750M € iniciales
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pulsa cualquier hueco del campo (o abre el <strong>Buscador</strong>) para fichar a cualquier jugador del catálogo FIFA mundial (LaLiga, Premier, Liga Argentina, Brasileirão, MLS y más). Al completar los <strong>11 titulares y 3 suplentes</strong>, tu saldo pasará automáticamente a <strong>€50.0M</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1620] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Link2 className="w-4 h-4 shrink-0" />
                <h3 className="font-display text-lg font-bold text-white">
                  2. Química del equipo (0–100)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Alinea futbolistas que compartan <strong>liga, país o club</strong>. Verás las conexiones en el campo y sumarás hasta <strong>+4.5 de media extra</strong> en los partidos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1620] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <Swords className="w-4 h-4 shrink-0" />
                <h3 className="font-display text-lg font-bold text-white">
                  3. Táctica real y simulación vs Bots
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                En <strong>Partidos</strong> eliges tu estilo de juego (Posesión, Presión Alta, Contraataque, Bloque Bajo...), mentalidad, capitán y lanzador de penaltis. Los partidos se <strong>simulan automáticamente</strong> según tu once, química y táctica para hacerte ganar millones.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F1620] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <h3 className="font-display text-lg font-bold text-white">
                  4. Tienda Diaria, Mercado y Reservas
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cada día aparecen nuevos jugadores conocidos de las 5 grandes ligas europeas en la <strong>Tienda Diaria</strong>. Además puedes comprar o vender jugadores en el <strong>Mercado</strong> y guardar reservas ilimitadas.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/25 flex items-start gap-2.5 text-xs text-emerald-100">
            <Flame className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Consejo de míster: no gastes todo en 2 estrellas al principio; equilibra los 14 puestos buscando jugadores de la misma liga o selección para activar la química desde el primer partido.
            </span>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/10 bg-[#0F1620] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            Puedes volver a consultar esta guía cuando quieras desde el botón &laquo;Cómo jugar&raquo;.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            ¡Entendido, empezar a fichar!
          </button>
        </div>
      </div>
    </div>
  );
};
