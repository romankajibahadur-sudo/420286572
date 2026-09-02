import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ImagePlus, Link2, Pencil, RefreshCw, Search, Trash2, Upload, X } from 'lucide-react';
import { GALLERY_CATEGORIES, seedGallery, type GalleryImage } from '../../data/gallery';
import { deleteGalleryImage, listGallery, resetGallery, saveGalleryImage } from '../../lib/db';
import { fileToCompressedDataUrl, prettyBytes } from '../../lib/image';
import { useAuth } from '../../lib/auth';
import { useToast } from '../../components/ui';
import { cn } from '../../utils/cn';
import { PanelCard } from './Panels';

const seedIds = new Set(seedGallery.map((g) => g.id));
const field =
  'w-full rounded-lg border border-night-900/12 bg-white px-3.5 py-2.5 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/20';
const label = 'block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45 mb-1.5';

function blank(): GalleryImage {
  return { id: `img_${Date.now().toString(36)}`, src: '', title: '', caption: '', category: 'Everest', credit: '', custom: true };
}

/* ---------------- Editor modal (upload or URL) ---------------- */

function ImageEditor({
  image, onClose, onSaved,
}: { image: GalleryImage | null; onClose: () => void; onSaved: () => void }) {
  const { push } = useToast();
  const isNew = image === null;
  const [f, setF] = useState<GalleryImage>(() => image ?? blank());
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>(image?.src.startsWith('http') ? 'url' : 'upload');
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (p: Partial<GalleryImage>) => setF((x) => ({ ...x, ...p }));

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      set({ src: dataUrl, title: f.title || file.name.replace(/\.[^.]+$/, '') });
      push(`Image ready · optimised to ${prettyBytes(dataUrl.length)}`);
    } catch (err) {
      push(err instanceof Error ? err.message : 'Upload failed', 'info');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!f.src) return push('Add an image — upload a file or paste a URL.', 'info');
    if (!f.title.trim()) return push('Give the photo a title.', 'info');
    setBusy(true);
    try {
      await saveGalleryImage({ ...f, title: f.title.trim() }, isNew);
      push(isNew ? 'Photo added to the gallery' : 'Photo updated');
      onSaved();
      onClose();
    } catch {
      push('Save failed — the image may be too large.', 'info');
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] overflow-y-auto bg-night-950/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose} role="dialog" aria-modal="true" aria-label={isNew ? 'Add photo' : 'Edit photo'}
    >
      <motion.form
        initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()} onSubmit={submit}
        className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lift sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-night-900">{isNew ? 'Add photo' : 'Edit photo'}</h3>
          <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full border border-night-900/12 transition hover:bg-night-900/5" aria-label="Close">
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {/* source switch */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-night-900/5 p-1">
          {([['upload', 'Upload from device', Upload], ['url', 'Use image URL', Link2]] as const).map(([m, txt, Ico]) => (
            <button
              key={m} type="button" onClick={() => setMode(m)}
              className={cn('flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-extrabold transition cursor-pointer',
                mode === m ? 'bg-white text-night-900 shadow-card' : 'text-night-900/50 hover:text-night-900')}
            >
              <Ico className="size-4" aria-hidden /> {txt}
            </button>
          ))}
        </div>

        {mode === 'upload' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); void handleFile(e.dataTransfer.files?.[0]); }}
            className="mt-4 rounded-2xl border-2 border-dashed border-night-900/15 bg-sand-100/60 p-6 text-center transition hover:border-ember-500/50"
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => void handleFile(e.target.files?.[0])} />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <span className="size-7 animate-spin rounded-full border-2 border-ember-500/30 border-t-ember-500" aria-hidden />
                <p className="text-sm font-bold text-night-900/60">Optimising image…</p>
              </div>
            ) : (
              <>
                <ImagePlus className="mx-auto size-8 text-night-900/30" aria-hidden />
                <p className="mt-3 text-sm font-bold text-night-900">Drop an image here</p>
                <p className="mt-1 text-xs text-night-900/45">JPG, PNG or WebP from your device — auto-resized &amp; compressed</p>
                <button type="button" onClick={() => fileRef.current?.click()} className="mt-4 rounded-xl bg-night-950 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-ember-600 cursor-pointer">
                  Choose file
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <label className={label} htmlFor="gi-url">Image URL</label>
            <input id="gi-url" className={field} value={f.src.startsWith('data:') ? '' : f.src} onChange={(e) => set({ src: e.target.value })} placeholder="https://…" />
          </div>
        )}

        {f.src && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-night-900/10">
            <img src={f.src} alt="Preview" className="max-h-56 w-full object-cover" />
          </div>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gi-title">Title *</label>
            <input id="gi-title" className={field} value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Dawn on Nuptse & Everest" />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gi-cap">Caption</label>
            <textarea id="gi-cap" rows={2} className={`${field} resize-none`} value={f.caption} onChange={(e) => set({ caption: e.target.value })} placeholder="A sentence of context for the lightbox…" />
          </div>
          <div>
            <label className={label} htmlFor="gi-cat">Category</label>
            <select id="gi-cat" className={field} value={f.category} onChange={(e) => set({ category: e.target.value })}>
              {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="gi-credit">Photo credit</label>
            <input id="gi-credit" className={field} value={f.credit ?? ''} onChange={(e) => set({ credit: e.target.value })} placeholder="Photographer name" />
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3 border-t border-night-900/10 pt-5">
          <button type="button" onClick={onClose} className="rounded-xl border border-night-900/15 px-6 py-3 text-sm font-bold text-night-900/70 transition hover:bg-night-900/5 cursor-pointer">Cancel</button>
          <button type="submit" disabled={busy || uploading} className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-7 py-3 text-sm font-extrabold text-white transition hover:bg-ember-600 disabled:opacity-60 cursor-pointer">
            {busy ? <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden /> : <Check className="size-4" aria-hidden />}
            {isNew ? 'Add to gallery' : 'Save changes'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

/* ---------------- Panel ---------------- */

export function GalleryPanel() {
  const { canEdit } = useAuth();
  const { push } = useToast();
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [query, setQuery] = useState('');
  const [editor, setEditor] = useState<{ open: boolean; image: GalleryImage | null }>({ open: false, image: null });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => listGallery().then(setImages).catch(() => setImages([]));
  useEffect(() => { void load(); }, []);

  const shown = useMemo(() => {
    if (!images) return [];
    const q = query.trim().toLowerCase();
    return q ? images.filter((i) => `${i.title} ${i.category} ${i.credit ?? ''}`.toLowerCase().includes(q)) : images;
  }, [images, query]);

  const remove = async (img: GalleryImage) => {
    await deleteGalleryImage(img.id, !seedIds.has(img.id));
    setConfirmId(null);
    await load();
    push('Photo removed from the gallery');
  };

  return (
    <>
      <PanelCard
        title="Gallery manager"
        sub={canEdit ? `${images?.length ?? '—'} photos live on /gallery — uploads publish instantly` : `${images?.length ?? '—'} photos — your role has view-only access`}
        action={
          <div className={cn('flex flex-wrap gap-2', !canEdit && 'hidden')}>
            <button
              type="button"
              onClick={async () => { await resetGallery(); await load(); push('Gallery restored to defaults'); }}
              className="inline-flex items-center gap-2 rounded-xl border border-night-900/12 px-4 py-2.5 text-xs font-extrabold text-night-900/60 transition hover:border-rose-400 hover:text-rose-600 cursor-pointer"
            >
              <RefreshCw className="size-3.5" aria-hidden /> Reset gallery
            </button>
            <button
              type="button"
              onClick={() => setEditor({ open: true, image: null })}
              className="inline-flex items-center gap-2 rounded-xl bg-ember-500 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-ember-600 cursor-pointer"
            >
              <ImagePlus className="size-4" aria-hidden /> Upload photo
            </button>
          </div>
        }
      >
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-night-900/35" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search photos…" aria-label="Search photos" className={`${field} pl-10`} />
        </div>

        {images === null ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-night-900/6" />)}
          </div>
        ) : shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-night-900/15 px-6 py-14 text-center text-sm text-night-900/45">
            {query ? `No photos match “${query}”.` : 'The gallery is empty — upload your first photo.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shown.map((img) => (
              <div key={img.id} className="group overflow-hidden rounded-2xl border border-night-900/8 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-night-900/5">
                  <img src={img.src} alt={img.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {!seedIds.has(img.id) && (
                    <span className="absolute left-2 top-2 rounded-full bg-ember-500 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white">Uploaded</span>
                  )}
                  <div className={cn('absolute inset-x-0 bottom-0 flex gap-1.5 bg-gradient-to-t from-night-950/90 to-transparent p-2.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100', !canEdit && 'hidden')}>
                    <button
                      type="button" onClick={() => setEditor({ open: true, image: img })}
                      className="grid size-8 flex-1 place-items-center rounded-lg bg-white/95 text-night-900 transition hover:bg-ember-500 hover:text-white cursor-pointer"
                      aria-label={`Edit ${img.title}`}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                    </button>
                    {confirmId === img.id ? (
                      <button type="button" onClick={() => remove(img)} className="flex-1 rounded-lg bg-rose-600 px-2 text-[10px] font-extrabold text-white cursor-pointer">Confirm</button>
                    ) : (
                      <button
                        type="button" onClick={() => setConfirmId(img.id)}
                        className="grid size-8 flex-1 place-items-center rounded-lg bg-white/95 text-night-900 transition hover:bg-rose-600 hover:text-white cursor-pointer"
                        aria-label={`Delete ${img.title}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-3">
                  <p className="truncate text-xs font-bold text-night-900">{img.title}</p>
                  <p className="truncate text-[11px] text-night-900/45">{img.category}{img.credit ? ` · ${img.credit}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </PanelCard>

      <AnimatePresence>
        {editor.open && (
          <ImageEditor image={editor.image} onClose={() => setEditor({ open: false, image: null })} onSaved={load} />
        )}
      </AnimatePresence>
    </>
  );
}
