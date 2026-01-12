

// import React, { useState, useRef, useEffect } from "react";
// import socketIO from "socket.io-client";
// import { SOCKET_URI } from "../uri/uril";
// import Navbar from "./global/Navbar";
// import { apiFetch } from "../src/hooks/fetchInstance";
// import useStore from "../store/store";
// import "./style.css";

// const ENDPOINT = SOCKET_URI || "";
// let socket;

// /* ---------- REGEX ---------- */
// const FULL_REGEX =
//   /^(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*x\s*(\d+(?:\.\d+)?)(?:\s*(feet|inch))?\s*=\s*(\d+)\s*(normal|star|vinyl|blackback|bb|BB|Bb)\.jpg$/i;

// const SIMPLE_REGEX =
//   /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(?:\s*=\s*(\d+))?(?:.*)?\.jpg$/i;
// const visiting_card_regex =
//   /^(?:\s*(Visiting|Bill Book| Menu Card))?\s*=\s*(\d+)\s*(single|double)\.jpg$/i;

// /* ---------- HELPER ---------- */
// const normalizeFileName = ({ width, height, unit, quantity, sheet }) =>
//   `${width}${unit}x${height}${unit}=${quantity}${sheet}.jpg`;

// const UploadPrinting = () => {
//   const [files, setFiles] = useState([]);
//   const [fileTypes, setFileTypes] = useState("");
//   const [thumbnails, setThumbnails] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const fileInputRef = useRef(null);
//   const user = useStore((state) => state.user);

//   /* ---------- SOCKET ---------- */
//   useEffect(() => {
//     socket = socketIO(ENDPOINT, { transports: ["websocket"] });
//     return () => socket.disconnect();
//   }, []);

//   /* ---------- HANDLE FILES ---------- */
//   const handleFiles = (selectedFiles) => {
//     const selected = Array.from(selectedFiles);

//     selected.forEach((file) => {
//       const fullMatch = file.name.match(FULL_REGEX);
//       const simpleMatch = file.name.match(SIMPLE_REGEX);

//       if (fullMatch && simpleMatch) {
//         setFileTypes("Flex")
//         const width = parseFloat(simpleMatch?.[1] || fullMatch[1]);
//         const height = parseFloat(simpleMatch?.[2] || fullMatch[3]);
//         const unit = fullMatch?.[2] || fullMatch?.[4] || "feet";
//         const quantity = fullMatch ? parseInt(fullMatch[5], 10) : 1;
//         const sheet = fullMatch
//           ? fullMatch[6].toLowerCase().replace("bb", "blackback")
//           : "normal";

//         setFiles((p) => [...p, file]);
//         setThumbnails((p) => [...p, URL.createObjectURL(file)]);
//         setTableData((p) => [
//           ...p,
//           {
//             type: fileTypes,
//             fileName: file.name,
//             width,
//             height,
//             unit,
//             quantity,
//             sheet,
//             squareFeet: (
//               (unit === "inch" ? width / 12 : width) *
//               (unit === "inch" ? height / 12 : height)
//             ).toFixed(2),
//             size: `${width}${unit} x ${height}${unit}`,
//             confirmed: !!fullMatch,
//             needsConfirmation: !fullMatch,
//             timestamp: Date.now(),
//           },
//         ]);

//       } else if (visiting_card_regex.test(file.name)) {
//         setFileTypes("Visiting Card")
//         const match = file.name.match(visiting_card_regex);
//         const quantity = match ? parseInt(match[2], 10) : 1;
//         const sheetType = match ? match[3].toLowerCase() : "single";
//         setFiles((p) => [...p, file]);
//         setThumbnails((p) => [...p, URL.createObjectURL(file)]);
//         setTableData((p) => [
//           ...p,
//           {
//             fileName: file.name,
//             width: 0,
//             height: 0,
//             unit: "N/A",
//             quantity,
//             sheet: sheetType,
//             squareFeet: 0,
//             size: "N/A",
//             confirmed: true,
//             fb: sheetType,
//             needsConfirmation: false,
//             timestamp: Date.now(),
//           },
//         ]);
//       }


//     });
//   };

