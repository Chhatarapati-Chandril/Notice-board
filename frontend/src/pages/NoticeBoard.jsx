import React, { useEffect, useState, useCallback } from "react";
import HomeNav from "../components/HomeNav";
import NoticeSidebar from "../components/NoticeSidebar";
import axios from "../redux/api";
import { getCategoryBadgeClass } from "../constants/categoryColors";
import { FaBookmark, FaRegBookmark, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";



function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const role = useSelector((state) => state.auth.role);


  // sidebar selection (object, NOT string)
  const [selected, setSelected] = useState({
    name: "All Notices",
    id: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);

  // frontend-only bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("noticeBookmarks")) || [];
    } catch {
      return [];
    }
  });

  const navigate = useNavigate()

  const handlePostClick = () => {
  navigate("/post-notice");
};


  /* =======================
     Fetch Categories
  ======================= */
  useEffect(() => {
    axios
      .get("/noticeboard/categories", { withCredentials: true })
      .then((res) => setCategories(res.data.data))
      .catch(console.error);
  }, []);

  /* =======================
     Fetch Notices (backend pagination)
  ======================= */
  const fetchNotices = useCallback(
  async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };

      if (searchTerm) params.search = searchTerm;
      if (selectedDate) params.date = selectedDate;

      // apply category filter ONLY if real category selected
      if (selected.id && selected.id !== "BOOKMARKS") {
        params.categoryId = selected.id;
      }

      const res = await axios.get("/noticeboard/notices", {
        params,
        withCredentials: true,
      });

      setNotices(res.data.data.items);
      setPagination(res.data.data.pagination);
    } catch (err) {
      console.error(err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  },
  [searchTerm, selectedDate, selected.id],
);

  useEffect(() => {
    const t = setTimeout(() => fetchNotices(1), 300);
    return () => clearTimeout(t);
  }, [fetchNotices]);

  /* =======================
     Persist bookmarks
  ======================= */
  useEffect(() => {
    localStorage.setItem("noticeBookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  /* =======================
     Modal fetch
  ======================= */
  const handleNoticeClick = async (notice) => {
    const res = await axios.get(`/noticeboard/notices/${notice.id}`, {
      withCredentials: true,
    });
    setSelectedNotice(res.data.data);
  };

  /* =======================
     Display logic
     (Bookmarks = frontend filter only)
  ======================= */
  const displayNotices =
    selected.id === "BOOKMARKS"
      ? notices.filter((n) => bookmarkedIds.includes(n.id))
      : notices;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB");

  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="flex h-screen bg-[#46494A] pt-20">
        <NoticeSidebar
          selected={selected}
          setSelected={setSelected}
          options={[
            { name: "All Notices", id: null },
            { name: "Bookmarks", id: "BOOKMARKS" },
            ...categories.map((c) => ({
              name: c.name,
              id: c.id,
            })),
          ]}
        />

        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-600">
                {selected.name}
              </h2>
              <p className="text-sm text-gray-500">
                Latest updates and announcements
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 mb-6">
              <input
                type="date"
                className="border px-3 py-2 rounded-md text-sm"
                value={selectedDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search by notice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border px-3 py-2 pr-10 rounded-md w-full text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FaSearch />
                </span>

              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm rounded-md">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-3 text-center w-6">
                      Bookmark
                    </th>
                    <th className="border px-4 py-3 text-left">From</th>
                    <th className="border px-4 py-3 text-left">Notice</th>
                    <th className="border px-4 py-3 text-center">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        Loading…
                      </td>
                    </tr>
                  ) : displayNotices.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-400"
                      >
                        No notices available
                      </td>
                    </tr>
                  ) : (
                    displayNotices.map((n) => (
                      <tr
                        key={n.id}
                        onClick={() => handleNoticeClick(n)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="border px-4 py-3 text-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(n.id);
                            }}
                            className={`text-xl ${
                              bookmarkedIds.includes(n.id)
                                ? "text-blue-500"
                                : "text-gray-400"
                            }`}
                          >
                            {bookmarkedIds.includes(n.id) ? (
                                <FaBookmark className="text-blue-500" />
                              ) : (
                                <FaRegBookmark className="text-gray-400" />
                              )}

                          </span>
                        </td>

                        <td className="border px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getCategoryBadgeClass(
                              n.category,
                            )}`}
                          >
                            {n.category}
                          </span>
                        </td>

                        <td className="border px-4 py-3 font-medium">
                          {n.title}
                        </td>

                        <td className="border px-4 py-3 text-center text-gray-500">
                          {formatDate(n.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <button
                  disabled={pagination.page === 1}
                  onClick={() => fetchNotices(pagination.page - 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchNotices(pagination.page + 1)}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              {selectedNotice.title}
            </h2>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{selectedNotice.category}</span>
              <span>{formatDate(selectedNotice.created_at)}</span>
            </div>

            <div className="text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
              {selectedNotice.content}
            </div>
          </div>
        </div>
      )}
    {role === "PROFESSOR" && (
    <FloatingButton onClick={handlePostClick} />
  )}

    </>
  );
}

export default NoticeBoard;
