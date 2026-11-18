import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import type { Formation } from '../shared/types';
import { validateCustomFormation } from '../shared/formations';

interface FormationSelectorModalProps {
  open: boolean;
  formations: Formation[];
  currentFormationId: string;
  onClose: () => void;
  onSelectPreset: (formationId: string) => Promise<void>;
  onSelectCustom: (def: number, med: number, del: number) => Promise<void>;
}

export const FormationSelectorModal: React.FC<FormationSelectorModalProps> = ({
  open,
  formations,
  currentFormationId,
  onClose,
  onSelectPreset,
  onSelectCustom,
}) => {
  const [def, setDef] = useState(4);
  const [med, setMed] = useState(3);
  const [del, setDel] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (!open) return null;

  const customValidation = validateCustomFormation(def, med, del);

  const handlePreset = async (id: string) => {
    setSubmitting(true);
    setServerError(null);
    try {
      await onSelectPreset(id);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'No se pudo cambiar la formación.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customValidation.valid) return;
    setSubmitting(true);
    setServerError(null);
    try {
      await onSelectCustom(def, med, del);
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Esquema no permitido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formation-modal-title"
    >
      <div className="w-full max-w-3xl bg-[#151E29] border border-white/10 rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 id="formation-modal-title" className="font-display text-2xl font-bold text-white">
              Cambiar formación táctica
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Solo se admiten esquemas reales del fútbol profesional (1 portero + 10 jugadores de campo equilibrados).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Cerrar selector de formación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {serverError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              Formaciones actuales de élite
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formations.map((f) => {
                const active = f.id === currentFormationId;
                return (
                  <button
                    key={f.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => handlePreset(f.id)}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      active
                        ? 'bg-emerald-500/15 border-emerald-400/60'
                        : 'bg-[#0F1620] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-xl font-bold text-white">
                        {f.name}
                      </span>
                      {active && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{f.description}</p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Clubes: {f.realClubs}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-semibold text-slate-200">
              Ajuste táctico manual (validación realista)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              Configura líneas válidas (Defensas 3–5, Medios 2–5, Delanteros 1–3). Esquemas irreales como 10-0-0 quedan bloqueados.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Defensas
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={def}
                    onChange={(e) => setDef(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-white font-mono-nums text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Centrocampistas
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={med}
                    onChange={(e) => setMed(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-white font-mono-nums text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Delanteros
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={del}
                    onChange={(e) => setDel(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-white font-mono-nums text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {!customValidation.valid && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{customValidation.error}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-mono-nums">
                  Esquema resultante: 1-{def}-{med}-{del}
                </span>
                <button
                  type="submit"
                  disabled={!customValidation.valid || submitting}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                >
                  Aplicar esquema {def}-{med}-{del}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
