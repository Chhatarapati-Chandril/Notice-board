// src/pages/PostNotice.jsx
import React, { useEffect, useState } from "react";
import HomeNav from "../components/HomeNav";
import { useNavigate } from "react-router-dom";
import axios from "../redux/api";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

function PostNotice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    content: "",
    is_public: true,
    files: [],
  });

  /* =======================
     Fetch categories (BACKEND)
  ======================= */
  useEffect(() => {
    axios
      .get("/noticeboard/categories", { withCredentials: true })
      .then((res) => setCategories(res.data.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load categories");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert("Maximum 5 files allowed");
      e.target.value = "";
      return;
    }

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Unsupported file type: ${file.name}`);
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File too large (max ${MAX_FILE_SIZE_MB}MB): ${file.name}`);
        e.target.value = "";
        return;
      }
    }

    setForm((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.title.trim()) return alert("Title is required");
    if (!form.categoryId) return alert("Category is required");
    if (!form.content.trim()) return alert("Content is required");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title.trim());
      formData.append("content", form.content.trim());
      formData.append("categoryId", form.categoryId);
      formData.append("is_public", form.is_public ? "1" : "0");

      form.files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post("/noticeboard/notices", formData, {
        withCredentials: true,
      });

      alert(res.data.message || "Notice posted successfully");
      navigate("/noticeboard", { replace: true });
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Failed to post notice. Professor access required."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HomeNav title="Post Notice" />

      <div className="flex h-screen bg-[#46494A] pt-20">
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-blue-600 mb-6">
              Post a New Notice
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* TITLE */}
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Notice title"
                className="w-full border px-4 py-2 rounded-md"
                required
              />

              {/* CATEGORY (BACKEND-DRIVEN) */}
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* CONTENT */}
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="8"
                placeholder="Notice content..."
                className="w-full border px-4 py-2 rounded-md"
                required
              />

              {/* PUBLIC */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={form.is_public}
                  onChange={handleChange}
                />
                Make notice public
              </label>

              {/* FILES */}
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full border px-4 py-2 rounded-md"
              />

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? "Publishing…" : "Publish"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/noticeboard")}
                  className="bg-gray-200 px-6 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostNotice;