//   /* ---------- EDIT ---------- */
//   const updateRow = (index, field, value) => {
//     setTableData((prev) =>
//       prev.map((row, i) => {
//         if (i !== index) return row;
//         const updated = { ...row, [field]: value };
//         const w = updated.unit === "inch" ? updated.width / 12 : updated.width;
//         const h = updated.unit === "inch" ? updated.height / 12 : updated.height;
//         updated.squareFeet = (w * h).toFixed(2);
//         updated.size = `${updated.width}${updated.unit} x ${updated.height}${updated.unit}`;
//         return updated;
//       })
//     );
//   };

//   /* ---------- CONFIRM (NO UI CHANGE) ---------- */
//   const confirmRow = (index) => {
//     setTableData((prev) => {
//       const row = prev[index];

//       const normalizedName = normalizeFileName({
//         width: row.width,
//         height: row.height,
//         unit: row.unit,
//         quantity: row.quantity,
//         sheet: row.sheet,
//       });

//       setFiles((filesPrev) =>
//         filesPrev.map((f, i) =>
//           i === index ? new File([f], normalizedName, { type: f.type }) : f
//         )
//       );

//       return prev.map((r, i) =>
//         i === index
//           ? {
//             ...r,
//             fileName: normalizedName,
//             confirmed: true,
//             needsConfirmation: false,
//           }
//           : r
//       );
//     });
//   };

//   /* ---------- UPLOAD ---------- */
//   const handleUpload = async () => {
//     if (!files.length) return;
//     setUploading(true);

//     try {
//       const formData = new FormData();
//       files.forEach((f) => formData.append("images", f));
//       formData.append("meta", JSON.stringify(tableData));

//       const res = await apiFetch("/printing/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) throw new Error("Upload failed");

//       socket.emit("notification", {
//         title: "Printing Upload",
//         message: `${user.name} uploaded printings`,
//       });

//       setFiles([]);
//       setThumbnails([]);
//       setTableData([]);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const hasUnconfirmed = tableData.some(
//     (row) => row.needsConfirmation && !row.confirmed
//   );

//   /* ---------- UI (UNCHANGED) ---------- */
//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen mt-16 bg-gray-100 p-6">
//         <div className="w-full lg:max-w-4xl mx-auto space-y-6 mb-10">
//           {/* file upload Session */}
//           <div className="bg-white rounded-xl shadow p-6">
//             <h2 className="text-xl font-semibold mb-4">Upload Print Files</h2>

//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               hidden
//               onChange={(e) => handleFiles(e.target.files)}
//             />

//             {thumbnails.length === 0 && (
//               <div
//                 onClick={() => fileInputRef.current.click()}
//                 onDrop={(e) => {
//                   e.preventDefault();
//                   handleFiles(e.dataTransfer.files);
//                 }}
//                 onDragOver={(e) => e.preventDefault()}
//                 className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition"
//               >
//                 <p className="text-gray-500 text-lg">
//                   Drag & Drop files or <span className="text-black font-medium">Click to upload</span>
//                 </p>
//                 <p className="text-sm text-gray-400 mt-2">
//                   Example: 2x3.jpg or 2feet x 3feet = 1 normal.jpg
//                 </p>
//               </div>
//             )}

//             {thumbnails.length > 0 && (
//               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
//                 {thumbnails.map((src, i) => (
//                   <img
//                     key={i}
//                     src={src}
//                     className="h-24 w-full object-cover rounded-lg border"
//                   />
//                 ))}
//               </div>
//             )}

//             <button
//               onClick={handleUpload}
//               disabled={uploading || hasUnconfirmed || !files.length}
//               className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50"
//             >
//               {hasUnconfirmed ? "Confirm all items first" : uploading ? "Uploading..." : "Upload Files"}
//             </button>
//           </div>
//         </div>

//         {/* <div className="space-y-4">
//           <div className="flex gap-2">
//             <h2 className="text-xl font-semibold">Selete Type</h2>
//             <select
//               value={fileTypes}
//               onChange={(e) => setFileTypes(e.target.value)}
//               className="border rounded px-2 py-1"
//             > <option value="Flex">Flex</option>
//               <option value="Visiting Card">Visiting Card</option>
//               <option value="Bill Book">Bill Book</option>
//               <option value="Menu Card">Menu Card</option>
//               <option value="Shadi Card">Shadi Card</option>
//             </select>
//           </div>
//           <h2 className="text-xl font-semibold">{fileTypes} Details</h2>

