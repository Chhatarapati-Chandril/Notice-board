import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotice } from "../redux/noticeSlice";
import HomeNav from "../components/HomeNav";
import { useNavigate } from "react-router-dom";

function PostNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    department: "",
    content: "",
    file: null,
    visibility: "Public", // 🔹 default visibility
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.department || !form.content) {
      alert("Please fill all required fields");
      return;
    }

    // 🔹 Automatically set today's date
    const today = new Date().toISOString().split("T")[0];

    dispatch(
      addNotice({
        from: form.department,
        notice: form.title,
        content: form.content,
        date: today,
        visibility: form.visibility,
      })
    );

    // ✅ Redirect to NoticeBoard
    navigate("/noticeboard");
  };

  return (
    <>
      <HomeNav title="Post Notice" />

      <div className="flex h-screen bg-[#46494A] pt-20">
        <div className="flex-1 p-8">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto">

            <h2 className="text-2xl font-semibold text-blue-600 mb-6">
              Post a New Notice
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* TITLE */}
              <input
                type="text"
                name="title"
                placeholder="Notice Title"
                className="w-full border px-4 py-2 rounded-md"
                onChange={handleChange}
              />

              {/* DEPARTMENT */}
              <select
                name="department"
                className="w-full border px-4 py-2 rounded-md"
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option>Examination Cell</option>
                <option>Training & Placement Cell</option>
                <option>Central Library</option>
                <option>Technical Society</option>
                <option>Sports Club</option>
                <option>Student Council</option>
                <option>NSS</option>
                <option>General</option>
              </select>

              {/* CONTENT */}
              <textarea
                name="content"
                rows="5"
                placeholder="Notice content..."
                className="w-full border px-4 py-2 rounded-md"
                onChange={handleChange}
              />

              {/* FILE UPLOAD */}
              <input
                type="file"
                className="w-full border px-4 py-2 rounded-md"
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files[0] })
                }
              />

              {/* VISIBILITY */}
              <div className="flex items-center gap-6">
                <span className="font-medium text-gray-700">Visibility:</span>
                
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="Public"
                    checked={form.visibility === "Public"}
                    onChange={handleChange}
                  />
                  Public
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="Private"
                    checked={form.visibility === "Private"}
                    onChange={handleChange}
                  />
                  Private
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Publish Notice
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostNotice;
