const BASE = process.env.REACT_APP_API_URL;
const HEADERS = {
  "x-api-key": process.env.REACT_APP_API_KEY
};

export async function getContact(email, fields = null) {
  const params = new URLSearchParams({ email });
  if (fields) params.set("fields", fields.join(","));
  const res = await fetch(`${BASE}/api/contact?${params}`, { headers: HEADERS });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function upsertContact(data) {
  const res = await fetch(`${BASE}/api/contact/upsert`, {
    method: "POST",
    headers: { ...HEADERS, "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
