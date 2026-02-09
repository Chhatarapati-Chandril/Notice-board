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
    audience: "PUBLIC", // ✅ audience
    files: [],
  });

  /* =======================
     Fetch categories
  ======================= */
  useEffect(() => {
    axios
      .get("/noticeboard/categories", { withCredentials: true })
      .then((res) => setCategories(res.data.data))
      .catch(() => alert("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
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

    setForm((p) => ({ ...p, files }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  if (!form.title.trim()) return alert("Title is required");
  if (!form.categoryId) return alert("Category is required");

  const hasContent = form.content && form.content.trim() !== "";
  const hasFiles = form.files && form.files.length > 0;

  if (!hasContent && !hasFiles) {
    return alert("Add content or at least one attachment");
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("categoryId", form.categoryId);
    formData.append("audience", form.audience);

    if (hasContent) {
      formData.append("content", form.content.trim());
    }

    form.files.forEach((f) => formData.append("files", f));

    const res = await axios.post("/noticeboard/notices", formData, {
      withCredentials: true,
    });

    alert(res.data.message || "Notice posted successfully");
    navigate("/noticeboard", { replace: true });
  } catch (err) {
    alert(
      err.response?.data?.message ||
        "Failed to post notice. Admin access required."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <HomeNav title="Post Notice" />

      <div className="flex min-h-screen bg-[#f3f5f9] pt-20">
        <div className="flex-1 p-8 overflow-auto">
          <div
            className="
              bg-white rounded-xl
              shadow-[0_10px_30px_rgba(30,90,168,0.15)]
              p-8 max-w-3xl mx-auto
            "
          >
            <h2 className="text-2xl font-bold text-[#0f2a44] mb-6">
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
                className="
                  w-full border border-gray-300
                  px-4 py-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                "
                required
              />

              {/* CATEGORY */}
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="
                  w-full border border-gray-300
                  px-4 py-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                "
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* AUDIENCE */}
              <select
                name="audience"
                value={form.audience}
                onChange={handleChange}
                className="
                  w-full border border-gray-300
                  px-4 py-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                "
                required
              >
                <option value="PUBLIC">Public</option>
                <option value="STUDENTS">Students only</option>
                <option value="PROFESSORS">Professors only</option>
                <option value="BOTH">Students & Professors</option>
              </select>

              {/* CONTENT */}
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="8"
                placeholder="Write the notice content here..."
                className="
                  w-full border border-gray-300
                  px-4 py-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-200
                "
              />

              {/* FILES */}
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="
                  w-full border border-gray-300
                  px-4 py-2 rounded-lg
                "
              />

              {/* ACTIONS */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    bg-[#1e5aa8] text-white
                    px-6 py-2 rounded-lg
                    shadow-sm
                    hover:bg-[#174a8a]
                    disabled:opacity-50
                  "
                >
                  {loading ? "Publishing…" : "Publish"}
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate("/noticeboard")}
                  className="
                    bg-gray-200 text-gray-700
                    px-6 py-2 rounded-lg
                    hover:bg-gray-300
                  "
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