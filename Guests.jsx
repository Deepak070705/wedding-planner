import { useState } from 'react';
import { api } from '../api';
import { chkName } from '../validate';

export default function Guests({ data, run, toast }) {
  const [name, setName] = useState('');

  async function add() {
    const err = chkName(name, 'guest name');
    if (err) return toast(err);
    if (data.guests.some(g => g.name.toLowerCase() === name.trim().toLowerCase()))
      return toast('This guest is already in the list');
    if (await run(() => api.post('/guests', { name: name.trim(), rsvp: 'Pending' }))) setName('');
  }
  const cls = r => (r === 'Yes' ? 'yes' : r === 'No' ? 'no' : '');

  return (
    <>
      <h2>Guests and RSVP</h2>
      <div className="row">
        <div><label htmlFor="gn">Guest name</label>
          <input id="gn" maxLength="40" value={name} onChange={e => setName(e.target.value)} /></div>
        <div><button className="btn" onClick={add}>Add guest</button></div>
      </div>
      {data.guests.length ? (
        <>
          <ul className="list">
            {data.guests.map(g => (
              <li key={g._id}>
                <span>{g.name} <span className={'tag ' + cls(g.rsvp)}>{g.rsvp}</span></span>
                <span>
                  <button className="btn alt sm" onClick={() => run(() => api.patch('/guests/' + g._id, { rsvp: 'Yes' }))}>Yes</button>{' '}
                  <button className="btn alt sm" onClick={() => run(() => api.patch('/guests/' + g._id, { rsvp: 'No' }))}>No</button>{' '}
                  <button className="btn alt sm" onClick={() => run(() => api.del('/guests/' + g._id))}>Remove</button>
                </span>
              </li>
            ))}
          </ul>
          <p className="empty">Use Yes or No to record each guest's RSVP reply.</p>
        </>
      ) : <p className="empty">No guests yet. Add your first guest above.</p>}
    </>
  );
}
