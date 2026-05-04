function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanPayload(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) =>
      value !== null && value !== undefined && value !== ""
    )
  );
}

module.exports = { isValidEmail, cleanPayload };
