import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export type Option = { slug: string; label: string };

export function FilterSelect({
  label, value, onChange, options, anyLabel, icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly Option[];
  anyLabel: string;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const selected = options.find((o) => o.slug === value);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-200 cursor-pointer',
          open ? 'border-ember-500/60 bg-ember-500/5' : 'border-night-900/10 bg-white hover:border-night-900/25',
        )}
      >
        {icon && <span className="shrink-0 text-ember-500">{icon}</span>}
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-night-900/45">{label}</span>
          <span className={cn('block truncate text-sm font-semibold', selected ? 'text-night-900' : 'text-night-900/45')}>
            {selected ? selected.label : anyLabel}
          </span>
        </span>
        <ChevronDown className={cn('size-4 shrink-0 text-night-900/40 transition-transform duration-300', open && 'rotate-180 text-ember-500')} aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-auto rounded-2xl border border-night-900/10 bg-white p-1.5 shadow-lift"
          >
            {[ { slug: '', label: anyLabel }, ...options].map((o) => (
              <li key={o.slug || 'any'}>
                <button
                  type="button"
                  onClick={() => { onChange(o.slug); setOpen(false); }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                    value === o.slug ? 'bg-ember-500/10 text-ember-600' : 'text-night-900/75 hover:bg-sand-100',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {value === o.slug && <Check className="size-4 shrink-0" aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
