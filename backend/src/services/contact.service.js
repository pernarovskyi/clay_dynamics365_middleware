const dynamics = require("./dynamics.service");
const { getAllowed } = require("./contactFields.service");

async function getByEmail(email, requestedFields = null) {
  return dynamics.getContactByEmail(email, requestedFields);
}

async function upsert(email, fields) {
  const writable = getAllowed().filter(f => f !== "contactid");
  const contactData = Object.fromEntries(
    Object.entries(fields).filter(([k]) => writable.includes(k))
  );

  const existing = await dynamics.getContactByEmail(email);

  if (existing) {
    if (Object.keys(contactData).length > 0) {
      await dynamics.updateContact(existing.contactid, contactData);
    }
    return { action: "updated", contactid: existing.contactid };
  }

  const res = await dynamics.createContact({ emailaddress1: email, ...contactData });
  const entityHeader = res.headers?.["odata-entityid"] || "";
  const match = entityHeader.match(/\(([^)]+)\)$/);

  return { action: "created", contactid: match?.[1] || null };
}

module.exports = { getByEmail, upsert };
