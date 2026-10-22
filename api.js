// All calls to the Express backend are made from here.
const BASE = import.meta.env.VITE_API_URL || '/api';
let token = localStorage.getItem('ss_token') || '';

export const setToken = t => {
  token = t;
  t ? localStorage.setItem('ss_token', t) : localStorage.removeItem('ss_token');
};
export const hasToken = () => !!token;

async function call(method, path, body) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Something went wrong');
  return json;
}

export const api = {
  get: p => call('GET', p),
  post: (p, b) => call('POST', p, b),
  patch: (p, b) => call('PATCH', p, b),
  del: p => call('DELETE', p)
};
