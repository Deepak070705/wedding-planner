import { useState, useEffect } from 'react';
import { api } from '../api';
import { rs, today, chkText, chkDate, chkNum } from '../validate';

function Countdown({ date }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(date + 'T00:00:00') - now;
  if (ms < 0) return <p>The event date has passed. Congratulations!</p>;
  const units = [['Days', Math.floor(ms / 864e5)], ['Hours', Math.floor(ms / 36e5) % 24],
                 ['Min', Math.floor(ms / 6e4) % 60], ['Sec', Math.floor(ms / 1e3) % 60]];
  return <div className="units">{units.map(([l, v]) => <div key={l}><b>{v}</b>{l}</div>)}</div>;
}

export default function Dashboard({ data, run, toast }) {
  const e = data.events[0];
  const [f, setF] = useState({ name: '', type: 'Wedding', date: '', location: '', budget: '' });
  const set = k => ev => setF({ ...f, [k]: ev.target.value });

  function create() {
    const err = chkText(f.name, 'event name', 3, 60) || chkDate(f.date, 'event date', 1) ||
      chkText(f.location, 'location', 2, 50) || chkNum(f.budget, 'total budget', 1000, 100000000);
    if (err) return toast(err);
    run(() => api.post('/events', { ...f, name: f.name.trim(), location: f.location.trim(), budget: Number(f.budget) }));
  }

  if (!e) return (
    <>
      <h2>Create your event</h2>
      <div className="card">
        <div className="row">
          <div><label htmlFor="en">Event name</label>
            <input id="en" maxLength="60" placeholder="Riya and Aman Wedding" value={f.name} onChange={set('name')} /></div>
          <div><label htmlFor="et">Event type</label>
            <select id="et" value={f.type} onChange={set('type')}>
              {['Wedding', 'Engagement', 'Birthday', 'Corporate'].map(t => <option key={t}>{t}</option>)}
            </select></div>
        </div>
        <div className="row">
          <div><label htmlFor="ed">Date</label>
            <input id="ed" type="date" min={today()} value={f.date} onChange={set('date')} /></div>
          <div><label htmlFor="el">Location</label>
            <input id="el" maxLength="50" placeholder="Jaipur" value={f.location} onChange={set('location')} /></div>
          <div><label htmlFor="eb">Total budget (Rs)</label>
            <input id="eb" type="number" min="0" value={f.budget} onChange={set('budget')} /></div>
        </div>
        <button className="btn" onClick={create}>Create event</button>
      </div>
    </>
  );

  const paid = data.expenses.reduce((a, x) => a + Number(x.paid), 0);
  const done = data.tasks.filter(t => t.done).length;
  const yes = data.guests.filter(g => g.rsvp === 'Yes').length;

  return (
    <>
      <div className="count">
        <h2>{e.name}</h2>
        <div>{e.type}{e.location && ' in ' + e.location}{e.date && ' on ' + e.date}</div>
        {e.date && <Countdown date={e.date} />}
      </div>
      <div className="grid">
        <div className="card"><div className="stat">{rs(e.budget - paid)}</div>Budget left of {rs(e.budget)}</div>
        <div className="card"><div className="stat">{done}/{data.tasks.length}</div>Tasks done</div>
        <div className="card"><div className="stat">{yes}/{data.guests.length}</div>Guests confirmed</div>
        <div className="card"><div className="stat">{data.quotes.length}</div>Quotation requests</div>
      </div>
      <h3 style={{ marginTop: '1.5rem' }}>Vendor requests</h3>
      {data.quotes.length ? (
        <ul className="list">
          {data.quotes.map(q => (
            <li key={q._id}>
              <span>{q.vendor}<br /><small className="empty">{q.message}</small></span>
              <span className="tag">{q.status}</span>
            </li>
          ))}
        </ul>
      ) : <p className="empty">No requests yet. Open Vendors and request a quotation.</p>}
      <p><button className="btn alt sm" onClick={() => confirm('Delete this event and all its data?') && run(() => api.del('/reset'))}>
        Delete event and start again</button></p>
    </>
  );
}
