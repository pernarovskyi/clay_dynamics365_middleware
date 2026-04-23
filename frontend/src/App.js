import { useEffect, useState } from "react";
import { getFields, saveFields } from "./api/fields";
import "./App.css";

function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [newField, setNewField] = useState("");

  useEffect(() => {
    getFields()
      .then(({ allowed, defaults }) => {
        setRows(allowed.map(name => ({ name, isDefault: defaults.includes(name) })));
      })
      .catch(() => setStatus({ type: "error", message: "Failed to load field configuration" }))
      .finally(() => setLoading(false));
  }, []);

  function toggleDefault(name) {
    setRows(prev => prev.map(r => r.name === name ? { ...r, isDefault: !r.isDefault } : r));
  }

  function removeField(name) {
    setRows(prev => prev.filter(r => r.name !== name));
  }

  function addField() {
    const trimmed = newField.trim().toLowerCase().replace(/\s+/g, "_");
    if (!trimmed || rows.some(r => r.name === trimmed)) return;
    setRows(prev => [...prev, { name: trimmed, isDefault: false }]);
    setNewField("");
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const allowed = rows.map(r => r.name);
      const defaults = rows.filter(r => r.isDefault).map(r => r.name);
      await saveFields(allowed, defaults);
      setStatus({ type: "success", message: "Configuration saved" });
    } catch {
      setStatus({ type: "error", message: "Failed to save configuration" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="container"><p className="loading">Loading...</p></div>;
  }

  const isSystem = name => name === "contactid" || name === "emailaddress1";

  return (
    <div className="container">
      <div className="page-header">
        <h1>Field Configuration</h1>
        <p>Manage which Dynamics 365 Contact fields are available to Clay.</p>
      </div>

      {status && (
        <div className={`alert alert-${status.type}`}>{status.message}</div>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Field Name</th>
              <th className="col-default" title="Returned when Clay does not specify fields">Default</th>
              <th className="col-action"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ name, isDefault }) => (
              <tr key={name} className={isSystem(name) ? "system-row" : ""}>
                <td>
                  <code>{name}</code>
                  {isSystem(name) && <span className="badge">system</span>}
                </td>
                <td className="col-default">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={() => toggleDefault(name)}
                  />
                </td>
                <td>
                  {!isSystem(name) && (
                    <button
                      className="btn-remove"
                      onClick={() => removeField(name)}
                      title="Remove field"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="add-row">
        <input
          type="text"
          className="input-field"
          placeholder="e.g. new_custom_field"
          value={newField}
          onChange={e => setNewField(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addField()}
        />
        <button className="btn-add" onClick={addField}>+ Add Field</button>
      </div>

      <button className="btn-save" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export default App;
