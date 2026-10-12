import { useState } from 'react';
import Icon from './Icon.jsx';

export default function ContactForm({ email }) {
  const [opened, setOpened] = useState(false);
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = String(data.get('subject') || 'Hola, Clara i Punt!');
    const body = `Hola!\n\n${data.get('message')}\n\n${data.get('name')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="contact-name">Com et dius?</label>
        <input
          id="contact-name"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          placeholder="El teu nom"
        />
      </div>
      <div className="field">
        <label htmlFor="contact-subject">De què parlem?</label>
        <input
          id="contact-subject"
          name="subject"
          required
          maxLength={150}
          placeholder="Una peça, una pregunta, una idea…"
        />
      </div>
      <div className="field">
        <label htmlFor="contact-message">T’escoltem.</label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={3000}
          rows={5}
          placeholder="Explica’ns què tens al cap."
        />
      </div>
      <p>
        Obrirem la teva aplicació de correu amb el missatge preparat. El podràs revisar abans
        d’enviar-lo.
      </p>
      <button className="button" type="submit">
        Prepara el correu <Icon name="arrow" size={18} />
      </button>
      {opened ? (
        <p role="status">
          Si no s’ha obert el correu, escriu directament a{' '}
          <a className="text-link" href={`mailto:${email}`}>
            {email}
          </a>
          . El missatge encara no s’ha enviat.
        </p>
      ) : null}
    </form>
  );
}