//           {fileTypes === "Flex" && tableData.map((item, i) =>
//             item.needsConfirmation && !item.confirmed ? (
//               <div
//                 key={i}
//                 className=" border border-yellow-300 rounded-lg p-4 shadow-sm"
//               >
//                 <p className="font-medium mb-3">
//                   ⚠️ Confirm details for <span className="font-mono">{item.fileName}</span>
//                 </p>

//                 <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
//                   <input
//                     type="number"
//                     value={item.width}
//                     onChange={(e) => updateRow(i, "width", +e.target.value)}
//                     className="border rounded px-2 py-1"
//                   />
//                   <input
//                     type="number"
//                     value={item.height}
//                     onChange={(e) => updateRow(i, "height", +e.target.value)}
//                     className="border rounded px-2 py-1"
//                   />
//                   <select
//                     value={item.unit}
//                     onChange={(e) => updateRow(i, "unit", e.target.value)}
//                     className="border rounded px-2 py-1"
//                   >
//                     <option value="feet">Feet</option>
//                     <option value="inch">Inch</option>
//                   </select>
//                   <input
//                     type="number"
//                     value={item.quantity}
//                     onChange={(e) => updateRow(i, "quantity", +e.target.value)}
//                     className="border rounded px-2 py-1"
//                   />
//                   <select
//                     value={item.sheet}
//                     onChange={(e) => updateRow(i, "sheet", e.target.value)}
//                     className="border rounded px-2 py-1"
//                   >
//                     <option value="normal">Normal</option>
//                     <option value="star">Star</option>
//                     <option value="vinyl">Vinyl</option>
//                     <option value="blackback">Blackback</option>
//                   </select>

//                   <button
//                     onClick={() => confirmRow(i)}
//                     className="bg-green-600 cursor-pointer text-white rounded px-3 py-1"
//                   >
//                     Confirm
//                   </button>
//                 </div>
//               </div>
//             ) : null
//           )}

//           {fileTypes !== "Flex" && tableData.map((item, i) =>
//             <div
//               key={i}
//               className=" border border-green-300 rounded-lg p-4 shadow-sm"
//             >
//               <p className="font-medium mb-3">
//                 ✅ {item.fileName} - Quantity: {item.quantity}, Type: {item.sheet}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 mt-6">
//           <h2 className="text-xl font-semibold mb-4">Print Summary</h2>

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-center border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-3 py-2">No.</th>
//                   <td className="border">Printing Type</td>
//                   {fileTypes === "Flex" && <div><th className="border px-3 py-2">Size</th>
//                     <th className="border px-3 py-2">SqFt</th>
//                     <th className="border px-3 py-2">Material</th></div>}
//                   <th className="border px-3 py-2">Qty</th>
//                   <th className="border px-3 py-2">Status</th>
//                   {fileTypes !== "Flex" && <th className="border px-3 py-2">front/Back</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {tableData.map((item, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="border">{i + 1}</td>
//                     <td className="border">{fileTypes}</td>
//                     {fileTypes === "Flex" && <div><td className="border">{item.size}</td>
//                       <td className="border">{item.squareFeet}</td>
//                       <td className="border capitalize">{item.sheet}</td></div>}
//                     <td className="border">{item.quantity}</td>
//                     {fileTypes !== "Flex" && <th className="border px-3 py-2">{item.fb}</th>}
//                     <td className="border">
//                       {item.confirmed ? (
//                         <span className="text-green-600 font-medium">Confirmed</span>
//                       ) : (
//                         <span className="text-yellow-600 font-medium">Pending</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div> */}

//         {fileTypes !== "" && <div className="space-y-4">
//           <div className="flex gap-2 items-center">
//             <h2 className="text-xl font-semibold">Select Type</h2>
//             <select
//               value={fileTypes}
//               onChange={(e) => setFileTypes(e.target.value)}
//               className="border rounded px-2 py-1"
//             >
//               <option value="Flex">Flex</option>
//               <option value="Visiting Card">Visiting Card</option>
//               <option value="Bill Book">Bill Book</option>
//               <option value="Menu Card">Menu Card</option>
//               <option value="Shadi Card">Shadi Card</option>
//             </select>
//           </div>

