import React, { useState, useRef, useEffect } from "react";
import socketIO from "socket.io-client";
import { SOCKET_URI } from "../uri/uril";
import { apiFetch } from "../src/hooks/fetchInstance";
import useStore from "../store/store";
import "./style.css";

const ENDPOINT = SOCKET_URI || "";
let socket;

/* ---------- REGEX ---------- */
const FILE_NAME_REGEX =
  /^(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*x\s*(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*=\s*(\d+)\s*(normal|star|vinyl|blackback)\.jpg$/i;


/* ---------- MATERIALS (FOR ALERT ONLY) ---------- */
const MATERIALS = ["normal", "star", "vinyl"];

const UploadPrinting = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const user = useStore((state) => state.user);
  const fileInputRef = useRef(null);

  /* ---------- SOCKET INIT ---------- */
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    return () => socket.disconnect();
  }, []);

  /* ---------- HANDLE FILES ---------- */
  const handleFiles = (selectedFiles) => {
    const remainingSlots = 10 - files.length;
    if (remainingSlots <= 0) return;

    const newFiles = Array.from(selectedFiles).slice(0, remainingSlots);
    const newThumbs = [];
    const newRows = [];

    newFiles.forEach((file) => {
      const match = file.name.match(FILE_NAME_REGEX);

      if (!match) {
        alert(
          `❌ Invalid file name:\n\n${file.name}\n\nValid examples:\n` +
          `10feetx3feet=1normal.jpg\n` +
          `10feetx3inch=1normal.jpg\n` +
          `10x3feet=1normal.jpg\n` +
          `10x3inch=1vinyl.jpg`
        );

        return;
      }

      const [
        ,
        widthStr,
        widthUnitRaw,
        heightStr,
        heightUnitRaw,
        qtyStr,
        material,
      ] = match;

      // If width unit is missing, use height unit
      const widthUnit = widthUnitRaw || heightUnitRaw;
      const heightUnit = heightUnitRaw || widthUnitRaw;

      if (!widthUnit || !heightUnit) {
        alert("Unit (feet or inch) must be specified at least once.");
        return;
      }

      const width = parseFloat(widthStr);
      const height = parseFloat(heightStr);
      const quantity = parseInt(qtyStr, 10);

      // Convert to feet
      const widthFeet =
        widthUnit.toLowerCase() === "inch" ? width / 12 : width;

      const heightFeet =
        heightUnit.toLowerCase() === "inch" ? height / 12 : height;

      const squareFeet = (widthFeet * heightFeet).toFixed(2);


      newThumbs.push(URL.createObjectURL(file));
      newRows.push({
        size: `${width}${widthUnit} x ${height}${heightUnit}`,
        squareFeet,
        quantity,
        sheet: material,
        price: "-",
        timestamp: Date.now(),
      });
    });

    setFiles((prev) => [...prev, ...newFiles]);
    setThumbnails((prev) => [...prev, ...newThumbs]);
    setTableData((prev) => [...prev, ...newRows]);
  };

  /* ---------- CLEAR ---------- */
  const clearUploadArea = () => {
    thumbnails.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setThumbnails([]);
    setTableData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------- DRAG & DROP ---------- */
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

  /* ---------- UPLOAD ---------- */
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
        message: `${user.name} uploaded printings`,
      });

      clearUploadArea();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-wrap justify-center items-start min-h-screen bg-gray-100 p-6 gap-8">
      {/* Upload Section */}
      <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
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
            ${isDragging
                ? "bg-gray-200 border-black"
                : "bg-white border-gray-400"
              }`}
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {thumbnails.length === 0 ? (
              <span className="text-gray-700 text-lg font-medium text-center px-4">
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

          {/* 🔔 ALERT SUGGESTION */}


          <button
            onClick={handleUploadPrinting}
            disabled={uploading || files.length === 0}
            className={`mt-6 w-full bg-black text-white font-semibold py-2 rounded-lg flex justify-center
            ${uploading || !files.length
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
              }`}
          >
            {uploading ? <div className="loader"></div> : "Upload"}
          </button>
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-400 text-yellow-800 p-4 rounded-md text-sm">
          <p className="font-semibold mb-1">📌Flex Printing File format:</p>
          <p>width(feet/inch)xheight(feet/inch)=quantitymaterial.jpg</p>
          <p className="mt-1">
            Example:
            10feetx3feet=1normal.jpg
            <br />
            10feetx3inch=1star.jpg
            <br />
            10x3feet=1vinyl.jpg
            <br />
            10x3inch=2blackback.jpg
          </p>

          <p className="font-semibold mb-1">📌 Letterpad, Visiting_Card, Pumplate, Bill_Book, 3D_letter :</p>
          <p className="mt-1">
            Example:
            <br />
            Pumplate :- 20,000 Qty A4 half size 90gsm art paper SingleSide Pumplate
            <br />
            Pumplate :- 1000qty A4 size yellow paper Pumplate
            <br />
            Visiting Card :- 20000 Qty velvet 250gsm art paper Pumplate
            <br />
            Letterpad :- 500 Qty A4 size 90gsm white paper Letterpad
          </p>
        </div>
      </div>
      {/* Table Section */}
      <div className="w-full md:w-[100%] bg-white shadow-md rounded-lg p-6">
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
                  <td className="border capitalize">{item.sheet}</td>
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
