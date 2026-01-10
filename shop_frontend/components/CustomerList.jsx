import { useState } from "react";

export const CustomerList = ({
  fetchAllFiles,
  customers,
  onCustomerClick,
  onDropFile,
  onCreateClick
}) => {
  const [expanded, setExpanded] = useState({}); // store expanded states per customer

  const handleDrop = (e, name) => {
    e.preventDefault();

    const updatedCustomer = customers.find((c) => c.name === name);
    if (!updatedCustomer) return;

    let droppedItems = [];

    // ✅ Case 1: actual file objects (from OS or file input)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      droppedItems = Array.from(e.dataTransfer.files).map((file) => file.name);
    }

    // ✅ Case 2: text data (from drag-start in your own app)
    else {
      const data = e.dataTransfer.getData("text/plain");
      try {
        // if multiple items were serialized as JSON string
        const parsed = JSON.parse(data);
        droppedItems = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        droppedItems = data ? [data] : [];
      }
    }

    // ✅ Add unique new items
    const existing = new Set(updatedCustomer.printing || []);
    const newItems = droppedItems.filter((item) => !existing.has(item));

    if (newItems.length === 0) return;

    updatedCustomer.printing = [...existing, ...newItems];
    onDropFile(updatedCustomer);
  };

  const toggleCustomer = (name) => {
    setExpanded((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="w-[20%] p-4 fixed overflow-y-auto h-screen bg-gray-50 border-r border-gray-200">
      {/* Header Actions */}
      <div className="mb-4 space-y-2">
        <button
          onClick={onCreateClick}
          className="bg-blue-600 text-white w-full px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create Customer
        </button>

        <a href="http://localhost:5173/">
          <div className="bg-white text-black px-3 py-2 rounded hover:bg-gray-200 cursor-pointer text-center shadow-sm">
            <div className="font-bold">📂 All Printing</div>
          </div>
        </a>
      </div>

      {/* Customer List */}
      {customers.map((customer, index) => {
        const name = customer.name.replace(".json", "");
        const isExpanded = expanded[name] || false;

        return (
          <div
            key={index}
            className="bg-white text-black px-3 py-2 my-3 rounded hover:bg-gray-200 cursor-pointer shadow-sm transition"
            onClick={() => onCustomerClick(customer)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, customer.name)}
          >
            <div className="flex w-full items-center justify-between">
              <p className="font-bold truncate">{name}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent parent click
                  toggleCustomer(name);
                }}
                className="text-lg font-bold focus:outline-none hover:text-blue-600"
                title={isExpanded ? "Hide printing items" : "Show printing items"}
              >
                {isExpanded ? "🔼" : "🔽"}
              </button>
            </div>

            {/* Printing items list */}
            {isExpanded && customer.printing?.length > 0 && (
              <div className="text-sm mt-2 bg-gray-50 p-2 rounded">
                <strong className="block mb-1">Printing Items:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {customer.printing.map((file, i) => (
                    <li key={i} className="truncate">
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