//           <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
//             <table className="w-full text-sm text-center border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="border px-2 py-2">No</th>
//                   <th className="border px-2 py-2">File</th>

//                   {fileTypes === "Flex" && (
//                     <>
//                       <th className="border px-2 py-2">Width</th>
//                       <th className="border px-2 py-2">Height</th>
//                       <th className="border px-2 py-2">Unit</th>
//                       <th className="border px-2 py-2">Material</th>
//                       <th className="border px-2 py-2">SqFt</th>
//                     </>
//                   )}

//                   <th className="border px-2 py-2">Qty</th>

//                   {fileTypes !== "Flex" && (
//                     <th className="border px-2 py-2">Front/Back</th>
//                   )}

//                   <th className="border px-2 py-2">Status</th>
//                   <th className="border px-2 py-2">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {tableData.map((item, i) => (
//                   <tr key={i} className="hover:bg-gray-50">
//                     <td className="border">{i + 1}</td>
//                     <td className="border font-mono">{item.fileName}</td>

//                     {/* FLEX EDITABLE COLUMNS */}
//                     {fileTypes === "Flex" && (
//                       <>
//                         <td className="border">
//                           <input
//                             type="number"
//                             value={item.width}
//                             disabled={item.confirmed}
//                             onChange={(e) =>
//                               updateRow(i, "width", +e.target.value)
//                             }
//                             className="w-16 border rounded px-1"
//                           />
//                         </td>

//                         <td className="border">
//                           <input
//                             type="number"
//                             value={item.height}
//                             disabled={item.confirmed}
//                             onChange={(e) =>
//                               updateRow(i, "height", +e.target.value)
//                             }
//                             className="w-16 border rounded px-1"
//                           />
//                         </td>

//                         <td className="border">
//                           <select
//                             value={item.unit}
//                             disabled={item.confirmed}
//                             onChange={(e) =>
//                               updateRow(i, "unit", e.target.value)
//                             }
//                             className="border rounded px-1"
//                           >
//                             <option value="feet">Feet</option>
//                             <option value="inch">Inch</option>
//                           </select>
//                         </td>

//                         <td className="border capitalize">
//                           <select
//                             value={item.sheet}
//                             disabled={item.confirmed}
//                             onChange={(e) =>
//                               updateRow(i, "sheet", e.target.value)
//                             }
//                             className="border rounded px-1"
//                           >
//                             <option value="normal">Normal</option>
//                             <option value="star">Star</option>
//                             <option value="vinyl">Vinyl</option>
//                             <option value="blackback">Blackback</option>
//                           </select>
//                         </td>

//                         <td className="border">{item.squareFeet}</td>
//                       </>
//                     )}

//                     {/* COMMON */}
//                     <td className="border">
//                       <input
//                         type="number"
//                         value={item.quantity}
//                         disabled={item.confirmed}
//                         onChange={(e) =>
//                           updateRow(i, "quantity", +e.target.value)
//                         }
//                         className="w-16 border rounded px-1"
//                       />
//                     </td>

//                     {/* NON FLEX */}
//                     {fileTypes !== "Flex" && (
//                       <td className="border">{item.fb}</td>
//                     )}

//                     <td className="border">
//                       {item.confirmed ? (
//                         <span className="text-green-600 font-medium">
//                           Confirmed
//                         </span>
//                       ) : (
//                         <span className="text-yellow-600 font-medium">
//                           Pending
//                         </span>
//                       )}
//                     </td>

//                     <td className="border">
//                       {!item.confirmed && (
//                         <button
//                           onClick={() => confirmRow(i)}
//                           className="bg-green-600 text-white px-3 py-1 rounded text-xs"
//                         >
//                           Confirm
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         }

//       </div>
//     </> 
//   );
// };

// export default UploadPrinting;



import React, { useState, useRef, useEffect } from "react";
import socketIO from "socket.io-client";
import Navbar from "./global/Navbar";
import { SOCKET_URI } from "../uri/uril";
import { apiFetch } from "../src/hooks/fetchInstance";
import useStore from "../store/store";
import "./style.css";

