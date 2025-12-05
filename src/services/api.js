const base = 'https://reservaapp-zb6y.onrender.com';

export async function get(url) {
  const res = await fetch(base + url);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function post(url, body) {
  const res = await fetch(base + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function put(url, body) {
  const res = await fetch(base + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
