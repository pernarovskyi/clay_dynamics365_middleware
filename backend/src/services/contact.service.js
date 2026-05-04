const dynamics = require("./dynamics.service");
const { getAllowed, getDefaults } = require("./contact.fields.service");

async function getByEmail(email, requestedFields = null) {
  const allowed = getAllowed();
  let fields = getDefaults();

  if (requestedFields && Array.isArray(requestedFields)) {
    const filtered = requestedFields.filter(f => allowed.includes(f));
    if (filtered.length > 0) fields = filtered;
  }

  return dynamics.getContactByEmail(email, fields);
}

async function upsert(email, fields) {
  const writable = getAllowed().filter(f => f !== "contactid");
  const contactData = Object.fromEntries(
    Object.entries(fields).filter(([k]) => writable.includes(k))
  );

  const existing = await dynamics.getContactByEmail(email, ["contactid"]);

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

async function updateById(contactId, fields) {
  const writable = getAllowed().filter(f => f !== "contactid");
  const contactData = Object.fromEntries(
    Object.entries(fields).filter(([k]) => writable.includes(k))
  );

  if (Object.keys(contactData).length === 0) {
    const err = new Error("No valid fields provided");
    err.statusCode = 400;
    throw err;
  }

  await dynamics.updateContact(contactId, contactData);
  return { action: "updated", contactid: contactId };
}

module.exports = { getByEmail, upsert, updateById };
