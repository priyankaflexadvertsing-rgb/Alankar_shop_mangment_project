import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { SERVER_URI, SOCKET_URI } from "../uri/uril";
import { apiFetch } from "../src/hooks/fetchInstance";

export const SummaryTable = ({ printing, userId, role }) => {
  const [editData, setEditData] = useState(null); // for modal
  console.log(printing);

  const timestampToDate = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // DELETE API
  const deleteUserFile = async ({ id, userId }) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await apiFetch(`/printing/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (result.success) {
        alert("Deleted successfully");
        refreshData();
      } else {
        alert("Delete failed: " + result.message);
      }
    } catch (error) {
      console.error("DELETE error:", error);
    }
  };

  // EDIT API
  const editUserFile = async ({ printingId, updatedData, userId }) => {
    try {
      const res = await apiFetch(`/printing/${printingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updatedData }),
      });

      const result = await res.json();

      if (result.success) {
        alert("Updated successfully");
        setEditData(null);
        refreshData();
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("EDIT error:", error);
    }
  };

  // TOTAL calculations
  const totals = printing.reduce(
    (acc, item) => {
      acc.price += Number(item.payment_details.items.price) || 0;
      acc.quantity += Number(item.payment_details.items.quantity) || 0;
      acc.squareFeet += Number(item.payment_details.items.squareFeet) || 0;
      return acc;
    },
    { price: 0, quantity: 0, squareFeet: 0 }
  );

  return (
    <>
      <div className=" w-full mr-4">
        <table className="w-full text-sm table-auto border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="p-2 border text-center">No.</th>
              <th className="p-2 border text-center">Image</th>
              <th className="p-2 border text-center">Date</th>
              <th className="p-2 border text-center">Size</th>
              <th className="p-2 border text-center">Sheet</th>
              <th className="p-2 border text-center">Qty</th>
              <th className="p-2 border text-center">Sqft</th>
              <th className="p-2 border text-center">Price</th>
              <th className="p-2 border text-center">File</th>
              <th className="p-2 border text-center">Edit</th>
              <th className="p-2 border text-center">Delete</th>
              <th className="p-2 border text-center">status</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {printing.length !== 0 ? (
              <>
                {printing.map((it, idx) => (
                  <tr
                    key={idx}
                    className="bg-gray-800 text-white hover:bg-gray-700 "
                  >
                    <td className="p-2 border">{idx + 1}</td>
                    <td className="p-2 border flex items-center">
                      <img
                        src={`${SOCKET_URI}/thumbnails/${encodeURIComponent(
                          it.compressedfilePath.split("\\").pop()
                        )}`}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-[50px] h-[50px] object-cover rounded mx-auto shadow-lg cursor-move"
                      />
                    </td>
                    <td className="p-2 border">
                      {timestampToDate(it.payment_details.items.timestamp)}
                    </td>
                    <td className="p-2 border">
                      {it.payment_details.items.size}
                    </td>
                    <td className="p-2 border">
                      {it.payment_details.items.sheet}
                    </td>
                    <td className="p-2 border">
                      {it.payment_details.items.quantity}
                    </td>
                    <td className="p-2 border">
                      {Number(it.payment_details.items.squareFeet).toFixed(2)}
                    </td>
                    <td className="p-2 border">
                      ₹ {Number(it.payment_details.items.price).toFixed(2)}
                    </td>
                    <td className="p-2 border">
                      {it.payment_details.items.imageFormat}
                    </td>

                    {/* EDIT BUTTON */}
                    <td
                      className="p-2 border cursor-pointer text-blue-400 hover:text-blue-600"
                      onClick={() =>
                        setEditData({
                          printingId: it._id,
                          fields: { ...it.payment_details.items },
                        })
                      }
                    >
                      Edit
                    </td>

                    {/* DELETE BUTTON */}
                    <td
                      className="p-2 border cursor-pointer text-red-400 hover:text-red-600"
                      onClick={() =>
                        deleteUserFile({ id: it._id, userId: userId })
                      }
                    >
                      Delete
                    </td>
                    <td className="p-2 border">{it.status}</td>
                  </tr>
                ))}

                <tr className="bg-gray-600 text-white  font-bold">
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border" colSpan={2}>
                    Total
                  </td>
                  <td className="p-2 border">{totals.quantity}</td>
                  <td className="p-2 border">{totals.squareFeet.toFixed(2)}</td>
                  <td className="p-2 border">₹ {totals.price.toFixed(2)}</td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                  <td className="p-2 border"></td>
                </tr>
              </>
            ) : (
              <tr>
                <td colSpan="10" className="p-2 border">
                  No items to calculate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-white dark:bg-black bg-opacity-50 flex justify-center items-center">
          <div className=" p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>

            {Object.keys(editData.fields).map((key) => (
              <div key={key} className="mb-3">
                <label className="block font-medium">{key}</label>
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
                    printingId: editData.printingId,
                    updatedData: editData.fields,
                    userId: userId,
                  })
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
