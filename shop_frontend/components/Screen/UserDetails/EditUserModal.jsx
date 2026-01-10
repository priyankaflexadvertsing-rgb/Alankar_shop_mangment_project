import { useState } from "react";

const EditUserModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: user.name,
    flex: { ...user.rate.flex },
    visiting_card: { ...user.rate.visiting_card },
  });

  const handleFlexChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      flex: { ...prev.flex, [key]: Number(value) },
    }));
  };

  const handleVisitingChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      visiting_card: {
        ...prev.visiting_card,
        [key]: Number(value),
      },
    }));
  };

  const submit = () => {
    onSave({
      rate: {
        flex: form.flex,
        visiting_card: form.visiting_card,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-xl font-bold">Edit User & Rates</h2>

        <input
          className="w-full border rounded p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <div>
          <h3 className="font-semibold mb-2">Flex Rates</h3>
          {Object.entries(form.flex).map(([k, v]) => (
            <div key={k} className="flex justify-between mb-2">
              <span className="capitalize">{k}</span>
              <input
                type="number"
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
          {Object.entries(form.visiting_card).map(([k, v]) => (
            <div key={k} className="flex justify-between mb-2">
              <span>{k.replace("_", " ")}</span>
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
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
