import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BadgeCheck, CalendarDays, Check, Clock, Mail, MapPin, MessageCircle, Mountain,
  Phone, Send, ShieldCheck, Users,
} from 'lucide-react';
import { useJourneys } from '../data/store';
import { createInquiry } from '../lib/db';
import { sendNotification } from '../lib/notify';
import { useSeo } from '../lib/hooks';
import { SITE } from '../lib/site';
import { formatAlt, formatPrice, pex } from '../lib/utils';
import { PageHero, Reveal, useToast } from '../components/ui';
import { cn } from '../utils/cn';

const field =
  'w-full rounded-xl border border-night-900/12 bg-white px-4 py-3.5 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/25';
const label = 'block text-[11px] font-extrabold uppercase tracking-[0.14em] text-night-900/45 mb-1.5';

const ADDONS = [
  { id: 'airport', label: 'Airport pickup & drop-off', price: 0, note: 'included' },
  { id: 'hotel', label: 'Extra Kathmandu hotel nights', price: 65, note: 'per night' },
  { id: 'gear', label: 'Full gear rental package', price: 90, note: 'per person' },
  { id: 'single', label: 'Private / single room supplement', price: 220, note: 'per person' },
  { id: 'heli', label: 'Helicopter return upgrade', price: 950, note: 'per person' },
];

