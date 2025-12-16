import React, { useState } from "react";

export const CreateCustomerModal = ({ isLoading, errorMsg, onClose, onCreate }) => {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) return;
        onCreate({
            name: name.trim(),
            details: {},
            rate: { normal: 7, blackBack: 12, star: 14 },
            printing: [],
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-[300px] text-center shadow-lg">
                <h3 className="text-black mb-4 text-lg font-semibold">Create New Customer</h3>
                <input
                    className="border border-black w-full p-2 mb-2 text-black"
                    type="text"
                    value={name}
                    placeholder="Enter customer name"
                    onChange={(e) => setName(e.target.value)}
                />
                {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}
                <div className="flex justify-center gap-2">
                    <button
                        className={`bg-blue-600 text-white px-4 py-2 rounded ${isLoading ? "opacity-50" : ""}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating..." : "Create"}
                    </button>
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}


