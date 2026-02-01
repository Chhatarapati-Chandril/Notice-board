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

  const [selected, setSelected] = useState({
    name: "All Notices",
    id: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);

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
        const params = { page, limit: 10 };
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
    [searchTerm, selectedDate, selected.id]
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
    const res = await axios.get(`/noticeboard/notices/${notice.id}`, {
      withCredentials: true,
    });
    setSelectedNotice(res.data.data);
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
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#1e5aa8]">
                {selected.name}
              </h2>
              <p className="text-sm text-gray-500">
                Latest updates and announcements
              </p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 mb-6">
              <input
                type="date"
                className="border px-3 py-2 rounded-md text-sm"
                value={selectedDate}
                max={new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setSelectedDate(e.target.value)}
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

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full border text-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border px-4 py-3 text-center w-8">
                      ☆
                    </th>
                    <th className="border px-4 py-3 text-left">Category</th>
                    <th className="border px-4 py-3 text-left">Notice</th>
                    <th className="border px-4 py-3 text-center">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center">
                        Loading…
                      </td>
                    </tr>
                  ) : displayNotices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400">
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
                              n.category
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
          </div>
        </div>
      </div>

      {role === "PROFESSOR" && (
        <FloatingButton onClick={handlePostClick} />
      )}
    </>
  );
}

export default NoticeBoard;
