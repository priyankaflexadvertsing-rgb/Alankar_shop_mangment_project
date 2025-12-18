import { useState } from "react";
import GeotiffViewer from "./TiffViewer";

export const getFileName = (path) => path.split(/[/\\]/).pop();

export const convertPrintingToFiles = (printing) => {
  if (!printing || !Array.isArray(printing)) return [];
  return printing.map(item => getFileName(item.compressedfilePath));
};

export const FileViewer = ({ files, name }) => {
  console.log(files);
  
  const [selectedFiles, setSelectedFiles] = useState([]);

  const isTiff = (filename) => /\.(tif|tiff)$/i.test(filename);

  

  const title = name
    ? `${name.replace(".json", "")}'s Files`
    : "All Files";

  // CLICK SELECTION (Ctrl / Shift / Single)
  const handleFileClick = (file, e) => {
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection
      setSelectedFiles((prev) =>
        prev.includes(file)
          ? prev.filter((f) => f !== file)
          : [...prev, file]
      );
    } else if (e.shiftKey && selectedFiles.length > 0) {
      const lastIndex = files.indexOf(
        selectedFiles[selectedFiles.length - 1]
      );
      const currentIndex = files.indexOf(file);
      const [start, end] =
        lastIndex < currentIndex
          ? [lastIndex, currentIndex]
          : [currentIndex, lastIndex];

      const range = files.slice(start, end + 1);
      setSelectedFiles([...new Set([...selectedFiles, ...range])]);
    } else {
      // Single selection
      setSelectedFiles([file]);
    }
  };

  // DRAGGING
  const handleDragStart = (e, file) => {
    const draggedFiles = selectedFiles.includes(file)
      ? selectedFiles
      : [file];

    e.dataTransfer.setData("text/plain", JSON.stringify(draggedFiles));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className=" overflow-auto  p-2">
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {files.map((file, i) => {
          const fileUrl = `http://localhost:8000/thumbnails/${encodeURIComponent(file)}`;
          const isSelected = selectedFiles.includes(file);

          return (
            <div
              key={i}
              className={`p-1 rounded cursor-pointer ${isSelected ? "ring-4 ring-blue-500" : ""
                }`}
              onClick={(e) => handleFileClick(file, e)}
              draggable
              onDragStart={(e) => handleDragStart(e, file)}
            >
              {isTiff(file) ? (
                <GeotiffViewer src={fileUrl} width={80} height={80} />
              ) : (
                <img
                  src={fileUrl}
                  alt={file}
                  className="w-[80px] h-[80px] object-cover rounded shadow-lg cursor-move"
                />
              )}

              <p className="text-[13px] text-center text-black mt-1">{i + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