export default function Booking() {
  const [params] = useSearchParams();
  const { journeys } = useJourneys();
  const { push } = useToast();

  const [slug, setSlug] = useState(params.get('trek') ?? '');
  const [travellers, setTravellers] = useState(2);
  const [date, setDate] = useState('');
  const [addons, setAddons] = useState<string[]>([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const journey = useMemo(() => journeys.find((j) => j.slug === slug), [journeys, slug]);

  useSeo(
    journey ? `Book ${journey.name} | ${SITE.fullName}` : `Book a Journey | ${SITE.fullName}`,
    'Reserve your Himalayan journey — fixed prices, 20% deposit, balance on arrival. No payment taken online.',
  );

  useEffect(() => {
    const q = params.get('trek');
    if (q) setSlug(q);
  }, [params]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleAddon = (id: string) =>
    setAddons((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));

  const base = journey ? journey.price * travellers : 0;
  const addonTotal = addons.reduce((sum, id) => {
    const a = ADDONS.find((x) => x.id === id);
    return sum + (a ? a.price * travellers : 0);
  }, 0);
  const total = base + addonTotal;
  const deposit = Math.round(total * 0.2);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!journey) return push('Please choose a journey first.', 'info');
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      return push('Please add your name and a valid email so we can confirm.', 'info');
    }
    setSending(true);
    const chosen = addons.map((id) => ADDONS.find((a) => a.id === id)?.label).filter(Boolean).join(', ');
    try {
      const emailed = await sendNotification({
        kind: 'Booking request',
        name: form.name.trim(),
        email: form.email.trim(),
        subject: `${journey.name} · ${travellers} traveller${travellers > 1 ? 's' : ''}${date ? ` · ${date}` : ''}`,
        rows: [
          ['Journey', journey.name],
          ['Preferred start date', date || 'Flexible'],
          ['Travellers', String(travellers)],
          ['Add-ons', chosen || 'None'],
          ['Estimated total', formatPrice(total)],
          ['Deposit due (20%)', formatPrice(deposit)],
          ['Phone', form.phone],
          ['Country', form.country],
        ],
        message: form.message,
      });
      await createInquiry({
        type: 'booking',
        trek: journey.name,
        subject: `Booking · ${journey.name}`,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        date,
        travelers: String(travellers),
        message: [chosen && `Add-ons: ${chosen}`, `Estimated total: ${formatPrice(total)} (deposit ${formatPrice(deposit)})`, form.message.trim()]
          .filter(Boolean)
          .join('\n'),
        emailed,
      });
      setDone(true);
      push('Booking request received — we confirm within 24 hours.');
    } catch {
      push('Could not send right now — please WhatsApp us instead.', 'info');
    } finally {
      setSending(false);
    }
  };

  if (done && journey) {
    return (
      <main className="grid min-h-screen place-items-center bg-sand-50 px-5 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg rounded-[2rem] border border-night-900/10 bg-white p-9 text-center shadow-lift"
        >
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="size-8" aria-hidden />
          </span>
          <h1 className="mt-6 font-display text-3xl font-medium tracking-tight text-night-900">Request received</h1>
          <p className="mt-3 leading-relaxed text-night-900/60">
            Thank you, {form.name.split(' ')[0] || 'traveller'}. Your request for <strong className="text-night-900">{journey.name}</strong> is
            with our team — a travel designer replies within 24 hours with availability and a final itinerary.
          </p>
          <div className="mt-6 rounded-2xl bg-sand-100 p-5 text-left text-sm">
            <p className="flex justify-between py-1"><span className="text-night-900/55">Journey</span><span className="font-bold">{journey.name}</span></p>
            <p className="flex justify-between py-1"><span className="text-night-900/55">Travellers</span><span className="font-bold">{travellers}</span></p>
            <p className="flex justify-between py-1"><span className="text-night-900/55">Preferred date</span><span className="font-bold">{date || 'Flexible'}</span></p>
            <p className="mt-2 flex justify-between border-t border-night-900/10 pt-3"><span className="text-night-900/55">Estimated total</span><span className="font-display text-lg font-semibold">{formatPrice(total)}</span></p>
          </div>
          <p className="mt-4 text-xs text-night-900/45">No payment has been taken. Deposit is only requested once you confirm the final itinerary.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/treks" className="rounded-full bg-night-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-ember-600">Browse more journeys</Link>
            <a href={SITE.whatsappHref} target="_blank" rel="noreferrer" className="rounded-full border border-night-900/15 px-6 py-3 text-sm font-bold text-night-900/70 transition hover:border-emerald-500 hover:text-emerald-600">
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main>
      <PageHero
        image={pex(37911658, 1920, 800)}
        overline="Reserve your place"
        title="Book your Himalayan journey"
        sub="Fixed prices, no online payment. Tell us your dates and we confirm availability within 24 hours."
      />

      <section className="container-x grid gap-8 py-14 lg:grid-cols-[1.5fr_1fr] lg:py-20">
        {/* ---- form ---- */}
        <form id="booking-form" onSubmit={submit} className="space-y-6" aria-label="Booking request">
          {/* 1 · journey */}
          <Reveal className="rounded-[1.75rem] border border-night-900/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-night-900">
              <span className="grid size-8 place-items-center rounded-full bg-ember-500 text-sm font-extrabold text-white">1</span>
              Choose your journey
            </h2>
            <div className="mt-5">
              <label className={label} htmlFor="bk-journey">Journey *</label>
              <select id="bk-journey" value={slug} onChange={(e) => setSlug(e.target.value)} className={field} required>
                <option value="">— Select a trek, tour or expedition —</option>
                {journeys.map((j) => (
                  <option key={j.slug} value={j.slug}>
                    {j.name} · {j.duration}d · {formatPrice(j.price)}
                  </option>
                ))}
              </select>
            </div>

            {journey && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex gap-4 rounded-2xl bg-sand-100 p-4">
                <img src={journey.image} alt="" className="size-20 shrink-0 rounded-xl object-cover" loading="lazy" />
                <div className="min-w-0">
                  <p className="font-display text-lg font-medium text-night-900">{journey.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-night-900/55">
                    <span className="inline-flex items-center gap-1"><Clock className="size-3.5 text-ember-500" aria-hidden />{journey.duration} days</span>
                    <span className="inline-flex items-center gap-1"><Mountain className="size-3.5 text-ember-500" aria-hidden />{formatAlt(journey.maxAltitude)}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3.5 text-ember-500" aria-hidden />{journey.destination}</span>
                  </div>
                  <Link to={`/treks/${journey.slug}`} className="mt-2 inline-block text-xs font-extrabold text-ember-600 hover:underline">
                    View full itinerary →
                  </Link>
                </div>
              </motion.div>
            )}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="bk-date"><CalendarDays className="mr-1 inline size-3.5" aria-hidden /> Preferred start date</label>
                <input id="bk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
              </div>
              <div>
                <label className={label} htmlFor="bk-trav"><Users className="mr-1 inline size-3.5" aria-hidden /> Travellers</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setTravellers((t) => Math.max(1, t - 1))} className="grid size-12 shrink-0 place-items-center rounded-xl border border-night-900/12 text-lg font-bold transition hover:border-ember-500 hover:text-ember-600 cursor-pointer" aria-label="Fewer travellers">−</button>
                  <input id="bk-trav" type="number" min={1} max={20} value={travellers} onChange={(e) => setTravellers(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className={`${field} text-center`} />
                  <button type="button" onClick={() => setTravellers((t) => Math.min(20, t + 1))} className="grid size-12 shrink-0 place-items-center rounded-xl border border-night-900/12 text-lg font-bold transition hover:border-ember-500 hover:text-ember-600 cursor-pointer" aria-label="More travellers">+</button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2 · add-ons */}
          <Reveal delay={0.06} className="rounded-[1.75rem] border border-night-900/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-night-900">
              <span className="grid size-8 place-items-center rounded-full bg-ember-500 text-sm font-extrabold text-white">2</span>
              Optional add-ons
            </h2>
            <div className="mt-5 space-y-2.5">
              {ADDONS.map((a) => {
                const on = addons.includes(a.id);
                return (
                  <label
                    key={a.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all',
                      on ? 'border-ember-500 bg-ember-500/5' : 'border-night-900/10 hover:border-night-900/25',
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggleAddon(a.id)} className="size-4.5 accent-ember-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-night-900">{a.label}</span>
                      <span className="text-xs text-night-900/45">{a.price === 0 ? 'Included in every journey' : `${formatPrice(a.price)} ${a.note}`}</span>
                    </span>
                    {a.price > 0 && <span className="text-sm font-extrabold text-night-900">+{formatPrice(a.price * travellers)}</span>}
                  </label>
                );
              })}
            </div>
          </Reveal>

          {/* 3 · details */}
          <Reveal delay={0.12} className="rounded-[1.75rem] border border-night-900/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-night-900">
              <span className="grid size-8 place-items-center rounded-full bg-ember-500 text-sm font-extrabold text-white">3</span>
              Your details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="bk-name">Full name *</label>
                <input id="bk-name" required value={form.name} onChange={set('name')} placeholder="As on your passport" className={field} />
              </div>
              <div>
                <label className={label} htmlFor="bk-email">Email *</label>
                <input id="bk-email" required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" className={field} />
              </div>
              <div>
                <label className={label} htmlFor="bk-phone">Phone / WhatsApp</label>
                <input id="bk-phone" value={form.phone} onChange={set('phone')} placeholder="+1 555 000 0000" className={field} />
              </div>
              <div>
                <label className={label} htmlFor="bk-country">Country</label>
                <input id="bk-country" value={form.country} onChange={set('country')} placeholder="United Kingdom" className={field} />
              </div>
            </div>
            <div className="mt-4">
              <label className={label} htmlFor="bk-msg">Anything we should know?</label>
              <textarea id="bk-msg" rows={4} value={form.message} onChange={set('message')} placeholder="Fitness level, dietary needs, celebrating something special, questions about dates…" className={`${field} resize-none`} />
            </div>
          </Reveal>

          <button
            type="submit"
            disabled={sending}
            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-ember-500 py-4.5 text-[15px] font-extrabold text-white shadow-[0_14px_34px_-12px_rgba(242,105,46,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-600 disabled:opacity-70 lg:hidden cursor-pointer"
          >
            {sending ? <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden /> : <><Send className="size-4.5" aria-hidden /> Request this booking</>}
          </button>

          {/* ---- summary (desktop sticky lives in aside, this is the mobile inline copy) ---- */}
        </form>

        {/* ---- price summary ---- */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal className="rounded-[1.75rem] border border-night-900/10 bg-white p-6 shadow-lift sm:p-7">
            <h2 className="font-display text-xl font-semibold text-night-900">Price summary</h2>
            {journey ? (
              <>
                <dl className="mt-5 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-900/55">{journey.name}</dt>
                    <dd className="shrink-0 font-bold text-night-900">{formatPrice(journey.price)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-night-900/55">× {travellers} traveller{travellers > 1 ? 's' : ''}</dt>
                    <dd className="shrink-0 font-bold text-night-900">{formatPrice(base)}</dd>
                  </div>
                  {addons.map((id) => {
                    const a = ADDONS.find((x) => x.id === id);
                    if (!a || a.price === 0) return null;
                    return (
                      <div key={id} className="flex justify-between gap-3">
                        <dt className="truncate text-night-900/55">{a.label}</dt>
                        <dd className="shrink-0 font-bold text-night-900">+{formatPrice(a.price * travellers)}</dd>
                      </div>
                    );
                  })}
                  <div className="mt-3 flex items-baseline justify-between border-t border-night-900/10 pt-4">
                    <dt className="text-sm font-bold text-night-900">Estimated total</dt>
                    <dd className="font-display text-3xl font-semibold text-night-900">{formatPrice(total)}</dd>
                  </div>
                  <div className="flex justify-between rounded-xl bg-ember-500/8 px-4 py-3">
                    <dt className="text-xs font-bold text-ember-700">Deposit to confirm (20%)</dt>
                    <dd className="text-sm font-extrabold text-ember-700">{formatPrice(deposit)}</dd>
                  </div>
                </dl>

                <div className="mt-5 space-y-2 border-t border-night-900/8 pt-4">
                  {[
                    { icon: BadgeCheck, t: 'Fixed-price guarantee — the quote you accept is what you pay.' },
                    { icon: ShieldCheck, t: 'No payment online. Deposit only after you confirm the itinerary.' },
                    { icon: Clock, t: 'Free date changes up to 45 days before departure.' },
                  ].map((r, i) => (
                    <p key={i} className="flex items-start gap-2.5 text-[12px] font-semibold leading-snug text-night-900/60">
                      <r.icon className="mt-0.5 size-3.5 shrink-0 text-emerald-600" aria-hidden />
                      {r.t}
                    </p>
                  ))}
                </div>

                <button
                  type="submit"
                  form="booking-form"
                  disabled={sending}
                  className="group relative mt-6 hidden w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-ember-500 py-4 text-sm font-extrabold text-white shadow-[0_14px_30px_-12px_rgba(242,105,46,0.6)] transition-all duration-300 hover:bg-ember-600 disabled:opacity-70 lg:flex cursor-pointer"
                >
                  {sending ? <span className="size-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden /> : <><Send className="size-4" aria-hidden /> Request this booking</>}
                </button>
              </>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-night-900/15 px-4 py-8 text-center text-sm text-night-900/45">
                Select a journey to see your live price breakdown.
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-night-900/8 pt-5">
              <a href={SITE.whatsappHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-600/25 bg-emerald-50 py-2.5 text-xs font-extrabold text-emerald-700 transition hover:bg-emerald-100">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp
              </a>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-xl border border-night-900/12 py-2.5 text-xs font-extrabold text-night-900/70 transition hover:border-ember-500 hover:text-ember-600">
                <Phone className="size-4" aria-hidden /> Call us
              </a>
            </div>
            <a href={`mailto:${SITE.email}`} className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-night-900/12 py-2.5 text-xs font-extrabold text-night-900/70 transition hover:border-ember-500 hover:text-ember-600">
              <Mail className="size-4" aria-hidden /> {SITE.email}
            </a>
          </Reveal>
        </aside>
      </section>
    </main>
  );
}
