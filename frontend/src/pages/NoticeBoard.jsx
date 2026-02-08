import React, { useEffect, useState, useCallback } from "react";
import HomeNav from "../components/HomeNav";
import NoticeSidebar from "../components/NoticeSidebar";
import axios from "../redux/api";
import { FaEdit } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { FaBookmark, FaRegBookmark, FaSearch, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [allNotices, setAllNotices] = useState([]);

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

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "recent";

  const fetchNotices = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = { page, limit, tab };

        if (searchTerm) params.search = searchTerm;
        if (selectedDate) params.date = selectedDate;
        if (selected.id && selected.id !== "BOOKMARKS") {
          params.categoryId = selected.id;
        }

        if (role === "GUEST") {
          params.audience = "PUBLIC";
        }

        // 🚨 BOOKMARK MODE: fetch ALL
        if (selected.id === "BOOKMARKS") {
          const res = await axios.get("/noticeboard/notices", {
            params: { page: 1, limit: 10000 }, // or a high safe number
            withCredentials: true,
          });
          setAllNotices(res.data.data.items);
        } else {
          const res = await axios.get("/noticeboard/notices", {
            params,
            withCredentials: true,
          });
          setNotices(res.data.data.items);
          setPagination(res.data.data.pagination);
        }
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, selectedDate, selected.id, limit, tab],
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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleNoticeClick = async (notice) => {
    try {
      const res = await axios.get(`/noticeboard/notices/${notice.id}`, {
        withCredentials: true,
      });
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

  const formatDate = (d) => new Date(d).toLocaleDateString("en-GB");

  const bookmarkedNotices = allNotices.filter((n) =>
    bookmarkedIds.includes(n.id),
  );

  const bookmarkStartIndex = (pagination.page - 1) * limit;
  const bookmarkEndIndex = bookmarkStartIndex + limit;

  const paginatedBookmarks = bookmarkedNotices.slice(
    bookmarkStartIndex,
    bookmarkEndIndex,
  );

  const displayNotices =
    selected.id === "BOOKMARKS" ? paginatedBookmarks : notices;

  useEffect(() => {
    if (selected.id === "BOOKMARKS") {
      setPagination((prev) => ({
        ...prev,
        page: 1,
        totalPages: Math.max(1, Math.ceil(bookmarkedNotices.length / limit)),
      }));
    }
  }, [selected.id, bookmarkedNotices.length, limit]);

  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="flex min-h-screen bg-[#f3f5f9] pt-20 gap-4 px-2 md:px-6">
        <NoticeSidebar
          selected={selected}
          setSelected={setSelected}
          options={[
            { name: "All Notices", id: null },
            { name: "Bookmarks", id: "BOOKMARKS" },
            { name: "Old Notices", id: "OLD" },
            ...categories.map((c) => ({ name: c.name, id: c.id })),
          ]}
        />

        <div className="flex-1 p-3 md:p-6 overflow-auto">
          <div className="bg-white rounded-xl p-6 shadow-md">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div className="flex gap-4">
                <input
                  type="date"
                  value={selectedDate}
                  max={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border cursor-pointer px-3 py-2 rounded-md text-sm"
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
                  className="border px-3 py-2 cursor-pointer rounded-md"
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
            <div className="overflow-x-auto">
              <table className="min-w-175 w-full border border-black border-collapse text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-black px-4 py-3"></th>
                    <th className="border border-black px-4 py-3">Category</th>
                    <th className="border border-black px-4 py-3">Notice</th>
                    <th className="border border-black px-4 py-3">Date</th>
                    {role === "ADMIN" && (
                      <th className="border border-black px-4 py-3"></th>
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
                          className="border border-black px-4 py-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(n.id);
                          }}
                        >
                          <div className="flex items-center justify-center">
                            {bookmarkedIds.includes(n.id) ? (
                              <FaBookmark className="text-blue-500" />
                            ) : (
                              <FaRegBookmark className="text-gray-400" />
                            )}
                          </div>
                        </td>

                        <td className="border border-black px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              n.category?.badgeClass ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {n.category?.name}
                          </span>
                        </td>

                        <td className="border border-black px-4 py-3">
                          {n.title}
                        </td>

                        <td className="border border-black px-4 py-3">
                          {formatDate(n.created_at)}
                        </td>

                        {role === "ADMIN" && (
                          <td className="border border-black px-4 py-3">
                            <div className="flex items-center justify-center gap-4">
                              <FaEdit
                                className="text-green-600 hover:text-green-800 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/noticeboard/edit/${n.id}`);
                                }}
                              />
                              <FaTrash
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                onClick={(e) => handleDeleteNotice(e, n.id)}
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  selected.id === "BOOKMARKS"
                    ? setPagination((p) => ({ ...p, page: p.page - 1 }))
                    : fetchNotices(pagination.page - 1)
                }
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer "
              >
                Previous
              </button>

              <span className="text-sm">
                Page <strong>{pagination.page}</strong> of{" "}
                <strong>{pagination.totalPages}</strong>
              </span>

              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  selected.id === "BOOKMARKS"
                    ? setPagination((p) => ({ ...p, page: p.page + 1 }))
                    : fetchNotices(pagination.page + 1)
                }
                className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
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

      {/* NOTICE MODAL */}
      {selectedNotice &&
        (() => {
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
                  className="absolute top-3 right-4 text-xl cursor-pointer"
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

                {selectedNotice.content && (
                  <div className="whitespace-pre-line mb-6 text-gray-800">
                    {selectedNotice.content}
                  </div>
                )}

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
                          file.file_url || file.fileUrl || file.url;

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