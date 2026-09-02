import { SITE, WEB3FORMS_KEY, emailDeliveryReady } from './site';

export interface NotifyPayload {
  kind: 'Booking request' | 'Journey inquiry' | 'Contact message';
  name: string;
  email: string;
  subject: string;
  /** Ordered label→value rows rendered into the email body. */
  rows: [string, string][];
  message?: string;
}

function buildBody(p: NotifyPayload): string {
  const lines = p.rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return [
    `New ${p.kind.toLowerCase()} from the ${SITE.fullName} website`,
    '',
    ...lines,
    '',
    'Message:',
    p.message?.trim() || '(none provided)',
    '',
    `Received: ${new Date().toLocaleString()}`,
  ].join('\n');
}

/**
 * Sends the submission to the admin email address.
 *
 * Uses Web3Forms (free, no backend) when VITE_WEB3FORMS_KEY is configured.
 * Returns true when the email was accepted for delivery.
 */
export async function sendNotification(p: NotifyPayload): Promise<boolean> {
  if (!emailDeliveryReady) return false;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `[${p.kind}] ${p.subject}`,
        from_name: `${SITE.fullName} website`,
        name: p.name,
        email: p.email,
        replyto: p.email,
        to: SITE.notifyEmail,
        message: buildBody(p),
      }),
    });
    const json = (await res.json()) as { success?: boolean };
    return res.ok && json.success !== false;
  } catch (e) {
    console.error('Email notification failed', e);
    return false;
  }
}

/** Fallback / manual route: opens the admin's mail client pre-filled. */
export function mailtoLink(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
