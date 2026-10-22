import { useState } from 'react';
import { api, setToken } from '../api';
import { chkName, MAILRE } from '../validate';

// First page: type name, email and password, then go straight into the website
export default function Enter({ onDone, toast }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // Check the details before sending them to the server
    let error = chkName(name, 'name');
    if (!error && !MAILRE.test(email.trim())) {
      error = 'Enter a valid email like name@gmail.com';
    }
    if (!error && (password.length < 6 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password))) {
      error = 'Password needs 6+ characters with at least one letter and one number';
    }
    if (error) {
      toast(error);
      return;
    }

    try {
      const result = await api.post('/enter', { name: name.trim(), email: email.trim(), password: password });
      setToken(result.token);
      localStorage.setItem('ss_name', result.name);
      onDone(result.name);
    } catch (err) {
      toast(err.message);
    }
  }

  return (
    <div className="land">
      <header className="site-header">
        <div className="wrap">
          <span className="brand">Shaadi Sathi</span>
          <span className="tagline">Wedding and Event Planner</span>
        </div>
      </header>
      <div className="garland" aria-hidden="true"></div>

      <main className="wrap">
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">Plan weddings and events easily</p>
            <h1>Your big day, planned in one place.</h1>
            <p className="lead">
              Find vendors, track your budget, tick off tasks and collect RSVPs.
              No more notebooks, calls and spreadsheets.
            </p>
          </div>

          <form className="enter-card" onSubmit={handleSubmit}>
            <h2>Start planning</h2>
            <p className="hint">Type your name, email and a password to go straight in.</p>

            <label htmlFor="name">Your name</label>
            <input id="name" maxLength="40" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" maxLength="80" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />

            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            <span className="hint">At least 6 characters, with a letter and a number.</span>

            <button className="btn full" type="submit">Enter</button>
          </form>
        </section>

        <section className="steps">
          <h2>How it works</h2>
          <ol>
            <li><b>Enter</b><span>Type your name, email and password.</span></li>
            <li><b>Create your event</b><span>Add the date, place and total budget.</span></li>
            <li><b>Plan everything</b><span>Manage vendors, expenses, tasks and guests.</span></li>
          </ol>
        </section>

        <section className="features">
          <h2>What you can do</h2>
          <div className="feature-grid">
            <article><h3>Vendors</h3><p>Browse venues, caterers, photographers and more.</p></article>
            <article><h3>Quotations</h3><p>Send a request and see its status.</p></article>
            <article><h3>Budget</h3><p>Compare planned and paid amounts.</p></article>
            <article><h3>Tasks</h3><p>Set deadlines and tick them off.</p></article>
            <article><h3>Guests</h3><p>Keep a guest list and note each RSVP.</p></article>
            <article><h3>Countdown</h3><p>See how many days are left.</p></article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">BCA Project - JECRC University, Jaipur</div>
      </footer>
    </div>
  );
}
