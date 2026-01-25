// src/pages/NoticeBoard.jsx
import React, { useState } from "react";
import HomeNav from "../components/HomeNav";
import NoticeSidebar from "../components/NoticeSidebar";

function NoticeBoard() {
  const [selected, setSelected] = useState("All Notices");

  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="flex h-screen bg-[#46494A] pt-20">
        {/* LEFT SIDEBAR */}
        <NoticeSidebar selected={selected} setSelected={setSelected} />

        {/* MAIN CONTENT */}
<div className="flex-1 p-8">
  <div className="bg-white rounded-xl p-6 shadow-lg">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-blue-600">
          {selected}
        </h2>
        <p className="text-sm text-gray-500">
          Latest updates and announcements
        </p>
      </div>

      <button className="border border-blue-500 text-blue-600 px-4 py-1.5 rounded-md hover:bg-blue-50 transition">
        Show All
      </button>
    </div>

    {/* FILTERS */}
    <div className="flex gap-4 mb-6">
      <input
        type="date"
        className="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="Search notices..."
        className="border px-3 py-2 rounded-md w-72 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    {/* TABLE */}
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-300 text-sm rounded-md overflow-hidden">
        
        {/* TABLE HEADER */}
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-4 py-3 text-left">From</th>
            <th className="border px-4 py-3 text-left">Notice</th>
            <th className="border px-4 py-3 text-center">Date</th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                Central Library
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Library will remain closed tomorrow due to maintenance
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 25
            </td>
          </tr>

           <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                Central Library
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Library will remain closed tomorrow due to maintenance
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 25
            </td>
          </tr>

           <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                Central Library
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Library will remain closed tomorrow due to maintenance
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 25
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                Training & Placement Cell
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Internship opportunity for pre-final year students
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 24
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                Training & Placement Cell
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Internship opportunity for pre-final year students
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 24
            </td>
          </tr>

          <tr className="hover:bg-gray-50 transition">
            <td className="border px-4 py-3">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                Training & Placement Cell
              </span>
            </td>
            <td className="border px-4 py-3 font-medium text-gray-800">
              Internship opportunity for pre-final year students
            </td>
            <td className="border px-4 py-3 text-center text-gray-500">
              Jan 24
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>

  </div>
</div>

      </div>
    </>
  );
}

export default NoticeBoard;
