import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { createInquiry } from '../lib/db';
import { sendNotification } from '../lib/notify';
import { useToast } from './ui';

const inputCls =
  'w-full rounded-xl border border-night-900/12 bg-white px-4 py-3 text-sm text-night-900 placeholder:text-night-900/35 transition focus:border-ember-500 focus:outline-none focus:ring-2 focus:ring-ember-500/25';

/**
 * Journey inquiry form. No payments are taken — submissions are enquiries
 * answered by a human travel designer (backend endpoint can be wired later).
 */
export function InquiryForm({ trekName, compact = false }: { trekName?: string; compact?: boolean }) {
  const { push } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', country: '', date: '', travelers: '2', message: '' });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      push('Please add your name and a valid email so we can reply.', 'info');
      return;
    }
    setSending(true);
    try {
      const emailed = await sendNotification({
        kind: 'Journey inquiry',
        name: form.name.trim(),
        email: form.email.trim(),
        subject: trekName ?? 'General journey inquiry',
        rows: [
          ['Journey', trekName ?? '—'],
          ['Country', form.country],
          ['Preferred date', form.date || 'Flexible'],
          ['Travellers', form.travelers],
        ],
        message: form.message,
      });
      await createInquiry({
        type: 'journey',
        trek: trekName,
        name: form.name.trim(),
        email: form.email.trim(),
        country: form.country.trim(),
        date: form.date,
        travelers: form.travelers,
        message: form.message.trim(),
        emailed,
      });
      setForm({ name: '', email: '', country: '', date: '', travelers: '2', message: '' });
      push(trekName ? `Request received for ${trekName} — we reply within 24 hours.` : 'Request received — we reply within 24 hours.');
    } catch {
      push('Could not send right now — please try WhatsApp instead.', 'info');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3" aria-label={trekName ? `Request ${trekName}` : 'Travel inquiry'}>
      <div className={compact ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2'}>
        <input required value={form.name} onChange={set('name')} placeholder="Full name *" aria-label="Full name" className={inputCls} />
        <input required type="email" value={form.email} onChange={set('email')} placeholder="Email address *" aria-label="Email address" className={inputCls} />
        {compact && <input value={form.country} onChange={set('country')} placeholder="Country" aria-label="Country" className={inputCls} />}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="sr-only" htmlFor={compact ? 'inq-date-c' : 'inq-date'}>Preferred travel date</label>
          <input id={compact ? 'inq-date-c' : 'inq-date'} type="date" value={form.date} onChange={set('date')} className={`${inputCls} text-night-900/60`} />
        </div>
        <div>
          <label className="sr-only" htmlFor={compact ? 'inq-trav-c' : 'inq-trav'}>Number of travellers</label>
          <select id={compact ? 'inq-trav-c' : 'inq-trav'} value={form.travelers} onChange={set('travelers')} className={`${inputCls} text-night-900/60`}>
            {[1, 2, 3, 4, 5, 6, '7+'].map((n) => (
              <option key={n} value={n}>{n} traveller{n === 1 ? '' : 's'}</option>
            ))}
          </select>
        </div>
      </div>
      <textarea
        value={form.message}
        onChange={set('message')}
        rows={compact ? 3 : 4}
        placeholder={trekName ? `Questions about ${trekName} — fitness, dates, custom add-ons…` : 'Tell us about your dream trip…'}
        aria-label="Message"
        className={`${inputCls} resize-none`}
      />
      <button
        type="submit"
        disabled={sending}
        className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-ember-500 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-ember-600 hover:shadow-[0_14px_30px_-10px_rgba(242,105,46,0.6)] disabled:opacity-70 cursor-pointer"
      >
        <span className="relative z-10 flex items-center gap-2">
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
              Sending your request…
            </>
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              {trekName ? 'Request This Journey' : 'Send Inquiry'}
            </>
          )}
        </span>
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" aria-hidden />
      </button>
      <p className="text-center text-[11px] leading-relaxed text-night-900/40">
        No payment taken now. A human travel designer replies within 24 hours — usually much faster.
      </p>
    </form>
  );
}
