import { useState, type FormEvent } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { createInquiry } from '../lib/db';
import { sendNotification } from '../lib/notify';
import { useSeo } from '../lib/hooks';
import { SITE } from '../lib/site';
import { PageHero, Reveal, SectionHeading, useToast } from '../components/ui';
import { pex } from '../lib/utils';

const METHODS = [
  {
    icon: Phone,
    title: 'Call us',
    lines: [SITE.phoneDisplay, SITE.officeHours],
    href: SITE.phoneHref,
    cta: 'Call now',
    tone: 'bg-night-950 text-ember-300',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    lines: [SITE.whatsappDisplay, 'Replies within ~2 hours'],
    href: SITE.whatsappHref,
    cta: 'Chat on WhatsApp',
    tone: 'bg-emerald-600 text-emerald-50',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: [SITE.email, 'Itinerary sketches in 24h'],
    href: `mailto:${SITE.email}`,
    cta: 'Write an email',
    tone: 'bg-ember-500 text-white',
  },
];

const inputCls =
  'w-full rounded-xl border border-night-900/12 bg-white px-4 py-3.5 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/25';

export default function Contact() {
  useSeo('Contact — Plan Your Himalayan Journey | Ascent Himalaya', 'Talk to a real Himalayan travel designer. Phone, WhatsApp and email — replies within 24 hours, usually much faster.');
  const { push } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Custom journey', message: '' });
  const set = (k: keyof typeof form) => (e: any) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      push('Please add your name and a valid email so we can reply.', 'info');
      return;
    }
    setSending(true);
    try {
      const emailed = await sendNotification({
        kind: 'Contact message',
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject,
        rows: [['Topic', form.subject]],
        message: form.message,
      });
      await createInquiry({
        type: 'contact',
        subject: form.subject,
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        emailed,
      });
      setForm({ name: '', email: '', subject: 'Custom journey', message: '' });
      push('Message sent — a travel designer will reply within 24 hours.');
    } catch {
      push('Could not send right now — please email us directly.', 'info');
    } finally {
      setSending(false);
    }
  };

  return (
    <main>
      <PageHero
        image={pex(36564641, 1920, 800)}
        overline="Talk to a human"
        title="Let's start your journey"
        sub="No call centres, no bots. Your message lands with the same Kathmandu team that will brief your guide."
      />

      {/* Contact methods */}
      <section className="container-x relative z-10 -mt-10 grid gap-4 md:grid-cols-3" aria-label="Contact methods">
        {METHODS.map((m) => (
          <Reveal key={m.title} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-night-900/8 bg-white p-6 shadow-lift">
              <span className={`grid size-12 place-items-center rounded-2xl ${m.tone}`}>
                <m.icon className="size-6" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-night-900">{m.title}</h2>
              <p className="mt-1 text-sm font-bold text-night-900">{m.lines[0]}</p>
              <p className="text-xs font-medium text-night-900/45">{m.lines[1]}</p>
              <a
                href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel={m.href.startsWith('http') ? 'noreferrer' : undefined}
                className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-extrabold text-ember-600 transition hover:gap-2.5 hover:text-ember-700"
              >
                {m.cta} →
              </a>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Form + office */}
      <section className="container-x grid gap-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:py-20">
        <Reveal>
          <div className="rounded-[2rem] border border-night-900/10 bg-white p-7 shadow-card sm:p-10">
            <SectionHeading overline="Send a message" title="Tell us what you're dreaming of" />
            <form onSubmit={submit} className="mt-8 space-y-4" aria-label="Contact form">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required value={form.name} onChange={set('name')} placeholder="Full name *" aria-label="Full name" className={inputCls} />
                <input required type="email" value={form.email} onChange={set('email')} placeholder="Email address *" aria-label="Email address" className={inputCls} />
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <select id="subject" value={form.subject} onChange={set('subject')} className={inputCls}>
                  {['Custom journey', 'Everest Base Camp', 'Annapurna region', 'Bhutan & beyond', 'Climbing & expeditions', 'Something else'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <textarea
                required
                value={form.message}
                onChange={set('message')}
                rows={6}
                placeholder="When are you thinking of travelling? What's your trekking experience? What would make this trip perfect? *"
                aria-label="Your message"
                className={`${inputCls} resize-none`}
              />
              <button
                type="submit"
                disabled={sending}
                className="group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ember-500 px-8 py-4 text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(242,105,46,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-600 disabled:opacity-70 cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {sending ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" aria-hidden />
                      Send message
                    </>
                  )}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" aria-hidden />
              </button>
            </form>
          </div>
        </Reveal>

        {/* Office + map */}
        <div className="space-y-5">
          <Reveal delay={0.1}>
            <div className="rounded-[2rem] bg-night-950 p-7 text-white sm:p-8">
              <h2 className="font-display text-xl font-semibold">The Thamel office</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4.5 shrink-0 text-ember-400" aria-hidden />
                  <dd className="text-white/75">Tridevi Marg, Thamel<br />Kathmandu 44600, Nepal</dd>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-4.5 shrink-0 text-ember-400" aria-hidden />
                  <dd className="text-white/75">Sunday–Friday · 9:00–18:00 NPT<br /><span className="text-white/45">24/7 emergency line for travellers on trip</span></dd>
                </div>
                <div className="flex gap-3">
                  <Mail className="mt-0.5 size-4.5 shrink-0 text-ember-400" aria-hidden />
                  <dd><a href={`mailto:${SITE.email}`} className="text-white/75 transition hover:text-ember-300">{SITE.email}</a></dd>
                </div>
              </dl>
              <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/40">
                Registered with the Nepal Tourism Board (#1142) · TAAN member · Nepal Mountaineering Association affiliate.
              </p>
            </div>
          </Reveal>

          {/* Map block (live-embed ready) */}
          <Reveal delay={0.18}>
            <div className="relative overflow-hidden rounded-[2rem] border border-night-900/10 bg-night-900">
              <svg viewBox="0 0 480 300" className="h-56 w-full" role="img" aria-label="Stylised map of Thamel, Kathmandu">
                <rect width="480" height="300" fill="#101a22" />
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={'h' + i} x1="0" y1={i * 38} x2="480" y2={i * 38} stroke="rgba(255,255,255,0.05)" />
                ))}
                {Array.from({ length: 13 }, (_, i) => (
                  <line key={'v' + i} x1={i * 40} y1="0" x2={i * 40} y2="300" stroke="rgba(255,255,255,0.05)" />
                ))}
                <path d="M40 220 C 120 200, 150 120, 240 120 S 400 90, 460 40" stroke="#5296a3" strokeWidth="3" fill="none" opacity="0.5" strokeDasharray="1 8" strokeLinecap="round" />
                <path d="M0 150 C 90 140, 140 160, 200 150" stroke="rgba(255,255,255,0.14)" strokeWidth="5" fill="none" />
                <path d="M260 300 C 250 220, 300 190, 330 150" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                <circle cx="240" cy="120" r="26" fill="rgba(242,105,46,0.18)">
                  <animate attributeName="r" values="18;30;18" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="240" cy="120" r="7" fill="#f2692e" />
                <circle cx="240" cy="120" r="2.6" fill="#fff" />
                <text x="258" y="116" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.85)">{SITE.fullName}</text>
                <text x="258" y="132" fontSize="10" fill="rgba(255,255,255,0.45)">{SITE.addressLine1}</text>
              </svg>
              <a
                href="https://maps.google.com/?q=Thamel,Kathmandu,Nepal"
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-night-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-ember-500 hover:text-white"
              >
                Open in Google Maps →
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
