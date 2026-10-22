import { useState } from 'react';
import { api } from '../api';
import { rs, chkNum } from '../validate';

const CATS = ['Venue', 'Catering', 'Photography', 'Decoration', 'Makeup', 'Entertainment', 'Other'];

export default function Budget({ data, run, toast }) {
  const e = data.events[0];
  const [f, setF] = useState({ category: 'Venue', planned: '', paid: '' });
  const set = k => ev => setF({ ...f, [k]: ev.target.value });
  if (!e) return <p className="empty">Create an event on the Dashboard first.</p>;

  const plan = data.expenses.reduce((a, x) => a + Number(x.planned), 0);
  const paid = data.expenses.reduce((a, x) => a + Number(x.paid), 0);
  const pct = e.budget ? Math.min(100, paid / e.budget * 100) : 0;

  async function add() {
    const err = chkNum(f.planned, 'planned amount', 1, 1e8) || chkNum(f.paid || '0', 'paid amount', 0, 1e8);
    if (err) return toast(err);
    if (Number(f.paid || 0) > Number(f.planned)) return toast('Paid amount cannot be more than planned amount');
    if (await run(() => api.post('/expenses', { category: f.category, planned: Number(f.planned), paid: Number(f.paid || 0) })))
      setF({ ...f, planned: '', paid: '' });
  }

  return (
    <>
      <h2>Budget tracker</h2>
      <div className="grid">
        <div className="card"><div className="stat">{rs(plan)}</div>Planned</div>
        <div className="card"><div className="stat">{rs(paid)}</div>Paid</div>
        <div className="card"><div className="stat">{rs(e.budget - paid)}</div>Remaining</div>
      </div>
      <div className="bar" style={{ margin: '1rem 0' }} role="img" aria-label={`Budget used ${Math.round(pct)} percent`}>
        <i style={{ width: pct + '%' }} />
      </div>
      <div className="card">
        <div className="row">
          <div><label htmlFor="xc">Category</label>
            <select id="xc" value={f.category} onChange={set('category')}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label htmlFor="xp">Planned (Rs)</label><input id="xp" type="number" min="0" value={f.planned} onChange={set('planned')} /></div>
          <div><label htmlFor="xa">Paid (Rs)</label><input id="xa" type="number" min="0" value={f.paid} onChange={set('paid')} /></div>
          <div><button className="btn" onClick={add}>Add expense</button></div>
        </div>
      </div>
      {data.expenses.length ? (
        <div className="scroll">
          <table>
            <thead><tr><th>Category</th><th>Planned</th><th>Paid</th><th></th></tr></thead>
            <tbody>
              {data.expenses.map(x => (
                <tr key={x._id}>
                  <td>{x.category}</td><td>{rs(x.planned)}</td><td>{rs(x.paid)}</td>
                  <td><button className="btn alt sm" onClick={() => run(() => api.del('/expenses/' + x._id))}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="empty">No expenses yet. Add your first one above.</p>}
    </>
  );
}
