import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaBookmark,
  FaUsers,
  FaBuilding,
  FaChevronDown,
  FaHistory,
} from "react-icons/fa";

function NoticeSidebar({ selected, setSelected, options }) {
  const [open, setOpen] = useState({ categories: true });

  return (
  <div
  className="
    w-14 sm:w-20 md:w-64
    bg-white
    shadow-[0_10px_30px_rgba(30,90,168,0.15)]
    rounded-lg
    p-2 md:p-4
    flex flex-col
    gap-1
    h-[calc(100vh-80px)]
    sticky top-20
    overflow-y-auto
  "
>
      {/* TITLE */}
      <h2 className="hidden md:block text-2xl font-bold text-[#0f2a44] mb-2">
  Notices
</h2>

      {/* ALL / BOOKMARKS / OLD */}
      {options
        .filter(
          (o) =>
            o.id === null ||
            o.id === "BOOKMARKS" ||
            o.id === "OLD"
        )
        .map((option) => (
          <SidebarItem
            key={option.id ?? option.name}
            icon={
              option.id === "BOOKMARKS" ? (
                <FaBookmark />
              ) : option.id === "OLD" ? (
                <FaHistory />
              ) : (
                <FaBell />
              )
            }
            option={option}
            selected={selected}
            setSelected={setSelected}
          />
        ))}

      {/* CATEGORIES */}
      <div className="mt-2">
        <div
          onClick={() =>
            setOpen((p) => ({ ...p, categories: !p.categories }))
          }
          className="
            flex items-center justify-between
            px-3 py-2 rounded-lg
            cursor-pointer
            bg-[#eef3fb] text-[#1e5aa8]
            font-semibold
            shadow-sm
          "
        >
          <div className="flex items-center justify-center md:justify-start gap-0 md:gap-3">
  <FaBuilding />
  <span className="hidden md:inline">Categories</span>
</div>
          <FaChevronDown
            size={12}
            className={`transition-transform ${
              open.categories ? "rotate-180" : ""
            }`}
          />
        </div>

        {open.categories && (
          <div className="mt-1 pl-3 md:pl-6 space-y-1 text-sm">
            {options
              .filter(
                (o) =>
                  o.id &&
                  o.id !== "BOOKMARKS" &&
                  o.id !== "OLD"
              )
              .map((option) => (
                <SidebarItem
                  key={option.id}
                  icon={<FaUsers />}
                  option={option}
                  selected={selected}
                  setSelected={setSelected}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeSidebar;

/* ---------------- Sidebar Item ---------------- */

function SidebarItem({ icon, option, selected, setSelected }) {
  const navigate = useNavigate();
  const active = selected?.id === option.id;

  return (
   <div
  onClick={() => {
    setSelected(option);
    option.id === "OLD"
      ? navigate("/noticeboard?tab=old")
      : navigate("/noticeboard");
  }}
  className={`
    flex items-center
    justify-center md:justify-start
    h-10
    px-2 md:px-3
    rounded-lg
    cursor-pointer
    transition-all
    ${
      active
        ? "bg-[#eef3fb] text-[#1e5aa8] font-semibold"
        : "text-[#0f2a44] hover:bg-[#f3f6fb]"
    }
  `}
>
  <span className="flex items-center justify-center w-6">
    {icon}
  </span>

  <span className="hidden md:inline ml-3 truncate">
    {option.name}
  </span>
</div>
  );
}