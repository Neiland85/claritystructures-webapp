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
  }

  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10">
      <section className="mb-8 rounded-xl border border-slate-300 bg-slate-50 p-6">
        <h1 className="text-3xl font-bold text-slate-900">Deterministic technical intake for legal-risk incidents</h1>
        <p className="mt-3 text-slate-700">
          We collect structured incident facts and run a fixed, auditable decision workflow for operational triage. This intake does not create an attorney-client relationship and does not provide legal advice.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          If there is imminent physical danger, contact emergency services immediately.
        </p>
      </section>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Brief description of conflict</span>
          <textarea name="conflictDescription" required className="w-full rounded border border-slate-300 p-2" rows={4} />
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
          <select name="isIncidentOngoing" required className="w-full rounded border border-slate-300 p-2">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Has access to devices?</span>
          <select name="hasAccessToDevices" required className="w-full rounded border border-slate-300 p-2">
            <option value="yes">yes</option>
            <option value="no">no</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Estimated incident start</span>
          <select name="estimatedIncidentStart" required className="w-full rounded border border-slate-300 p-2">
            <option value="unknown">unknown</option>
            <option value="recent">recent</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Contact email</span>
          <input type="email" name="contactEmail" required className="w-full rounded border border-slate-300 p-2" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Contact phone</span>
          <input type="tel" name="contactPhone" required className="w-full rounded border border-slate-300 p-2" />
        </label>

        <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Privacy notice: your intake data is processed for technical triage and internal review only. This form is not legal advice and does not create attorney-client representation.
        </div>

        <button
          type="submit"
          className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          disabled={submitState === 'loading'}
        >
          {submitState === 'loading' ? 'Submitting...' : 'Submit'}
        </button>

        {submitState === 'success' ? (
          <p className="text-sm text-emerald-700">Submission received. A reviewer will follow up if appropriate.</p>
        ) : null}

        {submitState === 'error' ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
      </form>
export const metadata = {
  title: 'Incident Intake',
};

export default function IntakePage() {
  return (
    <main>
      <style>{`
        :root {
          color-scheme: light;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #f7f8fc;
          color: #121826;
        }

        .intake-wrapper {
          max-width: 760px;
          margin: 2.5rem auto;
          padding: 0 1rem 2rem;
        }

        .intake-card {
          background: #ffffff;
          border: 1px solid #dbe1ea;
          border-radius: 12px;
          box-shadow: 0 8px 28px rgba(19, 39, 70, 0.06);
          padding: 1.5rem;
        }

        h1 {
          margin-top: 0;
          margin-bottom: 0.6rem;
          font-size: 1.8rem;
        }

        .subtitle {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #4d5a6f;
          line-height: 1.5;
        }

        .disclaimer {
          background: #fff7e5;
          border: 1px solid #f5d178;
          color: #664a00;
          border-radius: 10px;
          padding: 0.75rem;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }

        form {
          display: grid;
          gap: 1rem;
        }

        label,
        legend {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        input,
        textarea,
        select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #bcc7d6;
          border-radius: 8px;
          padding: 0.65rem 0.75rem;
          font: inherit;
          background: #fff;
        }

        textarea {
          min-height: 130px;
          resize: vertical;
        }

        fieldset {
          border: 1px solid #dde4ef;
          border-radius: 8px;
          padding: 0.7rem 0.8rem;
          margin: 0;
        }

        .radio-options {
          display: flex;
          gap: 1.25rem;
        }

        .radio-options label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0;
          font-weight: 500;
        }

        .radio-options input {
          width: auto;
          margin: 0;
        }

        .split {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
        }

        .helper,
        .status {
          margin: 0;
          font-size: 0.92rem;
        }

        .helper {
          color: #4d5a6f;
        }

        .status {
          min-height: 1.2rem;
          font-weight: 600;
        }

        .status.error {
          color: #b42318;
        }

        .status.success {
          color: #067647;
        }

        button {
          appearance: none;
          border: none;
          border-radius: 8px;
          background: #2459d8;
          color: #fff;
          padding: 0.75rem 1rem;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.7;
          cursor: wait;
        }
      `}</style>

      <div className="intake-wrapper">
        <section className="intake-card">
          <h1>Incident Intake</h1>
          <p className="subtitle">
            Share a concise overview so we can triage quickly and direct your request to the right
            team.
          </p>

          <p className="disclaimer">
            Disclaimer: Information on this page is for intake and coordination only. It is not
            legal advice.
          </p>

          <form id="intake-form" noValidate>
            <div>
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" required />
            </div>

            <div className="split">
              <div>
                <label htmlFor="urgency">Urgency *</label>
                <select id="urgency" name="urgency" required>
                  <option value="">Select urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="incidentStart">Estimated incident start *</label>
                <select id="incidentStart" name="incidentStart" required>
                  <option value="">Select start time</option>
                  <option value="within_24h">Within 24 hours</option>
                  <option value="within_week">Within a week</option>
                  <option value="within_month">Within a month</option>
                  <option value="over_month">Over a month ago</option>
                  <option value="unknown">Not sure</option>
                </select>
              </div>
            </div>

            <fieldset>
              <legend>Is incident ongoing? *</legend>
              <div className="radio-options">
                <label>
                  <input type="radio" name="incidentOngoing" value="yes" required /> Yes
                </label>
                <label>
                  <input type="radio" name="incidentOngoing" value="no" required /> No
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Has access to devices? *</legend>
              <div className="radio-options">
                <label>
                  <input type="radio" name="hasDeviceAccess" value="yes" required /> Yes
                </label>
                <label>
                  <input type="radio" name="hasDeviceAccess" value="no" required /> No
                </label>
              </div>
            </fieldset>

            <div className="split">
              <div>
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div>
                <label htmlFor="phone">Phone *</label>
                <input id="phone" name="phone" type="text" required />
              </div>
            </div>

            <p className="helper">Fields marked with * are required.</p>
            <p id="status" className="status" aria-live="polite"></p>

            <button id="submit-btn" type="submit">Submit intake</button>
          </form>
        </section>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function () {
              const form = document.getElementById('intake-form');
              const statusEl = document.getElementById('status');
              const submitBtn = document.getElementById('submit-btn');

              if (!form || !statusEl || !submitBtn) {
                return;
              }

              function setStatus(message, type) {
                statusEl.textContent = message;
                statusEl.className = 'status ' + (type || '');
              }

              form.addEventListener('submit', async function (event) {
                event.preventDefault();

                if (!form.reportValidity()) {
                  setStatus('Please complete all required fields.', 'error');
                  return;
                }

                const data = {
                  description: form.description.value.trim(),
                  urgency: form.urgency.value,
                  incidentOngoing: form.incidentOngoing.value,
                  hasDeviceAccess: form.hasDeviceAccess.value,
                  incidentStart: form.incidentStart.value,
                  email: form.email.value.trim(),
                  phone: form.phone.value.trim(),
                };

                submitBtn.disabled = true;
                setStatus('Submitting intake...', '');

                try {
                  const response = await fetch('/api/intake/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });

                  if (!response.ok) {
                    throw new Error('Unable to submit intake');
                  }

                  form.reset();
                  setStatus('Intake submitted successfully. We will follow up shortly.', 'success');
                } catch (error) {
                  setStatus('Submission failed. Please try again in a moment.', 'error');
                } finally {
                  submitBtn.disabled = false;
                }
              });
            })();
          `,
        }}
      />
    </main>
  );
}
