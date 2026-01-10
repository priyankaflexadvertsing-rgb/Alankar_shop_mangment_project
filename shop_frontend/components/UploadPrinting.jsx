

import React, { useState, useRef, useEffect } from "react";
import socketIO from "socket.io-client";
import { SOCKET_URI } from "../uri/uril";
import Navbar from "./global/Navbar";
import { apiFetch } from "../src/hooks/fetchInstance";
import useStore from "../store/store";
import "./style.css";

const ENDPOINT = SOCKET_URI || "";
let socket;

/* ---------- REGEX ---------- */
const FULL_REGEX =
  /^(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*x\s*(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*=\s*(\d+)\s*(normal|star|vinyl|blackback|bb|BB|Bb)\.jpg$/i;

const SIMPLE_REGEX =
  /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(?:\s*=\s*(\d+))?(?:.*)?\.jpg$/i;

/* ---------- HELPER ---------- */
const normalizeFileName = ({ width, height, unit, quantity, sheet }) =>
  `${width}${unit}x${height}${unit}=${quantity}${sheet}.jpg`;

const UploadPrinting = () => {
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const user = useStore((state) => state.user);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    return () => socket.disconnect();
  }, []);

  /* ---------- HANDLE FILES ---------- */
  const handleFiles = (selectedFiles) => {
    const selected = Array.from(selectedFiles);

    selected.forEach((file) => {
      const fullMatch = file.name.match(FULL_REGEX);
      const simpleMatch = file.name.match(SIMPLE_REGEX);

      if (!fullMatch && !simpleMatch) {
        alert(`❌ Invalid filename:\n${file.name}`);
        return;
      }

      const width = parseFloat(simpleMatch?.[1] || fullMatch[1]);
      const height = parseFloat(simpleMatch?.[2] || fullMatch[3]);
      const unit = fullMatch?.[2] || fullMatch?.[4] || "feet";
      const quantity = fullMatch ? parseInt(fullMatch[5], 10) : 1;
      const sheet = fullMatch
        ? fullMatch[6].toLowerCase().replace("bb", "blackback")
        : "normal";

      setFiles((p) => [...p, file]);
      setThumbnails((p) => [...p, URL.createObjectURL(file)]);
      setTableData((p) => [
        ...p,
        {
          fileName: file.name,
          width,
          height,
          unit,
          quantity,
          sheet,
          squareFeet: (
            (unit === "inch" ? width / 12 : width) *
            (unit === "inch" ? height / 12 : height)
          ).toFixed(2),
          size: `${width}${unit} x ${height}${unit}`,
          confirmed: !!fullMatch,
          needsConfirmation: !fullMatch,
          timestamp: Date.now(),
        },
      ]);
    });
  };

  /* ---------- EDIT ---------- */
  const updateRow = (index, field, value) => {
    setTableData((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [field]: value };
        const w = updated.unit === "inch" ? updated.width / 12 : updated.width;
        const h = updated.unit === "inch" ? updated.height / 12 : updated.height;
        updated.squareFeet = (w * h).toFixed(2);
        updated.size = `${updated.width}${updated.unit} x ${updated.height}${updated.unit}`;
        return updated;
      })
    );
  };

  /* ---------- CONFIRM (NO UI CHANGE) ---------- */
  const confirmRow = (index) => {
    setTableData((prev) => {
      const row = prev[index];

      const normalizedName = normalizeFileName({
        width: row.width,
        height: row.height,
        unit: row.unit,
        quantity: row.quantity,
        sheet: row.sheet,
      });

      setFiles((filesPrev) =>
        filesPrev.map((f, i) =>
          i === index ? new File([f], normalizedName, { type: f.type }) : f
        )
      );

      return prev.map((r, i) =>
        i === index
          ? {
              ...r,
              fileName: normalizedName,
              confirmed: true,
              needsConfirmation: false,
            }
          : r
      );
    });
  };

  /* ---------- UPLOAD ---------- */
  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      formData.append("meta", JSON.stringify(tableData));

      const res = await apiFetch("/printing/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      socket.emit("notification", {
        title: "Printing Upload",
        message: `${user.name} uploaded printings`,
      });

      setFiles([]);
      setThumbnails([]);
      setTableData([]);
    } finally {
      setUploading(false);
    }
  };

  const hasUnconfirmed = tableData.some(
    (row) => row.needsConfirmation && !row.confirmed
  );

  /* ---------- UI (UNCHANGED) ---------- */
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-[4rem] bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Print Files</h2>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />

          {thumbnails.length === 0 && (
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition"
            >
              <p className="text-gray-500 text-lg">
                Drag & Drop files or <span className="text-black font-medium">Click to upload</span>
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Example: 2x3.jpg or 2feet x 3feet = 1 normal.jpg
              </p>
            </div>
          )}

          {thumbnails.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {thumbnails.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-24 w-full object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || hasUnconfirmed || !files.length}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {hasUnconfirmed ? "Confirm all items first" : uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Item Details</h2>

          {tableData.map((item, i) =>
            item.needsConfirmation && !item.confirmed ? (
              <div
                key={i}
                className=" border border-yellow-300 rounded-lg p-4 shadow-sm"
              >
                <p className="font-medium mb-3">
                  ⚠️ Confirm details for <span className="font-mono">{item.fileName}</span>
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <input
                    type="number"
                    value={item.width}
                    onChange={(e) => updateRow(i, "width", +e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    value={item.height}
                    onChange={(e) => updateRow(i, "height", +e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <select
                    value={item.unit}
                    onChange={(e) => updateRow(i, "unit", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="feet">Feet</option>
                    <option value="inch">Inch</option>
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateRow(i, "quantity", +e.target.value)}
                    className="border rounded px-2 py-1"
                  />
                  <select
                    value={item.sheet}
                    onChange={(e) => updateRow(i, "sheet", e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="normal">Normal</option>
                    <option value="star">Star</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="blackback">Blackback</option>
                  </select>

                  <button
                    onClick={() => confirmRow(i)}
                    className="bg-green-600 cursor-pointer text-white rounded px-3 py-1"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>

      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Print Summary</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center border">
            <thead className="bg-gray-100">
              <tr>
                {["#", "Size", "SqFt", "Qty", "Material", "Status"].map((h) => (
                  <th key={h} className="border px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border">{i + 1}</td>
                  <td className="border">{item.size}</td>
                  <td className="border">{item.squareFeet}</td>
                  <td className="border">{item.quantity}</td>
                  <td className="border capitalize">{item.sheet}</td>
                  <td className="border">
                    {item.confirmed ? (
                      <span className="text-green-600 font-medium">Confirmed</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
    </>
  );
};

export default UploadPrinting;
