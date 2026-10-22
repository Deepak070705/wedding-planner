import { useState } from 'react';
import { api } from '../api';
import { today, chkText, chkDate } from '../validate';

export default function Tasks({ data, run, toast }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const ev = data.events[0];

  async function add() {
    const err = chkText(title, 'task', 3, 80) || chkDate(deadline, 'deadline', 0);
    if (err) return toast(err);
    if (deadline && ev && ev.date && deadline > ev.date) return toast('Deadline cannot be after the event date');
    if (await run(() => api.post('/tasks', { title: title.trim(), deadline, done: false }))) {
      setTitle(''); setDeadline('');
    }
  }

  return (
    <>
      <h2>Task checklist</h2>
      <div className="row">
        <div><label htmlFor="tn">Task</label>
          <input id="tn" maxLength="80" placeholder="Book the band" value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label htmlFor="td">Deadline</label>
          <input id="td" type="date" min={today()} value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
        <div><button className="btn" onClick={add}>Add task</button></div>
      </div>
      {data.tasks.length ? (
        <ul className="list">
          {data.tasks.map(t => (
            <li key={t._id} className={t.done ? 'done' : ''}>
              <label className="check">
                <input type="checkbox" checked={!!t.done}
                  onChange={() => run(() => api.patch('/tasks/' + t._id, { done: !t.done }))} />
                <span>{t.title}{t.deadline && <small className="empty"> ({t.deadline})</small>}</span>
              </label>
              <button className="btn alt sm" onClick={() => run(() => api.del('/tasks/' + t._id))}>Remove</button>
            </li>
          ))}
        </ul>
      ) : <p className="empty">No tasks yet. Add one above.</p>}
    </>
  );
}
