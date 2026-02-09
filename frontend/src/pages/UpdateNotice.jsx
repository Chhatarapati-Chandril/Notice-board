import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../redux/api";
import HomeNav from "../components/HomeNav";

export default function UpdateNotice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
    audience: "",
  });

  // 🚫 Role guard
  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/unauthorized", { replace: true });
    }
  }, [role, navigate]);

  // 🔄 Load notice + categories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [noticeRes, categoryRes] = await Promise.all([
          api.get(`/noticeboard/notices/${id}`),
          api.get("/noticeboard/categories"),
        ]);

        const notice = noticeRes.data.data;

        setForm({
          title: notice.title ?? "",
          content: notice.content ?? "",
          categoryId: notice.category_id, // ✅ actual selected category
          audience: notice.audience,       // ✅ actual selected audience
        });

        setCategories(categoryRes.data.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        alert("Failed to load notice");
        navigate("/noticeboard", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required");
      return;
    }

    setSaving(true);

    try {
      await api.patch(`/noticeboard/notices/${id}`, {
        title: form.title,
        content: form.content,
        categoryId: form.categoryId,
        audience: form.audience,
      });

      alert("Notice updated successfully");
      navigate("/noticeboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update notice");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading…
      </div>
    );
  }

  return (
    <>
      <HomeNav title="Update Notice" />

      <div className="min-h-screen bg-[#f3f5f9] pt-24 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl space-y-5"
        >
          <h2 className="text-2xl font-bold text-[#1e5aa8]">
            Edit Notice
          </h2>

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={6}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* AUDIENCE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Audience
            </label>
            <select
  name="audience"
  value={form.audience}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded"
>
  <option value="PUBLIC">Public</option>
  <option value="BOTH">Both (Students & Professors)</option>
  <option value="STUDENT">Students</option>
  <option value="PROFESSOR">Professors</option>
</select>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#1e5aa8] text-white px-6 py-2 rounded hover:bg-[#174a8a]"
            >
              {saving ? "Updating…" : "Update Notice"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/noticeboard")}
              className="border px-6 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}