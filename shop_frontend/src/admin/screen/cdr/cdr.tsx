import DashboardWrapper from "../../dashBoardWarpper";
import { apiFetch } from "../../../hooks/fetchInstance";
import { useEffect, useMemo, useState } from "react";
import { SOCKET_URI } from "../../../../uri/uril";

/* =======================
   TYPES
======================= */
interface Category {
  _id?: string;
  name: string;
  description?: string;
}

/* =======================
   COMPONENT
======================= */
const Product = () => {
  const [prints, setPrints] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  /* -------- Category Modal -------- */
  const [openModal, setOpenModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  /* =======================
     FETCH PRINTS
  ======================= */
  const fetchPrints = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/allprinting");
      const data = await res.json();
      setPrints(data.prints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     FETCH CATEGORIES
  ======================= */
  const fetchCategories = async () => {
    try {
      const res = await apiFetch("/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Failed to load categories");
    }
  };

  /* =======================
     CREATE CATEGORY
  ======================= */
  const createCategory = async () => {
    if (!catName.trim()) return alert("Category name required");

    try {
      const res = await apiFetch("/category", {
        method: "POST",
        body: JSON.stringify({
          name: catName,
          description: catDesc,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCategories((prev) => [...prev, data.data]);
        setOpenModal(false);
        setCatName("");
        setCatDesc("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrints();
    fetchCategories();
  }, []);

  /* =======================
     DATE GROUPING
  ======================= */
  const isToday = (d: Date) =>
    d.toDateString() === new Date().toDateString();

  const isYesterday = (d: Date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
  };

  const { today, yesterday, older } = useMemo(() => {
    const t: any[] = [];
    const y: any[] = [];
    const o: any[] = [];

    prints.forEach((p) => {
      const d = new Date(p.createdAt);
      if (isToday(d)) t.push(p);
      else if (isYesterday(d)) y.push(p);
      else o.push(p);
    });

    return { today: t, yesterday: y, older: o };
  }, [prints]);

  /* =======================
     ROW
  ======================= */
  const PrintRow = ({ it, idx }: any) => {
    const fileName = it.originalfilePath?.split(/[/\\]/).pop();
    if (!fileName) return null;

    const imageUrl = `${SOCKET_URI}/original_printing/${encodeURIComponent(
      fileName
    )}`;

    return (
      <div className="bg-gray-800 rounded-lg p-4 flex justify-between">
        <div className="flex gap-4">
          <span>{idx + 1}</span>
          <img src={imageUrl} className="w-14 h-14 rounded" />
          <div>
            <p>{it.user?.name}</p>
            <p className="text-xs text-gray-400">{it.user?.email}</p>
          </div>
        </div>
      </div>
    );
  };

  /* =======================
     UI
  ======================= */
  return (
    <DashboardWrapper>
      <div className="m-5 space-y-6">

        {/* Category Header */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="px-4 py-2 bg-gray-700 rounded cursor-pointer"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 cursor-pointer px-4 py-2 rounded"
          >
            + Create Category
          </button>
        </div>

        {/* Prints */}
        {loading && <p>Loading...</p>}

        {!loading && today.length > 0 && (
          <section>
            <h2 className="text-green-400 mb-2">Today</h2>
            {today.map((it, i) => (
              <PrintRow key={it._id} it={it} idx={i} />
            ))}
          </section>
        )}

        {!loading && yesterday.length > 0 && (
          <section>
            <h2 className="text-yellow-400 mb-2">Yesterday</h2>
            {yesterday.map((it, i) => (
              <PrintRow key={it._id} it={it} idx={i} />
            ))}
          </section>
        )}

        {!loading && older.length > 0 && (
          <section>
            <h2 className="text-gray-400 mb-2">Older</h2>
            {older.map((it, i) => (
              <PrintRow key={it._id} it={it} idx={i} />
            ))}
          </section>
        )}
      </div>

      {/* ===================
         CREATE CATEGORY MODAL
      =================== */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded w-96 space-y-4">
            <h3 className="text-lg font-semibold">Create Category</h3>

            <input
              placeholder="Category name"
              className="w-full p-2 rounded bg-gray-700"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              className="w-full p-2 rounded bg-gray-700"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpenModal(false)}>Cancel</button>
              <button
                onClick={createCategory}
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardWrapper>
  );
};

export default Product;
