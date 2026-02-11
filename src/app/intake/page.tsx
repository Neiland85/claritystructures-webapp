'use client';

import { useState, type FormEvent } from 'react';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function IntakePage() {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('loading');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);

    const payload = {
      conflictDescription: String(formData.get('conflictDescription') ?? ''),
      urgency: String(formData.get('urgency') ?? ''),
      isIncidentOngoing: String(formData.get('isIncidentOngoing') ?? ''),
      hasAccessToDevices: String(formData.get('hasAccessToDevices') ?? ''),
      estimatedIncidentStart: String(formData.get('estimatedIncidentStart') ?? ''),
      contactEmail: String(formData.get('contactEmail') ?? ''),
      contactPhone: String(formData.get('contactPhone') ?? ''),
    };

    try {
      const response = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitState('success');
        event.currentTarget.reset();
        return;
      }

      setSubmitState('error');
      setErrorMessage('Unable to submit your intake. Please try again shortly.');
    } catch (error) {
      console.error('Failed to submit intake form:', error);
      setSubmitState('error');
      setErrorMessage('Unable to submit your intake due to a network error. Please check your connection and try again.');
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <section className="mb-8 rounded-xl border border-slate-300 bg-slate-50 p-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Deterministic technical intake for legal-risk incidents
        </h1>
        <p className="mt-3 text-slate-700">
          We collect structured incident facts and run a fixed, auditable decision workflow for
          operational triage. This intake does not create an attorney-client relationship and does
          not provide legal advice.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          If there is imminent physical danger, contact emergency services immediately.
        </p>
      </section>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Brief description of conflict</span>
          <textarea
            name="conflictDescription"
            required
            className="w-full rounded border border-slate-300 p-2"
            rows={4}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Urgency</span>
          <select name="urgency" required className="w-full rounded border border-slate-300 p-2">
            <option value="informational">informational</option>
            <option value="time_sensitive">time sensitive</option>
            <option value="legal_risk">legal risk</option>
            <option value="critical">critical</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Is incident ongoing?</span>
          <select
            name="isIncidentOngoing"
            required
            className="w-full rounded border border-slate-300 p-2"
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Has access to devices?</span>
          <select
            name="hasAccessToDevices"
            required
            className="w-full rounded border border-slate-300 p-2"
          >
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Estimated incident start</span>
          <select
            name="estimatedIncidentStart"
            required
            className="w-full rounded border border-slate-300 p-2"
          >
            <option value="unknown">unknown</option>
            <option value="recent">recent</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Contact email</span>
          <input
            type="email"
            name="contactEmail"
            required
            className="w-full rounded border border-slate-300 p-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Contact phone</span>
          <input
            type="tel"
            name="contactPhone"
            required
            className="w-full rounded border border-slate-300 p-2"
          />
        </label>

        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Privacy notice: your intake data is processed for technical triage and internal review
          only. This form is not legal advice and does not create attorney-client representation.
        </div>

        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={submitState === 'loading'}
        >
          {submitState === 'loading' ? 'Submitting...' : 'Submit'}
        </button>

        {submitState === 'success' ? (
          <p className="text-sm text-emerald-700">
            Submission received. A reviewer will follow up if appropriate.
          </p>
        ) : null}

        {submitState === 'error' ? (
          <p className="text-sm text-red-700">{errorMessage}</p>
        ) : null}
      </form>
    </main>
  );
}
