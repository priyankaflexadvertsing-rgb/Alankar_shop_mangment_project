import React, { useState, useEffect } from "react";
import Sidebar from "../../global/Sidebar";
import { SummaryTable } from "../../SummaryTable";
import { SERVER_URI } from "../../../uri/uril";
import "../../Auth/style.css";
import DashboardHeader from "../adminHeader";
import { apiFetch } from "../../../src/hooks/fetchInstance";
import PrintingRateList from "./PrintingRateList";

const AllUser = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState(null);
    const [open, setOpen] = useState(false);
    const [rateListUserId, setRateListUserId] = useState(null);

    /* ---------------- FETCH USERS ---------------- */
    const getAllUserData = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("/users");
            const json = await res.json();

            if (res.ok) {
                setData(json.usersWithPayments || []);
            } else {
                console.error("Failed to fetch users:", json);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllUserData();
    }, []);

    /* ---------------- TOGGLE USER DETAILS ---------------- */
    const toggleUser = (item) => {
        setSelectedUser((prev) =>
            prev?._id === item._id ? null : item
        );
    };

    /* ---------------- TOGGLE RATE LIST ---------------- */
    const toggleRateList = (userId) => {
        setRateListUserId((prev) =>
            prev === userId ? null : userId
        );
    };

    /* ---------------- EDIT USER ---------------- */
    const editUserFile = async ({ userId, updatedData }) => {
        try {
            const res = await fetch(`${SERVER_URI}/updateUser/${userId}`, {
                credentials: "include",
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rate: updatedData }),
            });

            if (res.ok) {
                alert("Updated successfully!");
                setEditData(null);
                getAllUserData();
            } else {
                alert("Update failed!");
            }
        } catch (err) {
            console.error("Edit error:", err);
        }
    };

    return (
        <div className="flex w-full relative min-h-screen bg-gray-100">
            {/* SIDEBAR */}
            <Sidebar user={user} />
            <DashboardHeader open={open} setOpen={setOpen} />

            {/* MAIN CONTENT */}
            <div className="w-[80%] flex flex-col absolute left-[15rem] mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    All Users
                </h2>

                {/* LOADING */}
                {loading && (
                    <div className="w-full flex justify-center items-center py-10">
                        <div className="loader"></div>
                    </div>
                )}

                {/* USER LIST */}
                {!loading && (
                    <ul className="space-y-4">
                        {data.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                No users found.
                            </p>
                        ) : (
                            data.map((item) => (
                                <li
                                    key={item._id}
                                    className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    {/* HEADER */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.image || "/public/user.png"}
                                                alt="user"
                                                className="w-10 h-10 rounded-full border"
                                            />
                                            <div>
                                                <h2 className="font-bold">
                                                    {item.name}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {item.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {user.role === "admin" && (
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                                    onClick={() =>
                                                        setEditData({
                                                            userId: item._id,
                                                            fields: item.rate || {},
                                                        })
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                                onClick={() => toggleUser(item)}
                                            >
                                                {selectedUser?._id === item._id
                                                    ? "Hide Details"
                                                    : "Show Details"}
                                            </button>

                                            <button
                                                className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                                                onClick={() =>
                                                    toggleRateList(item._id)
                                                }
                                            >
                                                Rate List
                                            </button>
                                        </div>
                                    </div>

                                    {/* RATE LIST */}
                                    {rateListUserId === item._id && (
                                        <div className="mt-4 w-full bg-red-500 ">
                                            <PrintingRateList user={item} />
                                        </div>
                                    )}

                                    {/* DETAILS */}
                                    {selectedUser?._id === item._id && (
                                        <div className="mt-4 bg-gray-50 rounded-xl p-4">
                                            <SummaryTable
                                                printing={item.payment_details}
                                                userId={item._id}
                                                role={user.role}
                                            />
                                        </div>
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            {/* EDIT MODAL */}
            {editData && user.role === "admin" && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Edit User Rate
                        </h2>

                        {Object.keys(editData.fields).length === 0 && (
                            <p className="text-gray-500 text-center">
                                No editable fields.
                            </p>
                        )}

                        {Object.keys(editData.fields).map((key) => (
                            <div key={key} className="mb-3">
                                <label className="block font-medium capitalize">
                                    {key}
                                </label>
                                <input
                                    type="text"
                                    value={editData.fields[key]}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            fields: {
                                                ...editData.fields,
                                                [key]: e.target.value,
                                            },
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        ))}

                        <div className="flex justify-between mt-4">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded"
                                onClick={() => setEditData(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() =>
                                    editUserFile({
                                        userId: editData.userId,
                                        updatedData: editData.fields,
                                    })
                                }
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUser;
