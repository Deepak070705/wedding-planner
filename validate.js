// Checks that stop random or wrong input. Each function returns an error text, or "" if OK.
export const NAMERE = /^[A-Za-z\u0900-\u097F][A-Za-z\u0900-\u097F .'-]{1,39}$/;
export const MAILRE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
export const rs = n => 'Rs ' + Number(n || 0).toLocaleString('en-IN');

export const today = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};
const junk = s => /(.)\1{3,}/.test(s) || !/[A-Za-z\u0900-\u097F]{2}/.test(s);

export const chkName = (s, w) =>
  !NAMERE.test(s.trim()) || junk(s) ? `Enter a real ${w} (letters only, 2 to 40 characters)` : '';

export const chkText = (s, w, min, max) => {
  s = s.trim();
  if (s.length < min || s.length > max) return `The ${w} must be ${min} to ${max} characters`;
  return junk(s) ? `Enter a meaningful ${w} (no random letters)` : '';
};

export const chkNum = (v, w, min, max) => {
  if (v === '' || isNaN(v)) return `Enter the ${w}`;
  v = Number(v);
  return v < min || v > max ? `The ${w} must be between ${rs(min)} and ${rs(max)}` : '';
};

export const chkDate = (d, w, must) => {
  if (!d) return must ? `Choose the ${w}` : '';
  if (d < today()) return `The ${w} cannot be in the past`;
  return d > '2100-01-01' ? `Enter a valid ${w}` : '';
};
