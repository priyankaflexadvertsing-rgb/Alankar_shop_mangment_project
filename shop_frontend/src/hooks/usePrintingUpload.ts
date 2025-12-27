import { useState } from "react";


export const usePrintingUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const upload = async (files:any) => {
    if (!files.length) return null;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    files.forEach((file:any) => formData.append("images", file));

    try {
      const res:any = await apiFetch("/printing/upload", {
        method: "POST",
        body: formData,
        onUploadProgress: (e) => {
          if (e.total) {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      });

      if (!res.ok) throw new Error("Upload failed");
      return await res.json();
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress };
};
function apiFetch(arg0: string, arg1: { method: string; body: FormData; onUploadProgress: (e: any) => void; }) {
  throw new Error("Function not implemented.");
}

