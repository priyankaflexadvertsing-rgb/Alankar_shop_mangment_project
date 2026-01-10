import React, { useState, useEffect } from "react";
import Sidebar from "../../global/Sidebar";
import { SummaryTable } from "../../SummaryTable";

import "../../Auth/style.css";
import DashboardHeader from "../adminHeader";
import { apiFetch } from "../../../src/hooks/fetchInstance";
import PrintingRateList from "./PrintingRateList";
import EditUserModal from "./EditUserModal";
import DashboardWrapper from "../../../src/admin/dashBoardWarpper";


const AllUser = ({ user }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState(null);
    const [open, setOpen] = useState(false);
    const [opened, setOpened] = useState(false);
    const [rateListUserId, setRateListUserId] = useState(null);

    /* ---------------- FETCH USERS ---------------- */
    const getAllUserData = async () => {
        try {
            setLoading(true);
            const res = await apiFetch("/users");
            const json = await res.json();

            if (res.ok) {
                setData(json.usersWithPayments || []);
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
            const res = await apiFetch(`/admin/user/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rate: updatedData
                }),
            });

            if (!res.ok) throw new Error("Update failed");

            alert("Updated successfully!");
            setOpened(false);
            setEditData(null);
            getAllUserData();
        } catch (err) {
            console.error("Edit error:", err);
        }
    };

    return <>
    <DashboardWrapper>
        {/* <div className="flex w-full relative min-h-screen bg-gray-100"> */}
            {/* <Sidebar user={user} />
            <DashboardHeader open={open} setOpen={setOpen} /> */}

            <div
                className="w-full flex flex-col px-5  mt-6"
                onClick={() => setOpen(false)}
            >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    All Users
                </h2>

                {loading && (
                    <div className="w-full flex justify-center py-10">
                        <div className="loader"></div>
                    </div>
                )}

                {!loading && (
                    <ul className="space-y-4">
                        {data.map((item) => (
                            <li
                                key={item._id}
                                className="p-4 bg-white border-b-1 dark:bg-black  shadow-sm"
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image || "/user.png"}
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
                                                className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg"
                                                onClick={() => {
                                                    setOpened(true);
                                                    setEditData({
                                                        user: item,
                                                        fields: item.rate || {},
                                                    });
                                                }}
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
                                            {rateListUserId === item._id
                                                ? "Hide Rate List"
                                                : "Rate List"}
                                        </button>
                                    </div>
                                </div>

                                {rateListUserId === item._id && (
                                    <div className="mt-4">
                                        <PrintingRateList user={item} />
                                    </div>
                                )}

                                {selectedUser?._id === item._id && (
                                    <div className="mt-4 bg-gray-50 dark:bg-black rounded-xl">
                                        <SummaryTable
                                            printing={item.payment_details}
                                            userId={item._id}
                                            role={user.role}
                                        />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {opened && editData && (
                <EditUserModal
                    user={editData.user}
                    onClose={() => setOpened(false)}
                    onSave={(updatedFields) =>
                        editUserFile({
                            userId: editData.user._id,
                            updatedData: updatedFields,
                        })
                    }
                />
            )}
        {/* </div> */}
        </DashboardWrapper>
    </>

};

export default AllUser;
