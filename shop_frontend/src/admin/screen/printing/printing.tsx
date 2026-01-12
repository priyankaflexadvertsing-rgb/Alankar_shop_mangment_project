import DashboardWrapper from "../../dashBoardWarpper";
import { apiFetch } from "../../../hooks/fetchInstance";
import { useEffect, useMemo, useState } from "react";
import { SOCKET_URI } from "../../../../uri/uril";

const category = ["visting card", "flex", "LetterPad", "bill book"];

const Printing = () => {
  const [prints, setPrints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [oldData, setOldData] = useState(false);

  /* ------------------ Image Download Helper ------------------ */
  const downloadImage = async (
    imageUrl: string,
    fileName: string,
    id: string
  ) => {
    try {
      const res = await apiFetch(`/updateprintingStatus/${id}`, {
        method: "PATCH",
      });

      const response = await fetch(imageUrl, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName || "download";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      /* ✅ Update status AFTER successful download */
      const data = await res.json();
      setPrints(data.prints || []);
    } catch (error) {
      console.error("Image download failed:", error);
      alert("Image download failed.");
    }
  };

  /* ------------------ Date Helpers ------------------ */
  const isToday = (date: Date) =>
    date.toDateString() === new Date().toDateString();

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const formatDateTime = (timestamp: string | number) =>
    timestamp ? new Date(timestamp).toLocaleString() : "-";

  /* ------------------ Fetch Prints ------------------ */
  const printing = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/allprinting");
      const data = await res.json();
      setPrints(data.prints || []);
    } catch (error) {
      console.error("Failed to fetch prints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    printing();
  }, []);

  /* ------------------ Group Data ------------------ */
  const { today, yesterday, older } = useMemo(() => {
    const todayArr: any[] = [];
    const yesterdayArr: any[] = [];
    const olderArr: any[] = [];

    prints.forEach((item) => {
      const date = new Date(item.createdAt);
      if (isToday(date)) todayArr.push(item);
      else if (isYesterday(date)) yesterdayArr.push(item);
      else olderArr.push(item);
    });

    return { today: todayArr, yesterday: yesterdayArr, older: olderArr };
  }, [prints]);

  /* ------------------ Row Component ------------------ */
  const PrintRow = ({ it, idx }: { it: any; idx: number }) => {
    const fileName = it.originalfilePath?.split(/[/\\]/).pop() || "";

    if (!fileName) return null;

    const imageUrl = `${SOCKET_URI}/original_printing/${encodeURIComponent(
      fileName
    )}`;
    return (
      <div>
        <div className="bg-gray-800 hover:bg-gray-750 transition rounded-lg p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 w-6">{idx + 1}</span>

            <img
              src={imageUrl}
              alt="Print preview"
              className="w-16 h-16 object-cover rounded-md border border-gray-700"
            />

            <div>
              <h5 className="text-lg text-gray-300">
                {it.user?.name}
                <span className="block text-sm text-gray-400">
                  {it.user?.email}
                </span>
              </h5>

              <p className="text-sm text-gray-300">
                {formatDateTime(it.createdAt)}
              </p>

              <p className="text-xs text-gray-500">
                Status:{" "}
                <span className="text-white font-medium">{it.status}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => downloadImage(imageUrl, fileName, it._id)}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-sm px-4 py-2 rounded-md font-medium transition"
          >
            Download
          </button>
        </div>
      </div>
    );
  };

  /* ------------------ UI ------------------ */
  return (
    <DashboardWrapper>
      <div className="space-y-8 m-5">
        <div className="flex gap-4   rounded-lg">
          {category.map((item, idx) => (
            <div
              key={idx}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded shadow hover:bg-blue-100 dark:hover:bg-blue-600 cursor-pointer transition"
            >
              {item}
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}

        {!loading && prints.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No print records found
          </div>
        )}

        {!loading && today.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-green-400 mb-3">Today</h2>
            {today.map((it, idx) => (
              <PrintRow key={it._id} it={it} idx={idx} />
            ))}
          </section>
        )}

        {!loading && yesterday.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-yellow-400 mb-3">
              Yesterday
            </h2>
            {yesterday.map((it, idx) => (
              <PrintRow key={it._id} it={it} idx={idx} />
            ))}
          </section>
        )}

        {!loading && older.length > 0 && (
          <section>
            <h2
              className="text-lg font-semibold cursor-pointer text-red-500 mb-3"
              onClick={() => setOldData(!oldData)}
            >
              Older {oldData ? "▲" : "▼"}
            </h2>

            {oldData &&
              older.map((it, idx) => (
                <PrintRow key={it._id} it={it} idx={idx} />
              ))}
          </section>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default Printing;