const ENDPOINT = SOCKET_URI || "";
let socket;

/* ---------- REGEX ---------- */
const FLEX_REGEX =
  /^(\d+(?:\.\d+)?)(?:\s*(feet|inch|cm))?\s*x\s*(\d+(?:\.\d+)?)(?:\s*(feet|inch|cm))?\s*=\s*(\d+)\s*(normal|bb|vinyl|star|one way|backlet)\.jpg$/i;

const SIMPLE_REGEX =
  /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)(?:\s*=\s*(\d+))?(?:.*)?\.jpg$/i;

const CARD_REGEX =
  /^(?:.*=)?\s*(\d+)\s*(single|double)\.jpg$/i;

/* ---------- CONSTANTS ---------- */
const UNIT_OPTIONS = ["feet", "inch", "cm"];
const MATERIAL_OPTIONS = ["normal", "bb", "one way", "vinyl", "star", "backlet"];

/* ---------- HELPERS ---------- */
const calcSqFt = (w, h, unit) => {
  let factor = 1;
  if (unit === "inch") factor = 1 / 12;
  if (unit === "cm") factor = 0.0328084; // cm to feet
  return +(w * factor * h * factor).toFixed(2);
};

const normalizeFileName = ({ width, height, unit, quantity, sheet }) =>
  `${width}${unit}x${height}${unit}=${quantity}${sheet}.jpg`;

