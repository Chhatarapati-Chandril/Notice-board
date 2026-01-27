import React, { useState } from "react";
import {
  FaBell,
  FaBookmark,
  FaUsers,
  FaBuilding,
  FaChevronDown,
} from "react-icons/fa";

function NoticeSidebar({ selected, setSelected, options }) {
  // dropdown UI state (purely visual)
  const [open, setOpen] = useState({
    categories: true,
  });

  return (
    <div className="w-64 bg-[#6a767b] text-white p-5 flex flex-col h-full">
      {/* TOP */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Notices</h2>

        {/* ALL / BOOKMARKS */}
        {options
          .filter((o) => o.id === null || o.id === "BOOKMARKS")
          .map((option) => (
            <SidebarItem
              key={option.id ?? option.name}
              icon={option.id === "BOOKMARKS" ? <FaBookmark /> : <FaBell />}
              option={option}
              selected={selected}
              setSelected={setSelected}
            />
          ))}

        {/* CATEGORIES */}
        <Dropdown
          icon={<FaBuilding />}
          title="Categories"
          open={open.categories}
          toggle={() =>
            setOpen((prev) => ({
              ...prev,
              categories: !prev.categories,
            }))
          }
        >
          {options
            .filter((o) => o.id && o.id !== "BOOKMARKS")
            .map((option) => (
              <SidebarItem
                key={option.id}
                icon={<FaUsers />}
                option={option}
                selected={selected}
                setSelected={setSelected}
              />
            ))}
        </Dropdown>
      </div>
    </div>
  );
}

export default NoticeSidebar;

/* ---------------- HELPERS ---------------- */

function SidebarItem({ icon, option, selected, setSelected }) {
  const active = selected?.id === option.id;

  return (
    <div
      onClick={() => setSelected(option)} // ✅ PASS OBJECT
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 transition-all
        ${
          active
            ? "bg-gray-700 font-semibold border-l-4 border-blue-400"
            : "hover:bg-gray-700"
        }
      `}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {option.name}
    </div>
  );
}

function Dropdown({ title, icon, open, toggle, children }) {
  return (
    <div className="mt-4">
      <div
        onClick={toggle}
        className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-gray-700 font-medium"
      >
        <div className="flex items-center gap-3">
          {icon}
          {title}
        </div>
        <FaChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={12}
        />
      </div>

      {open && (
        <div className="ml-4 mt-2 space-y-1 text-sm text-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}
