import React, { useState } from 'react';
import {
  CheckCircle2,
  FolderOpen,
  PlusCircle,
  Settings,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import type { CareerSummary, ClubProfile, Formation, PlayStyleId } from '../shared/types';
import { PLAY_STYLES, getPlayStyleConfig } from '../shared/tactics';
import { isSoundMuted, setSoundMuted } from '../utils/soundFx';

interface ClubSettingsModalProps {
  open: boolean;
  club: ClubProfile;
  careers: CareerSummary[];
  formations: Formation[];
  maxCareers: number;
  onClose: () => void;
  onLoadCareer: (clubId: string) => Promise<void>;
  onDeleteCareer: (clubId: string) => Promise<void>;
  onUpdateClub: (name: string, managerName: string) => Promise<void>;
  onCreateNewClub: (
    name: string,
    managerName: string,
    formationId: string,
    playStyle: PlayStyleId
  ) => Promise<void>;
}

type ModalTab = 'careers' | 'new' | 'settings';

export const ClubSettingsModal: React.FC<ClubSettingsModalProps> = ({
  open,
  club,
  careers,
  formations,
  maxCareers,
  onClose,
  onLoadCareer,
  onDeleteCareer,
  onUpdateClub,
  onCreateNewClub,
}) => {
  const [tab, setTab] = useState<ModalTab>('careers');
  const [name, setName] = useState(club.name);
  const [manager, setManager] = useState(club.managerName);
  const [newName, setNewName] = useState('');
  const [newManager, setNewManager] = useState('');
  const [newFormationId, setNewFormationId] = useState('4-3-3');
  const [newPlayStyle, setNewPlayStyle] = useState<PlayStyleId>('balanced');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [muted, setMuted] = useState(() => isSoundMuted());
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (open) {
      setName(club.name);
      setManager(club.managerName);
      setConfirmDeleteId(null);
    }
  }, [open, club.id, club.name, club.managerName]);

  if (!open) return null;

  const canCreateMore = careers.length < maxCareers;

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onUpdateClub(name, manager);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateMore || newName.trim().length < 2) return;
    setBusy(true);
    try {
      await onCreateNewClub(newName, newManager || 'Míster', newFormationId, newPlayStyle);
      setNewName('');
      setNewManager('');
      setTab('careers');
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleLoad = async (targetId: string) => {
    setBusy(true);
    try {
      await onLoadCareer(targetId);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (targetId: string) => {
    setBusy(true);
    try {
      await onDeleteCareer(targetId);
      setConfirmDeleteId(null);
    } finally {
      setBusy(false);
    }
  };

  const toggleAudio = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-settings-title"
    >
      <div className="w-full max-w-2xl bg-[#151E29] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 id="club-settings-title" className="font-display text-2xl font-bold text-white">
                Carreras y Ajustes del Club
              </h2>
              <p className="text-xs text-slate-400">
                Tu progreso se guarda automáticamente · Hasta {maxCareers} carreras simultáneas ({careers.length}/{maxCareers})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Cerrar ajustes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation tabs inside modal */}
        <div className="px-6 pt-3 border-b border-white/10 flex items-center gap-5 bg-[#0F1620]">
          <button
            type="button"
            onClick={() => setTab('careers')}
            className={`inline-flex items-center gap-1.5 pb-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'careers'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Cargar carrera ({careers.length}/{maxCareers})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`inline-flex items-center gap-1.5 pb-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'new'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nueva carrera</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('settings')}
            className={`inline-flex items-center gap-1.5 pb-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              tab === 'settings'
                ? 'border-emerald-400 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Club actual y Audio</span>
          </button>
        </div>

        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-5">
          {tab === 'careers' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-slate-300">
                  Cambia entre tus carreras guardadas o elimina alguna para empezar otra con un estilo distinto.
                </p>
                {canCreateMore && (
                  <button
                    type="button"
                    onClick={() => setTab('new')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 whitespace-nowrap"
                  >
                    + Crear otra
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {careers.map((c) => {
                  const isActive = c.id === club.id;
                  const styleCfg = getPlayStyleConfig(c.playStyle);
                  const isConfirming = confirmDeleteId === c.id;

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-500/10 border-emerald-400/50'
                          : 'bg-[#0F1620] border-white/10'
                      }`}
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-xl font-bold text-white truncate">
                            {c.name}
                          </h3>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Activa
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Míster {c.managerName} · {c.formationId} · {styleCfg.label}
                        </p>
                        <p className="text-xs text-slate-300 font-mono-nums">
                          Saldo €{c.budget.toFixed(1)}M · {c.startersCount}/11 titulares ·{' '}
                          {c.avgOverall > 0 ? `OVR ${c.avgOverall}` : 'Sin XI completo'} ·{' '}
                          {c.record.wins}V-{c.record.draws}E-{c.record.losses}D
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleLoad(c.id)}
                            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 transition-colors whitespace-nowrap"
                          >
                            Cargar carrera
                          </button>
                        )}

                        {careers.length > 1 && (
                          isConfirming ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleDelete(c.id)}
                                className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-400 transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:text-white bg-white/5"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setConfirmDeleteId(c.id)}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 border border-red-400/25 text-red-300 hover:bg-red-500/20 transition-colors"
                              title="Eliminar carrera"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'new' && (
            <form onSubmit={handleCreateNew} className="space-y-4">
              {!canCreateMore ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs text-amber-200">
                  Ya has alcanzado el máximo de <strong>{maxCareers} carreras guardadas</strong>. Ve a «Cargar carrera» y elimina una para poder fundar otro club.
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Fundar nueva carrera ({careers.length + 1}/{maxCareers})
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Empiezas desde cero con <strong>750M €</strong> iniciales y tu propio estilo de juego y esquema.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nombre del club</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Real Buenos Aires"
                        minLength={2}
                        maxLength={32}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nombre del entrenador</label>
                      <input
                        type="text"
                        placeholder="Míster"
                        maxLength={24}
                        value={newManager}
                        onChange={(e) => setNewManager(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Formación inicial</label>
                      <select
                        value={newFormationId}
                        onChange={(e) => setNewFormationId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
                      >
                        {formations.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.name} · {f.realClubs.split(',')[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Estilo de juego inicial</label>
                      <select
                        value={newPlayStyle}
                        onChange={(e) => setNewPlayStyle(e.target.value as PlayStyleId)}
                        className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
                      >
                        {PLAY_STYLES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-300">
                    Estilo elegido: {getPlayStyleConfig(newPlayStyle).shortDesc}
                  </p>

                  <button
                    type="submit"
                    disabled={busy || newName.trim().length < 2}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 transition-colors"
                  >
                    Crear nueva carrera (€750M)
                  </button>
                </>
              )}
            </form>
          )}

          {tab === 'settings' && (
            <div className="space-y-6">
              <form onSubmit={handleRename} className="space-y-3">
                <h3 className="text-sm font-semibold text-white">Editar carrera activa</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre del club</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={32}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nombre del entrenador</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={24}
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 transition-colors"
                >
                  Guardar cambios
                </button>
              </form>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Sonido en simulaciones y fichajes</p>
                  <p className="text-xs text-slate-400">Efectos breves con Web Audio API.</p>
                </div>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-xs font-semibold text-slate-200 hover:border-white/30"
                >
                  {muted ? (
                    <VolumeX className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{muted ? 'Silenciado' : 'Activado'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
