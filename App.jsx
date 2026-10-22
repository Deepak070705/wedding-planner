import { useState, useEffect, useCallback } from 'react';
import { api, setToken, hasToken } from './api';
import Enter from './components/Enter.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Vendors from './pages/Vendors.jsx';
import Budget from './pages/Budget.jsx';
import Tasks from './pages/Tasks.jsx';
import Guests from './pages/Guests.jsx';

const TABS = ['Dashboard', 'Vendors', 'Budget', 'Tasks', 'Guests'];
const EMPTY = { events: [], expenses: [], tasks: [], guests: [], quotes: [] };

export default function App() {
  const [name, setName] = useState(localStorage.getItem('ss_name') || '');
  const [tab, setTab] = useState('Dashboard');
  const [data, setData] = useState(EMPTY);
  const [vendors, setVendors] = useState([]);
  const [msg, setMsg] = useState('');

  const toast = m => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const logout = () => {
    setToken('');
    localStorage.removeItem('ss_name');
    setName('');
    setData(EMPTY);
  };

  // Load events, expenses, tasks, guests and quotes from the backend
  const reload = useCallback(async () => {
    try {
      const keys = Object.keys(EMPTY);
      const res = await Promise.all(keys.map(k => api.get('/' + k)));
      setData(Object.fromEntries(keys.map((k, i) => [k, res[i]])));
    } catch (e) {
      toast(e.message);
      if (/log in/i.test(e.message)) logout();
    }
  }, []);

  useEffect(() => { api.get('/vendors').then(setVendors).catch(() => {}); }, []);
  useEffect(() => { if (name && hasToken()) reload(); }, [name, reload]);

  // Run an action (add, update, delete), then refresh the data. Returns true if it worked.
  const run = async fn => {
    try { await fn(); await reload(); return true; }
    catch (e) { toast(e.message); return false; }
  };

  const toastBox = <div id="toast" role="status" className={msg ? 'show' : ''}>{msg}</div>;

  if (!name || !hasToken())
    return <><Enter onDone={setName} toast={toast} />{toastBox}</>;

  const props = { data, run, toast };
  return (
    <>
      <header className="top">
        <div className="wrap">
          <b>Shaadi Sathi</b>
          <span>Hi, {name} <button className="btn alt sm light" onClick={logout}>Exit</button></span>
        </div>
      </header>
      <div className="wrap">
        <nav role="tablist">
          {TABS.map(t => (
            <button key={t} role="tab" aria-selected={t === tab} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
        <main>
          {tab === 'Dashboard' && <Dashboard {...props} />}
          {tab === 'Vendors' && <Vendors {...props} vendors={vendors} goHome={() => setTab('Dashboard')} />}
          {tab === 'Budget' && <Budget {...props} />}
          {tab === 'Tasks' && <Tasks {...props} />}
          {tab === 'Guests' && <Guests {...props} />}
        </main>
      </div>
      <footer className="site-footer small">
        <div className="wrap">Shaadi Sathi - BCA Project, JECRC University, Jaipur</div>
      </footer>
      {toastBox}
    </>
  );
}
