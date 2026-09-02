import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, Backpack, Binoculars, Calendar, CheckCircle2, ChevronDown,
  ClipboardCheck, CloudRain, Compass, Gauge, Globe, HandHeart, Heart, Landmark, Leaf,
  MapPin, MapPinned, Mountain, MountainSnow, NotebookPen, PhoneCall, Route, ShieldCheck,
  Sparkles, Stamp, Star, Sun, Users, Waves, type LucideIcon,
} from 'lucide-react';
import { cn } from '../utils/cn';

/* ---------------- Icon registry (keeps bundle lean) ---------------- */

const ICONS: Record<string, LucideIcon> = {
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  backpack: Backpack,
  binoculars: Binoculars,
  calendar: Calendar,
  'chevron-down': ChevronDown,
  'clipboard-check': ClipboardCheck,
  'cloud-rain': CloudRain,
  compass: Compass,
  gauge: Gauge,
  globe: Globe,
  'hand-heart': HandHeart,
  heart: Heart,
  landmark: Landmark,
  leaf: Leaf,
  'map-pin': MapPin,
  'map-pinned': MapPinned,
  mountain: Mountain,
  'mountain-snow': MountainSnow,
  'notebook-pen': NotebookPen,
  'phone-call': PhoneCall,
  route: Route,
  'shield-check': ShieldCheck,
  sparkles: Sparkles,
  stamp: Stamp,
  star: Star,
  sun: Sun,
  users: Users,
  waves: Waves,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? Compass;
  return <Cmp className={className} aria-hidden />;
}

/* ---------------- Buttons ---------------- */

type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'outline-light' | 'outline-dark' | 'ghost-dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: boolean;
  type?: 'button' | 'submit';
};

export function Button({
  children, to, href, onClick, variant = 'primary', size = 'md', className, icon = false, type = 'button',
}: ButtonProps) {
  const base = cn(
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-all duration-300 cursor-pointer',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500',
    size === 'sm' && 'px-4 py-2 text-[13px]',
    size === 'md' && 'px-6 py-3 text-sm',
    size === 'lg' && 'px-8 py-4 text-[15px]',
    variant === 'primary' && 'bg-ember-500 text-white shadow-[0_10px_30px_-8px_rgba(242,105,46,0.55)] hover:bg-ember-600 hover:shadow-[0_14px_36px_-8px_rgba(242,105,46,0.65)] hover:-translate-y-0.5 active:translate-y-0',
    variant === 'outline-light' && 'border border-white/40 text-white hover:bg-white/10 hover:border-white/70 backdrop-blur-sm',
    variant === 'outline-dark' && 'border border-night-900/20 text-night-900 hover:border-night-900/50 hover:bg-night-900/5',
    variant === 'ghost-dark' && 'text-night-900 hover:bg-night-900/5',
    className,
  );
  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {icon && (
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden />
        )}
      </span>
      {variant === 'primary' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" aria-hidden />
      )}
    </>
  );
  if (to) return <Link to={to} className={base} onClick={onClick}>{inner}</Link>;
  if (href) return <a href={href} className={base} onClick={onClick}>{inner}</a>;
  return <button type={type} onClick={onClick} className={base}>{inner}</button>;
}

/* ---------------- Section heading ---------------- */

export function SectionHeading({
  overline, title, sub, align = 'left', dark = false, className,
}: { overline: string; title: ReactNode; sub?: string; align?: 'left' | 'center'; dark?: boolean; className?: string }) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
        <span className="h-px w-8 bg-ember-500" aria-hidden />
        <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-500">{overline}</span>
      </div>
      <h2 className={cn(
        'mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-medium leading-[1.08] tracking-tight',
        dark ? 'text-white' : 'text-night-900',
      )}>
        {title}
      </h2>
      {sub && (
        <p className={cn('mt-4 max-w-xl leading-relaxed', align === 'center' && 'mx-auto', dark ? 'text-white/65' : 'text-night-900/60')}>
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ---------------- Scroll reveal primitives ---------------- */

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children, delay = 0, y = 26, className, once = true,
}: { children: ReactNode; delay?: number; y?: number; className?: string; once?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: 'easeIn' } },
};

/* ---------------- Rating stars ---------------- */

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn('size-3.5', i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-night-900/10 text-night-900/10')}
          aria-hidden
        />
      ))}
    </span>
  );
}

/* ---------------- Pills & badges ---------------- */

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-night-900/10 bg-white px-3 py-1 text-xs font-semibold text-night-900/70',
      className,
    )}>
      {children}
    </span>
  );
}

/* ---------------- Skeletons & empty states ---------------- */

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="h-60 animate-pulse bg-night-900/8" />
      <div className="space-y-3 p-6">
        <div className="h-4 w-3/4 animate-pulse rounded bg-night-900/8" />
        <div className="h-3 w-full animate-pulse rounded bg-night-900/6" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-night-900/6" />
      </div>
    </div>
  );
}

export function EmptyState({
  title, text, actionLabel, actionTo,
}: { title: string; text: string; actionLabel?: string; actionTo?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-3xl border border-dashed border-night-900/15 bg-white/60 px-8 py-16 text-center"
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-ember-100 text-ember-600">
        <Compass className="size-7" aria-hidden />
      </span>
      <h3 className="mt-5 font-display text-xl text-night-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-night-900/60">{text}</p>
      {actionLabel && (
        <Button to={actionTo} size="sm" className="mt-6" icon>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

/* ---------------- Dark page hero used across sub-pages ---------------- */

export function PageHero({
  image, overline, title, sub, children,
}: { image: string; overline: string; title: string; sub?: string; children?: ReactNode }) {
  return (
    <header className="relative overflow-hidden bg-night-900">
      <motion.img
        src={image}
        alt=""
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-night-950/70 via-night-950/35 to-night-950/85" aria-hidden />
      <div className="container-x relative z-10 flex min-h-[46vh] flex-col justify-end pb-14 pt-36 sm:min-h-[52vh]">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ember-400" aria-hidden />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ember-300">{overline}</span>
          </div>
          <h1 className="text-shadow-hero mt-4 max-w-3xl font-display text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-white">
            {title}
          </h1>
          {sub && <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{sub}</p>}
        </Reveal>
        {children}
      </div>
      <div className="prayer-strip absolute bottom-0 left-0 h-1 w-full opacity-80" aria-hidden />
    </header>
  );
}

/* ---------------- Toast system ---------------- */

type Toast = { id: number; message: string; kind: 'success' | 'info' };
const ToastCtx = createContext<{ push: (message: string, kind?: Toast['kind']) => void }>({ push: () => {} });

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: Toast['kind'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-5 z-[120] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.94 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-white/10 bg-night-900/95 px-5 py-3.5 text-sm font-medium text-white shadow-lift backdrop-blur-xl"
              role="status"
            >
              <CheckCircle2 className="size-5 shrink-0 text-emerald-400" aria-hidden />
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}
