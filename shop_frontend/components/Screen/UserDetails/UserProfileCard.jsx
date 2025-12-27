import { useState } from "react";
import EditUserModal from "./EditUserModal";
import { apiFetch } from "../../../src/hooks/fetchInstance";
import PrintingRateList from "../../Admin/User/PrintingRateList";

const UserProfileCard = ({ user: initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [show, setShow] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const saveChanges = async (payload) => {
        try {
            setLoading(true);
            setError("");

            const res = await apiFetch(`/users/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to update user");
            }

            const data = await res.json(); // ✅ FIX
            setUser(data);
            setOpen(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="w-full mx-auto bg-white flex flex-col gap-4 shadow-teal-50 p-4">
                {/* Header */}
                <div className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={user.image || "/user.png"} // ✅ fallback
                            alt="User"
                            className="w-10 h-10 rounded-full border"
                        />

                        <div>
                            <h2 className="text-md font-bold">
                                {user.name}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {user.email}
                            </p>
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            disabled={loading}
                            className="w-10 h-10 rounded-full cursor-pointer ml-6 flex items-center justify-center"
                        >
                            <img
                                src="/edit.png" // ✅ FIX
                                alt="Edit"
                                className="w-5"
                            />
                        </button>
                    </div>

                    <button
                        onClick={() => setShow((prev) => !prev)}
                        disabled={loading}
                        className="py-2 px-5 bg-gray-800 text-white hover:text-gray-800 hover:bg-white hover:border-2 hover:border-gray-800 font-bold rounded-md cursor-pointer"
                    >
                        {show ? "Hide Rate List" : "Rate List"}
                    </button>
                </div>

                {/* Rate List */}
                {show && (
                    <div className="mt-2">
                        <PrintingRateList user={user} />
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {open && (
                <EditUserModal
                    user={user}
                    onClose={() => setOpen(false)}
                    onSave={saveChanges}
                />
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white px-4 py-2 rounded shadow">
                        Saving changes...
                    </div>
                </div>
            )}  
        </>
    );
};

export default UserProfileCard;
