import React, { useEffect, useState, useCallback } from "react";
import HomeNav from "../components/HomeNav";
import NoticeSidebar from "../components/NoticeSidebar";
import axios from "../redux/api";
import { getCategoryBadgeClass } from "../constants/categoryColors";
import {
  FaBookmark,
  FaRegBookmark,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [limit, setLimit] = useState(10);

  const { role, isAuthenticated } = useSelector((state) => state.auth);

  const [selected, setSelected] = useState({
    name: "All Notices",
    id: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("noticeBookmarks")) || [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();
  const handlePostClick = () => navigate("/post-notice");

  useEffect(() => {
    axios
      .get("/noticeboard/categories", { withCredentials: true })
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  const fetchNotices = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (searchTerm) params.search = searchTerm;
        if (selectedDate) params.date = selectedDate;
        if (selected.id && selected.id !== "BOOKMARKS") {
          params.categoryId = selected.id;
        }

        const res = await axios.get("/noticeboard/notices", {
          params,
          withCredentials: true,
        });

        setNotices(res.data.data.items);
        setPagination(res.data.data.pagination);
      } catch {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, selectedDate, selected.id, limit]
  );

  useEffect(() => {
    const t = setTimeout(() => fetchNotices(1), 300);
    return () => clearTimeout(t);
  }, [fetchNotices]);

  useEffect(() => {
    localStorage.setItem("noticeBookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleNoticeClick = async (notice) => {
    try {
      const res = await axios.get(
        `/noticeboard/notices/${notice.id}`,
        { withCredentials: true }
      );
      setSelectedNotice(res.data.data);
    } catch {
      alert("Failed to load notice details");
    }
  };

  // ✅ DELETE NOTICE (ADMIN ONLY)
  const handleDeleteNotice = async (e, noticeId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this notice?")) {
      return;
    }

    try {
      await axios.delete(`/noticeboard/notices/${noticeId}`, {
        withCredentials: true,
      });

      fetchNotices(pagination.page);
    } catch {
      alert("Failed to delete notice");
    }
  };

  const displayNotices =
    selected.id === "BOOKMARKS"
      ? notices.filter((n) => bookmarkedIds.includes(n.id))
      : notices;

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="flex min-h-screen bg-[#f3f5f9] pt-20">
        <NoticeSidebar
          selected={selected}
          setSelected={setSelected}
          options={[
            { name: "All Notices", id: null },
            { name: "Bookmarks", id: "BOOKMARKS" },
            ...categories.map((c) => ({ name: c.name, id: c.id })),
          ]}
        />

        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl p-6 shadow-md">
            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  max={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border px-3 py-2 rounded-md text-sm"
                />

                <div className="relative w-72">
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-3 py-2 pr-10 rounded-md w-full text-sm"
                  />
                  <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">Show</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    fetchNotices(1);
                  }}
                  className="border px-3 py-2 rounded-md"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-600">entries</span>
              </div>
            </div>

            {/* Table */}
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-3">☆</th>
                  <th className="border px-4 py-3">Category</th>
                  <th className="border px-4 py-3">Notice</th>
                  <th className="border px-4 py-3">Date</th>
                  {role === "ADMIN" && (
                    <th className="border px-4 py-3">🗑️</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  displayNotices.map((n) => (
                    <tr
                      key={n.id}
                      onClick={() => handleNoticeClick(n)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <td
                        className="border px-4 py-3 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(n.id);
                        }}
                      >
                        {bookmarkedIds.includes(n.id) ? (
                          <FaBookmark className="text-blue-500" />
                        ) : (
                          <FaRegBookmark className="text-gray-400" />
                        )}
                      </td>

                      <td className="border px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getCategoryBadgeClass(
                            n.category
                          )}`}
                        >
                          {n.category}
                        </span>
                      </td>

                      <td className="border px-4 py-3">{n.title}</td>

                      <td className="border px-4 py-3 text-center">
                        {formatDate(n.created_at)}
                      </td>

                      {role === "ADMIN" && (
                        <td
                          className="border px-4 py-3 text-center text-red-500 hover:text-red-700"
                          onClick={(e) => handleDeleteNotice(e, n.id)}
                        >
                          <FaTrash />
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchNotices(pagination.page - 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page <strong>{pagination.page}</strong> of{" "}
                <strong>{pagination.totalPages}</strong>
              </span>

              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchNotices(pagination.page + 1)}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAuthenticated && role === "ADMIN" && (
        <FloatingButton onClick={handlePostClick} />
      )}
    </>
  );
}

      {/* NOTICE MODAL */}
      {selectedNotice && (() => {
        const attachments = Array.isArray(selectedNotice.files)
          ? selectedNotice.files
          : Array.isArray(selectedNotice.attachments)
          ? selectedNotice.attachments
          : [];

        return (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setSelectedNotice(null)}
          >
            <div
              className="bg-white w-162.5 max-h-[85vh] overflow-y-auto rounded-xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-4 text-xl"
                onClick={() => setSelectedNotice(null)}
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold mb-1">
                {selectedNotice.title}
              </h2>

              <p className="text-sm text-gray-500 mb-4">
                {formatDate(selectedNotice.created_at)}
              </p>

              <div className="whitespace-pre-line mb-6 text-gray-800">
                {selectedNotice.content}
              </div>

              {attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-lg">Attachments</h3>
                  <ul className="space-y-2">
                    {attachments.map((file, index) => {
                      const fileName =
                        file.original_name ||
                        file.originalName ||
                        file.name ||
                        `Attachment ${index + 1}`;

                      const fileUrl =
                        file.file_url ||
                        file.fileUrl ||
                        file.url;

                      if (!fileUrl) return null;

                      return (
                        <li
                          key={file.id || index}
                          className="border rounded-lg p-3 flex justify-between items-center"
                        >
                          <span className="truncate max-w-[70%]">
                            {fileName}
                          </span>
                          <div className="flex gap-4">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Open
                            </a>
                            <a
                              href={fileUrl}
                              download
                              className="text-gray-600 hover:underline"
                            >
                              Download
                            </a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default NoticeBoard;
