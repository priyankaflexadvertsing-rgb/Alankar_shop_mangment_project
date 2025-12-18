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
                const error = await res.json();
                throw new Error(error.message || "Failed to update user");
            }

            const data = res.json();
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
            <div className="w-full mx-auto bg-white flex flex-col gap-4  shadow-teal-50  p-4 ">
                {/* Header */}
                <div className="flex gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={user.image}
                            className="w-10 h-10 rounded-full border"
                        />
                        <div>
                            <h2 className="text-md font-bold">{user.name}</h2>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                        </div>
                         <button
                        onClick={() => setOpen(true)}
                        className="w-10 h-10 rounded-full cursor-pointer ml-6 "
                    >
                        <img
                            src={"/public/edit.png"}
                            className="w-5  bg-contain"
                        />
                    </button>
                    </div>

                    <button
                        onClick={() => setShow(!show)}
                        className=" py-2 px-5 bg-gray-800 text-white hover:text-gray-800  hover:bg-white hover:border-2 hover:border-gray-800 font-bold rounded-md cursor-pointer ml-6 "
                    >
                        RateList
                    </button>
                </div>

                <PrintingRateList user={user} show={show} />

                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
            </div>

            {open && (
                <EditUserModal
                    user={user}
                    onClose={() => setOpen(false)}
                    onSave={saveChanges}
                />
            )}

            {loading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white px-4 py-2 rounded shadow">
                        Saving changes...
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfileCard;
