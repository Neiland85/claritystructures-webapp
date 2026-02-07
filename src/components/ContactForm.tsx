'use client';

import { Lang } from '@/types/lang';

export interface ContactFormProps {
  lang: Lang;
  context?: string;
}

export default function ContactForm({ lang, context }: ContactFormProps) {
  return (
    <form>
      <input placeholder={lang === 'es' ? 'Correo electrónico' : 'Email'} />
      <textarea placeholder={lang === 'es' ? 'Mensaje' : 'Message'} />
      <button type="submit">
        {lang === 'es' ? 'Enviar' : 'Send'}
      </button>
    </form>
  );
}
