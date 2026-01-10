import { useState, useEffect } from "react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    flex: {},
    visiting_card: {},
  });

  /* Sync when user changes */
  useEffect(() => {
    setForm({
      flex: { ...(user?.rate?.flex || {}) },
      visiting_card: { ...(user?.rate?.visiting_card || {}) },
    });
  }, [user]);

  const handleFlexChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      flex: {
        ...prev.flex,
        [key]: Number(value) || 0,
      },
    }));
  };

  const handleVisitingChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      visiting_card: {
        ...prev.visiting_card,
        [key]: Number(value) || 0,
      },
    }));
  };

  const submit = () => {
    onSave({
      name: form.name,
      rate: {
        flex: form.flex,
        visiting_card: form.visiting_card,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-white/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">Edit User & Rates</h2>

        <input
          type="text"
          className="w-full border rounded p-2"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="User name"
        />

        <div>
          <h3 className="font-semibold mb-2">Flex Rates</h3>
          {Object.keys(form.flex).length === 0 && (
            <p className="text-sm text-gray-500">No flex rates</p>
          )}

          {Object.entries(form.flex).map(([k, v]) => (
            <div key={k} className="flex justify-between mb-2">
              <span className="capitalize">{k}</span>
              <input
                type="text"
                className="border rounded w-24 p-1"
                value={v}
                onChange={(e) =>
                  handleFlexChange(k, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-semibold mb-2">Visiting Card Rates</h3>
          {Object.keys(form.visiting_card).length === 0 && (
            <p className="text-sm text-gray-500">
              No visiting card rates
            </p>
          )}

          {Object.entries(form.visiting_card).map(([k, v]) => (
            <div key={k} className="flex justify-between mb-2">
              <span className="capitalize">
                {k.replace(/_/g, " ")}
              </span>
              <input
                type="number"
                className="border rounded w-24 p-1"
                value={v}
                onChange={(e) =>
                  handleVisitingChange(k, e.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
