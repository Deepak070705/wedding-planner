import { useState } from 'react';
import { api } from '../api';
import { chkText } from '../validate';

export default function Vendors({ vendors, data, run, toast, goHome }) {
  const [v, setV] = useState(null);   // vendor selected for quotation
  const [msg, setMsg] = useState('');

  async function send() {
    if (!data.events[0]) { setV(null); toast('Create an event first'); return goHome(); }
    const err = chkText(msg, 'message', 5, 150);
    if (err) return toast(err);
    if (data.quotes.some(q => q.vendor === v.name)) return toast('You already sent a request to this vendor');
    if (await run(() => api.post('/quotes', { vendor: v.name, message: msg.trim(), status: 'Sent' }))) {
      setV(null); setMsg(''); toast('Quotation request sent');
    }
  }

  return (
    <>
      <h2>Vendor directory</h2>
      <div className="grid">
        {vendors.map(x => (
          <div className="card" key={x.name}>
            <span className="tag">{x.category}</span>
            <h3 style={{ marginTop: '.5rem' }}>{x.name}</h3>
            <p className="empty">{x.price}</p>
            <button className="btn gold sm" onClick={() => { setV(x); setMsg(''); }}>Request quotation</button>
          </div>
        ))}
      </div>
      {!vendors.length && <p className="empty">Vendors could not be loaded. Check that the backend is running.</p>}

      {v && (
        <div className="overlay" onClick={() => setV(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
            <h3>Request quotation: {v.name}</h3>
            <label htmlFor="qn">Your message</label>
            <input id="qn" maxLength="150" autoFocus placeholder="e.g. Need 200 guests on 20 Feb"
              value={msg} onChange={e => setMsg(e.target.value)} />
            <div className="actions">
              <button className="btn alt" onClick={() => setV(null)}>Cancel</button>
              <button className="btn" onClick={send}>Send request</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
