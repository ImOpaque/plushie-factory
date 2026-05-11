import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MathUtils } from "three";
import {
  getMergedEntityTransform,
  getMergedExtras,
  SCENE_ENTITY_IDS,
  SCENE_ENTITY_META,
  type SceneEntityId,
} from "../../data/sceneLayoutRegistry";
import {
  SCENE_EDITOR_STORAGE_KEY,
  useSceneEditorStore,
  type SceneEditorPersisted,
  type TransformMode,
} from "../../stores/sceneEditorStore";

function isEntityId(s: string): s is SceneEntityId {
  return (SCENE_ENTITY_IDS as readonly string[]).includes(s);
}

function safeParseLayout(json: string): SceneEditorPersisted | null {
  try {
    const v = JSON.parse(json) as unknown;
    if (!v || typeof v !== "object") return null;
    const o = v as Record<string, unknown>;
    const overrides = o.overrides;
    const extras = o.extras;
    if (overrides !== undefined && typeof overrides !== "object") return null;
    if (extras !== undefined && typeof extras !== "object") return null;
    return {
      overrides: (overrides ?? {}) as SceneEditorPersisted["overrides"],
      extras: (extras ?? {}) as SceneEditorPersisted["extras"],
    };
  } catch {
    return null;
  }
}

function NumField({
  label,
  value,
  step,
  onCommit,
}: {
  label: string;
  value: number;
  step: number;
  onCommit: (n: number) => void;
}) {
  const [local, setLocal] = useState(() => String(value));
  useEffect(() => {
    setLocal(String(value));
  }, [value]);
  return (
    <label className="flex flex-col gap-0.5 font-body text-[0.65rem] text-silver-muted">
      <span>{label}</span>
      <input
        type="number"
        step={step}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={() => {
          const n = parseFloat(local);
          onCommit(Number.isFinite(n) ? n : value);
          setLocal(String(Number.isFinite(n) ? n : value));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className="w-full rounded-lg border border-white/[0.1] bg-surface-card/90 px-2 py-1.5 font-mono text-[0.75rem] text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]/50"
      />
    </label>
  );
}

function TransformFields({ id }: { id: SceneEntityId }) {
  const overrides = useSceneEditorStore((s) => s.overrides);
  const t = useMemo(() => getMergedEntityTransform(id, overrides), [id, overrides]);
  const patchField = useSceneEditorStore((s) => s.patchTransformField);

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      <div className="col-span-3 font-display text-[0.65rem] uppercase tracking-[0.12em] text-silver-muted">
        Position
      </div>
      {(["X", "Y", "Z"] as const).map((axis, i) => (
        <NumField
          key={`p-${axis}`}
          label={axis}
          value={t.position[i as 0 | 1 | 2]}
          step={0.01}
          onCommit={(n) => patchField(id, "position", i as 0 | 1 | 2, n)}
        />
      ))}
      <div className="col-span-3 mt-2 font-display text-[0.65rem] uppercase tracking-[0.12em] text-silver-muted">
        Rotation (°)
      </div>
      {(["X", "Y", "Z"] as const).map((axis, i) => (
        <NumField
          key={`r-${axis}`}
          label={axis}
          value={MathUtils.radToDeg(t.rotation[i as 0 | 1 | 2])}
          step={0.5}
          onCommit={(deg) =>
            patchField(id, "rotation", i as 0 | 1 | 2, MathUtils.degToRad(deg))
          }
        />
      ))}
      <div className="col-span-3 mt-2 font-display text-[0.65rem] uppercase tracking-[0.12em] text-silver-muted">
        Scale
      </div>
      {(["X", "Y", "Z"] as const).map((axis, i) => (
        <NumField
          key={`s-${axis}`}
          label={axis}
          value={t.scale[i as 0 | 1 | 2]}
          step={0.02}
          onCommit={(n) => patchField(id, "scale", i as 0 | 1 | 2, n)}
        />
      ))}
    </div>
  );
}

function ModeBtn({ mode, label }: { mode: TransformMode; label: string }) {
  const cur = useSceneEditorStore((s) => s.transformMode);
  const set = useSceneEditorStore((s) => s.setTransformMode);
  const active = cur === mode;
  return (
    <button
      type="button"
      onClick={() => set(mode)}
      className={`rounded-lg px-2.5 py-1.5 font-body text-[0.7rem] font-medium transition-colors ${
        active
          ? "bg-[var(--color-accent)] text-white"
          : "bg-white/[0.06] text-silver-muted hover:bg-white/[0.1]"
      }`}
    >
      {label}
    </button>
  );
}

export function SceneEditorPanel() {
  const enabled = useSceneEditorStore((s) => s.enabled);
  const toggleEnabled = useSceneEditorStore((s) => s.toggleEnabled);
  const selectedId = useSceneEditorStore((s) => s.selectedId);
  const setSelectedId = useSceneEditorStore((s) => s.setSelectedId);
  const unsaved = useSceneEditorStore((s) => s.unsaved);
  const saveToStorage = useSceneEditorStore((s) => s.saveToStorage);
  const resetAll = useSceneEditorStore((s) => s.resetAll);
  const resetEntity = useSceneEditorStore((s) => s.resetEntity);
  const extrasPartial = useSceneEditorStore((s) => s.extrasPartial);
  const extras = useMemo(() => getMergedExtras(extrasPartial), [extrasPartial]);
  const patchExtras = useSceneEditorStore((s) => s.patchExtras);
  const fileRef = useRef<HTMLInputElement>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const el = e.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.tagName === "SELECT" ||
          el.isContentEditable)
      ) {
        return;
      }
      if (e.code === "Backquote") {
        e.preventDefault();
        toggleEnabled();
      }
      if (!useSceneEditorStore.getState().enabled) return;
      if (e.code === "KeyT") useSceneEditorStore.getState().setTransformMode("translate");
      if (e.code === "KeyR") useSceneEditorStore.getState().setTransformMode("rotate");
      if (e.code === "KeyS") useSceneEditorStore.getState().setTransformMode("scale");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleEnabled]);

  const byCategory = useMemo(() => {
    const m = new Map<string, SceneEntityId[]>();
    for (const id of SCENE_ENTITY_IDS) {
      const cat = SCENE_ENTITY_META[id].category;
      const arr = m.get(cat) ?? [];
      arr.push(id);
      m.set(cat, arr);
    }
    return m;
  }, []);

  const exportJson = useCallback(() => {
    const s = useSceneEditorStore.getState();
    const payload: SceneEditorPersisted = {
      overrides: s.overrides,
      extras: s.extrasPartial,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "plushie-factory-scene-layout.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const onImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = safeParseLayout(text);
      if (!parsed) return;
      const cleanOverrides: SceneEditorPersisted["overrides"] = {};
      if (parsed.overrides) {
        for (const k of Object.keys(parsed.overrides)) {
          if (isEntityId(k)) cleanOverrides[k] = parsed.overrides[k];
        }
      }
      useSceneEditorStore.setState({
        overrides: cleanOverrides,
        extrasPartial: parsed.extras ?? {},
        unsaved: true,
      });
    };
    reader.readAsText(f);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await saveToStorage();
      setSaveMsg("Saved to this browser.");
      window.setTimeout(() => setSaveMsg(null), 2200);
    } catch {
      setSaveMsg("Save failed.");
      window.setTimeout(() => setSaveMsg(null), 3200);
    }
  }, [saveToStorage]);

  return (
    <>
      <button
        type="button"
        onClick={() => toggleEnabled()}
        className={`pointer-events-auto fixed bottom-20 right-4 z-[40] rounded-full border px-4 py-2 font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] shadow-panel transition-colors sm:bottom-24 ${
          enabled
            ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/25 text-[var(--color-text)]"
            : "border-white/[0.1] bg-surface-card/95 text-silver-muted hover:border-white/[0.16]"
        }`}
      >
        {enabled ? "Close editor" : "Scene editor"}
      </button>

      <AnimatePresence>
        {enabled ? (
          <motion.aside
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="pointer-events-auto fixed right-4 top-[4.5rem] z-[40] flex max-h-[min(78vh,640px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--color-bg-mid)]/98 shadow-panel backdrop-blur-md sm:top-[5.25rem]"
          >
            <div className="border-b border-white/[0.06] px-4 py-3">
              <h2 className="font-display text-sm font-semibold tracking-wide text-[var(--color-text)]">
                Scene layout
              </h2>
              <p className="mt-1 font-body text-[0.65rem] leading-relaxed text-silver-muted">
                <kbd className="rounded border border-white/15 bg-white/5 px-1 font-mono">`</kbd>{" "}
                toggle · <kbd className="font-mono">T</kbd> move · <kbd className="font-mono">R</kbd>{" "}
                rotate · <kbd className="font-mono">S</kbd> scale · Click in the 3D view or pick
                from the list
              </p>
            </div>

            <div className="thin-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
              <div className="flex flex-wrap gap-1.5">
                <ModeBtn mode="translate" label="Move (T)" />
                <ModeBtn mode="rotate" label="Rotate (R)" />
                <ModeBtn mode="scale" label="Scale (S)" />
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-surface-card/40 p-3">
                <div className="font-display text-[0.65rem] uppercase tracking-[0.14em] text-silver-muted">
                  Ambience
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <NumField
                    label="Ambient"
                    value={extras.ambientIntensity}
                    step={0.02}
                    onCommit={(n) => patchExtras({ ambientIntensity: Math.max(0, n) })}
                  />
                  <NumField
                    label="Env map"
                    value={extras.envIntensity}
                    step={0.02}
                    onCommit={(n) => patchExtras({ envIntensity: Math.max(0, n) })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    useSceneEditorStore.setState((s) => {
                      const next = { ...s.extrasPartial };
                      delete next.ambientIntensity;
                      delete next.envIntensity;
                      return { extrasPartial: next, unsaved: true };
                    });
                  }}
                  className="mt-2 font-body text-[0.65rem] text-[var(--color-accent)] hover:underline"
                >
                  Reset ambience
                </button>
              </div>

              {[...byCategory.entries()].map(([cat, ids]) => (
                <div key={cat}>
                  <div className="mb-1.5 font-display text-[0.65rem] uppercase tracking-[0.14em] text-silver-muted">
                    {cat}
                  </div>
                  <div className="flex flex-col gap-1">
                    {ids.map((id) => {
                      const meta = SCENE_ENTITY_META[id];
                      const sel = selectedId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedId(id)}
                          className={`rounded-lg border px-3 py-2 text-left transition-colors ${
                            sel
                              ? "border-[var(--color-accent)]/45 bg-[var(--color-accent)]/12"
                              : "border-transparent bg-white/[0.04] hover:bg-white/[0.07]"
                          }`}
                        >
                          <div className="font-body text-[0.78rem] font-medium text-[var(--color-text)]">
                            {meta.label}
                          </div>
                          {meta.hint ? (
                            <div className="mt-0.5 font-body text-[0.62rem] text-silver-muted">
                              {meta.hint}
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedId ? (
                <div className="rounded-xl border border-white/[0.08] bg-surface-card/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[0.72rem] font-semibold text-[var(--color-text)]">
                      {SCENE_ENTITY_META[selectedId].label}
                    </span>
                    <button
                      type="button"
                      onClick={() => resetEntity(selectedId)}
                      className="shrink-0 rounded-lg border border-white/[0.1] px-2 py-1 font-body text-[0.62rem] text-silver-muted hover:bg-white/[0.06]"
                    >
                      Reset
                    </button>
                  </div>
                  <TransformFields id={selectedId} />
                </div>
              ) : (
                <p className="font-body text-[0.7rem] text-silver-muted">
                  Select an object to edit numbers, or use the gizmo in the 3D view.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  className="rounded-lg bg-[var(--color-accent)] px-3 py-2 font-body text-[0.72rem] font-semibold text-white shadow-panel hover:bg-[var(--color-accent-deep)]"
                >
                  Save layout
                </button>
                <button
                  type="button"
                  onClick={exportJson}
                  className="rounded-lg border border-white/[0.12] px-3 py-2 font-body text-[0.72rem] text-silver-muted hover:bg-white/[0.06]"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="rounded-lg border border-white/[0.12] px-3 py-2 font-body text-[0.72rem] text-silver-muted hover:bg-white/[0.06]"
                >
                  Import…
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={onImportFile}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Reset every layout override to defaults?")) resetAll();
                  }}
                  className="font-body text-[0.65rem] text-red-300/90 hover:underline"
                >
                  Reset all layouts
                </button>
                {unsaved ? (
                  <span className="font-body text-[0.62rem] text-amber-200/90">Unsaved changes</span>
                ) : (
                  <span className="font-body text-[0.62rem] text-silver-muted">Saved defaults</span>
                )}
              </div>
              {saveMsg ? (
                <p className="font-body text-[0.65rem] text-emerald-300/90">{saveMsg}</p>
              ) : null}
              <p className="font-body text-[0.6rem] leading-relaxed text-silver-muted/90">
                Layout key: <span className="font-mono">{SCENE_EDITOR_STORAGE_KEY}</span> (IndexedDB,
                this browser only).
              </p>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