const UploadPrinting = () => {
  const [files, setFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);
  const user = useStore((s) => s.user);

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    return () => socket.disconnect();
  }, []);

  /* ---------- FILE HANDLER ---------- */
  const handleFiles = (fileList) => {
    Array.from(fileList).forEach((file) => {
      const full = file.name.match(FLEX_REGEX);
      const simple = file.name.match(SIMPLE_REGEX);
      const card = file.name.match(CARD_REGEX);

      // ✅ FULL FLEX
      if (full) {
        setFileType("Flex");
        const width = +full[1];
        const height = +full[3];
        const unit = full[2] || full[4] || "feet";
        const quantity = +full[5];
        const sheet = full[6].toLowerCase();

        setTableData((p) => [
          ...p,
          {
            type: fileType,
            fileName: file.name,
            width,
            height,
            unit,
            quantity,
            sheet,
            squareFeet: calcSqFt(width, height, unit),
            confirmed: true,
            editable: false,
          },
        ]);
      }

      // ✅ SIMPLE FLEX (needs confirm)
      else if (simple) {
        setFileType("Flex");
        const width = +simple[1];
        const height = +simple[2];
        const quantity = simple[3] ? +simple[3] : 1;

        setTableData((p) => [
          ...p,
          {
            type: fileType,
            fileName: file.name,
            width,
            height,
            unit: "feet",
            quantity,
            sheet: "normal",
            squareFeet: calcSqFt(width, height, "feet"),
            confirmed: false,
            editable: true,
          },
        ]);
      }

      // ✅ CARD
      else if (card) {
        setFileType("Visiting Card");

        setTableData((p) => [
          ...p,
          {
            fileName: file.name,
            quantity: +card[1],
            fb: card[2],
            confirmed: true,
            editable: false,
          },
        ]);
      }

      setFiles((p) => [...p, file]);
      setThumbnails((p) => [...p, URL.createObjectURL(file)]);
    });
  };

  /* ---------- DRAG EVENTS ---------- */
  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  /* ---------- UPDATE ROW ---------- */
  const updateRow = (index, field, value) => {
    setTableData((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const updated = { ...row, [field]: value };

        if (fileType === "Flex") {
          updated.squareFeet = calcSqFt(updated.width, updated.height, updated.unit);
        }
        return updated;
      })
    );
  };

  /* ---------- CONFIRM / EDIT ---------- */
  const confirmRow = (index) => {
    setTableData((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const newName = normalizeFileName(row);

        setFiles((f) =>
          f.map((file, fi) =>
            fi === index ? new File([file], newName, { type: file.type }) : file
          )
        );

        return { ...row, fileName: newName, confirmed: true, editable: false };
      })
    );
  };

  const editRow = (index) => {
    setTableData((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, confirmed: false, editable: true } : row
      )
    );
  };

  const hasUnconfirmed = tableData.some((r) => !r.confirmed);

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

      if (!res.ok) throw new Error();

      socket.emit("notification", {
        title: "Printing Upload",
        message: `${user.name} uploaded printings`,
      });

      setFiles([]);
      setThumbnails([]);
      setTableData([]);
      setFileType("");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <>
      <Navbar />

      <div className="min-h-screen mt-16 bg-gray-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* UPLOAD BOX */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Upload Print Files</h2>
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, TIFF. Max size 50MB.
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* DROP ZONE */}
            {thumbnails.length === 0 ? (
              <div
                onClick={() => fileInputRef.current.click()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFiles(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                className="flex-1 flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 cursor-pointer group"
              >
                <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200">
                  <svg
                    className="w-8 h-8 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium text-lg">
                  Click to upload or drag & drop
                </p>
                <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                  Naming convention: <br />
                  <code className="bg-gray-200 text-gray-700 px-1 py-0.5 rounded text-xs">Width x Height.jpg</code>
                </p>
              </div>
            ) : (
              /* THUMBNAIL GRID */
              <div className="flex-1 overflow-y-auto max-h-[300px] p-1">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {thumbnails.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <img
                        src={src}
                        className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                        alt={`preview-${i}`}
                      />
                      {/* Optional: Add a "Remove" X button overlay here if you have a remove function */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none" />
                    </div>
                  ))}

                  {/* 'Add More' Button within grid */}
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs font-medium">Add More</span>
                  </button>
                </div>
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="mt-6">
              <button
                onClick={handleUpload}
                disabled={uploading || hasUnconfirmed || !files.length}
                className={`w-full py-3.5 rounded-lg font-medium shadow-sm flex items-center justify-center gap-2 transition-all duration-200
        ${!files.length
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : hasUnconfirmed
                      ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200 cursor-not-allowed"
                      : uploading
                        ? "bg-blue-500 text-white opacity-90 cursor-wait"
                        : "bg-black hover:bg-gray-800 text-white active:scale-[0.99]"
                  }
      `}
              >
                {uploading && (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}

                {uploading
                  ? "Processing..."
                  : hasUnconfirmed
                    ? "⚠️ Confirm all file details first"
                    : "Upload Files Now"
                }
              </button>
            </div>
          </div>


          {/* TABLE */}
          {fileType === "Flex" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <h1 className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">Printing : {fileType}</h1>
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 w-12 text-center">#</th>
                      <th className="px-4 py-3 min-w-[140px]">File Name</th>
                      <th className="px-4 py-3 w-24">Width</th>
                      <th className="px-4 py-3 w-24">Height</th>
                      <th className="px-4 py-3 w-24">Unit</th>
                      <th className="px-4 py-3 min-w-[120px]">Material</th>
                      <th className="px-4 py-3 w-20 text-right">SqFt</th>
                      <th className="px-4 py-3 w-20 text-center">Qty</th>
                      <th className="px-4 py-3 w-28 text-center">Status</th>
                      <th className="px-4 py-3 w-24 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {tableData.map((row, i) => (
                      <tr
                        key={i}
                        className={`transition-colors duration-150 ${row.editable ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-4 py-3 text-center text-gray-400">{i + 1}</td>

                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded truncate max-w-[150px] block" title={row.fileName}>
                            {row.fileName}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none ${row.editable
                              ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                              : "bg-transparent border-transparent text-gray-600"
                              }`}
                            value={row.width}
                            disabled={!row.editable}
                            onChange={(e) => updateRow(i, "width", +e.target.value)}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none ${row.editable
                              ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                              : "bg-transparent border-transparent text-gray-600"
                              }`}
                            value={row.height}
                            disabled={!row.editable}
                            onChange={(e) => updateRow(i, "height", +e.target.value)}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <select
                            className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none cursor-pointer ${row.editable
                              ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                              : "bg-transparent border-transparent text-gray-600 appearance-none pointer-events-none"
                              }`}
                            value={row.unit}
                            disabled={!row.editable}
                            onChange={(e) => updateRow(i, "unit", e.target.value)}
                          >
                            {UNIT_OPTIONS.map((u) => (
                              <option key={u} value={u}>{u}</option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-3">
                          <select
                            className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none cursor-pointer capitalize ${row.editable
                              ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                              : "bg-transparent border-transparent text-gray-600 appearance-none pointer-events-none"
                              }`}
                            value={row.sheet}
                            disabled={!row.editable}
                            onChange={(e) => updateRow(i, "sheet", e.target.value)}
                          >
                            {MATERIAL_OPTIONS.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </td>

                        <td className="px-4 py-3 text-right font-medium text-gray-600">
                          {row.squareFeet}
                        </td>

                        <td className="px-4 py-3">
                          <input
                            type="number"
                            className={`w-full text-center text-sm px-1 py-1.5 rounded transition-all outline-none ${row.editable
                              ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100 font-bold text-blue-600"
                              : "bg-transparent border-transparent text-gray-600"
                              }`}
                            value={row.quantity}
                            disabled={!row.editable}
                            onChange={(e) => updateRow(i, "quantity", +e.target.value)}
                          />
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.confirmed
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {row.confirmed ? "Confirmed" : "Editing"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center">
                          {row.confirmed ? (
                            <button
                              onClick={() => editRow(i)}
                              className="text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium underline decoration-dashed underline-offset-4"
                            >
                              Modify
                            </button>
                          ) : (
                            <button
                              onClick={() => confirmRow(i)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium shadow-sm transition-all transform active:scale-95"
                            >
                              Save
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tableData.length === 0 && (
                  <div className="p-8 text-center text-gray-400 bg-gray-50">
                    No files added yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {fileType !== "Flex" && fileType !== "" && <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <h1 className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">Printing : {fileType}</h1>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3 min-w-[140px]">File Name</th>
                    <th className="px-4 py-3 w-24">Unit</th>
                    <th className="px-4 py-3 min-w-[120px]">Material</th>
                    <th className="px-4 py-3 w-20 text-center">Qty</th>
                    <th className="px-4 py-3 w-28 text-center">Status</th>
                    <th className="px-4 py-3 w-24 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {tableData.map((row, i) => (
                    <tr
                      key={i}
                      className={`transition-colors duration-150 ${row.editable ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-4 py-3 text-center text-gray-400">{i + 1}</td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded truncate max-w-[150px] block" title={row.fileName}>
                          {row.fileName}
                        </span>
                      </td>


                      <td className="px-4 py-3">
                        <select
                          className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none cursor-pointer ${row.editable
                            ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                            : "bg-transparent border-transparent text-gray-600 appearance-none pointer-events-none"
                            }`}
                          value={row.unit}
                          disabled={!row.editable}
                          onChange={(e) => updateRow(i, "unit", e.target.value)}
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <select
                          className={`w-full text-sm px-2 py-1.5 rounded transition-all outline-none cursor-pointer capitalize ${row.editable
                            ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100"
                            : "bg-transparent border-transparent text-gray-600 appearance-none pointer-events-none"
                            }`}
                          value={row.sheet}
                          disabled={!row.editable}
                          onChange={(e) => updateRow(i, "sheet", e.target.value)}
                        >
                          {MATERIAL_OPTIONS.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </td>



                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className={`w-full text-center text-sm px-1 py-1.5 rounded transition-all outline-none ${row.editable
                            ? "bg-white border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-100 font-bold text-blue-600"
                            : "bg-transparent border-transparent text-gray-600"
                            }`}
                          value={row.quantity}
                          disabled={!row.editable}
                          onChange={(e) => updateRow(i, "quantity", +e.target.value)}
                        />
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.confirmed
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {row.confirmed ? "Confirmed" : "Editing"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        {row.confirmed ? (
                          <button
                            onClick={() => editRow(i)}
                            className="text-gray-400 hover:text-blue-600 transition-colors text-sm font-medium underline decoration-dashed underline-offset-4"
                          >
                            Modify
                          </button>
                        ) : (
                          <button
                            onClick={() => confirmRow(i)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-medium shadow-sm transition-all transform active:scale-95"
                          >
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {tableData.length === 0 && (
                <div className="p-8 text-center text-gray-400 bg-gray-50">
                  No files added yet.
                </div>
              )}
            </div>
          </div>}

        </div>
      </div>
    </>
  );
};

export default UploadPrinting;


