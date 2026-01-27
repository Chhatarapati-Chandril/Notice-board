// src/pages/NoticeBoard.jsx
import React, { useState } from "react";
import HomeNav from "../components/HomeNav";
import NoticeSidebar from "../components/NoticeSidebar";
import { useSelector } from "react-redux";

function NoticeBoard() {
  const notices = useSelector((state) => state.notices.notices);

  const [selected, setSelected] = useState("All Notices");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookmarkedNotices, setBookmarkedNotices] = useState([]);

  // 🔹 toggle bookmark
  const toggleBookmark = (notice) => {
    if (bookmarkedNotices.includes(notice)) {
      setBookmarkedNotices(bookmarkedNotices.filter((n) => n !== notice));
    } else {
      setBookmarkedNotices([...bookmarkedNotices, notice]);
    }
  };

  // 🔹 Filter logic including sidebar filter
  const filteredNotices = notices
    .filter((notice) => {
      if (selected === "Bookmarks") return bookmarkedNotices.includes(notice);
      if (selected === "All Notices") return true;
      return notice.from === selected;
    })
    .filter(
      (notice) =>
        notice.notice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.from.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((notice) => (selectedDate ? notice.date === selectedDate : true))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Sidebar options
  const sidebarOptions = [
    { name: "All Notices" },
    { name: "Bookmarks" },
  ];

  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="flex h-screen bg-[#46494A] pt-20">
        <NoticeSidebar selected={selected} setSelected={setSelected} options={sidebarOptions} />

        <div className="flex-1 p-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">

            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-blue-600">{selected}</h2>
                <p className="text-sm text-gray-500">Latest updates and announcements</p>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <input
                type="date"
                className="border px-3 py-2 rounded-md text-sm"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />

              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search by notice or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border px-3 py-2 pr-10 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border px-4 py-3 text-center w-6">Bookmark</th>
                    <th className="border px-4 py-3 text-left">From</th>
                    <th className="border px-4 py-3 text-left">Notice</th>
                    <th className="border px-4 py-3 text-center">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-gray-400">
                        No notices available
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => setSelectedNotice(item)}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        {/* Bookmark */}
                        <td className="border px-4 py-3 text-center">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(item);
                            }}
                            className={`cursor-pointer text-xl ${
                              bookmarkedNotices.includes(item) ? "text-blue-500" : "text-gray-400"
                            }`}
                          >
                            {bookmarkedNotices.includes(item) ? "🔖" : "📑"}
                          </span>
                        </td>

                        <td className="border px-4 py-3">
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            {item.from}
                          </span>
                        </td>

                        <td className="border px-4 py-3 font-medium text-gray-800">
                          {item.notice}
                        </td>

                        <td className="border px-4 py-3 text-center text-gray-500">
                          {item.date}
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

      {/* MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-2xl rounded-xl shadow-xl p-6 relative">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-3 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              {selectedNotice.notice}
            </h2>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
              <span>{selectedNotice.from}</span>
              <span>{selectedNotice.date}</span>
            </div>

            <div className="text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
              {selectedNotice.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoticeBoard;
