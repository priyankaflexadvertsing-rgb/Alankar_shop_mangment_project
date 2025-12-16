import React, { useState, useRef, useEffect } from "react";
import socketIO from "socket.io-client";
import { SOCKET_URI } from "../uri/uril";
import { apiFetch } from "../src/hooks/fetchInstance";
import useStore from "../store/store";
import "./style.css";

const ENDPOINT = SOCKET_URI || "";
let socket; // prevent multiple connections

const UploadPrinting = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const user = useStore((state) => state.user);
  const fileInputRef = useRef(null);

  /* ---------------- SOCKET INIT ---------------- */
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    return () => socket.disconnect();
  }, []);

  /* ---------------- FILE HANDLING ---------------- */
  const handleFiles = (selectedFiles) => {
    const remainingSlots = 10 - files.length;
    if (remainingSlots <= 0) return;

    const newFiles = Array.from(selectedFiles).slice(0, remainingSlots);
    const newThumbs = newFiles.map((file) => URL.createObjectURL(file));

    setFiles((prev) => [...prev, ...newFiles]);
    setThumbnails((prev) => [...prev, ...newThumbs]);
  };

  const clearUploadArea = () => {
    thumbnails.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setThumbnails([]);
    setTableData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------- DRAG & DROP ---------------- */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  /* ---------------- UPLOAD ---------------- */
  const handleUploadPrinting = async () => {
    if (!files.length) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await apiFetch("/printing/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

      await res.json();

      socket.emit("notification", {
        title: "Printing Upload",
        message: `${user.name} uploaded a printing`,
      });

      clearUploadArea(); // 🔥 clears drag-drop + table
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-wrap justify-center items-start min-h-screen bg-gray-100 p-6 gap-8">
      {/* Upload Section */}
      <div className="w-full md:w-[45%] bg-white shadow-md rounded-lg p-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div
          className={`w-full min-h-[250px] border-2 border-dashed rounded-md flex flex-col justify-center items-center cursor-pointer transition
            ${isDragging ? "bg-gray-200 border-black" : "bg-white border-gray-400"}`}
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {thumbnails.length === 0 ? (
            <span className="text-gray-700 text-lg font-medium">
              Drag & Drop or Click to Upload Printing
            </span>
          ) : (
            <div className="grid grid-cols-3 gap-3 p-4">
              {thumbnails.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleUploadPrinting}
          disabled={uploading || files.length === 0}
          className={`mt-6 w-full bg-black text-white font-semibold py-2 rounded-lg flex justify-center
            ${uploading || !files.length ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
        >
          {uploading ? <div className="loader"></div> : "Upload"}
        </button>
      </div>

      {/* Table Section */}
      <div className="w-full md:w-[45%] bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">All Printings</h2>

        {tableData.length === 0 ? (
          <p className="text-gray-500 text-center">No data available</p>
        ) : (
          <table className="min-w-full border text-center text-sm">
            <thead className="bg-gray-200">
              <tr>
                {["No", "Size", "Sq Ft", "Qty", "Sheet", "Price", "Date"].map(
                  (h) => (
                    <th key={h} className="border px-3 py-2">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border">{i + 1}</td>
                  <td className="border">{item.size}</td>
                  <td className="border">{item.squareFeet}</td>
                  <td className="border">{item.quantity}</td>
                  <td className="border">{item.sheet}</td>
                  <td className="border">{item.price}</td>
                  <td className="border">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UploadPrinting;
