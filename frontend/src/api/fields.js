const BASE = process.env.REACT_APP_API_URL;
const HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": process.env.REACT_APP_API_KEY
};

export async function getFields() {
  const res = await fetch(`${BASE}/api/fields`, { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to load fields");
  return res.json();
}

export async function saveFields(allowed, defaults) {
  const res = await fetch(`${BASE}/api/fields`, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({ allowed, defaults })
  });
  if (!res.ok) throw new Error("Failed to save fields");
  return res.json();
}
