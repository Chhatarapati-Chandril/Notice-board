// src/components/NoticeSidebar.jsx
import React, { useState } from "react";
import {
  FaBell,
  FaBookmark,
  FaUsers,
  FaBuilding,
  FaLayerGroup,
  FaChevronDown,
} from "react-icons/fa";

function NoticeSidebar({ selected, setSelected }) {
  const [open, setOpen] = useState({
    clubs: false,
    cells: false,
    community: false,
  });

  return (
    <div className="w-64 bg-[#6a767b] text-white p-5 flex flex-col justify-between h-full">
      {/* TOP */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Notices</h2>

        <SidebarItem
          icon={<FaBell />}
          name="All Notices"
          selected={selected}
          setSelected={setSelected}
        />

        {/* CLUBS */}
        <Dropdown
          icon={<FaUsers />}
          title="Clubs"
          open={open.clubs}
          toggle={() => setOpen({ ...open, clubs: !open.clubs })}
        >
          <SidebarItem name="Impact Club" {...{ selected, setSelected }} />
          <SidebarItem name="Photography Club" {...{ selected, setSelected }} />
          <SidebarItem name="Technical Society" {...{ selected, setSelected }} />
          <SidebarItem name="Sports Club" {...{ selected, setSelected }} />
        </Dropdown>

        {/* CELLS */}
        <Dropdown
          icon={<FaBuilding />}
          title="Cells"
          open={open.cells}
          toggle={() => setOpen({ ...open, cells: !open.cells })}
        >
          <SidebarItem name="Examination Cell" {...{ selected, setSelected }} />
          <SidebarItem
            name="Training & Placement Cell"
            {...{ selected, setSelected }}
          />
          <SidebarItem name="Academics Cell" {...{ selected, setSelected }} />
        </Dropdown>

        {/* COMMUNITY */}
        <Dropdown
          icon={<FaUsers />}
          title="Community"
          open={open.community}
          toggle={() =>
            setOpen({ ...open, community: !open.community })
          }
        >
          <SidebarItem name="Student Council" {...{ selected, setSelected }} />
          <SidebarItem name="NSS" {...{ selected, setSelected }} />
        </Dropdown>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/20 pt-4 mt-4">
        <SidebarItem
          icon={<FaLayerGroup />}
          name="General"
          selected={selected}
          setSelected={setSelected}
        />

        <SidebarItem
          icon={<FaBookmark className="text-blue-400" />}
          name="Bookmarks"
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </div>
  );
}

export default NoticeSidebar;

/* ---------------- HELPERS ---------------- */

function SidebarItem({ icon, name, selected, setSelected }) {
  const active = selected === name;

  return (
    <div
      onClick={() => setSelected(name)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer text-sm mb-1 transition-all
        ${
          active
            ? "bg-gray-700 font-semibold border-l-4 border-blue-400"
            : "hover:bg-gray-700"
        }
      `}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {name}
    </div>
  );
}

function Dropdown({ title, icon, open, toggle, children }) {
  return (
    <div className="mt-3">
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
        <div className="ml-6 mt-1 space-y-1 text-sm text-gray-200">{children}</div>
      )}
    </div>
  );
}
