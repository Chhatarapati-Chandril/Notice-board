export default function Sidebar() {
  return (
    <div
      className="
        bg-white
        shadow-[0_10px_30px_rgba(30,90,168,0.15)]
        rounded-lg
        flex flex-col
        gap-4
        h-[calc(100vh-80px)]
        sticky top-28
        transition-all duration-300

        w-16 sm:w-20 lg:w-64
        p-2 sm:p-3 lg:p-5
      "
    >
      {/* TITLE (Desktop only) */}
      <h2 className="hidden lg:block text-2xl font-bold text-[#0f2a44] mb-4">
        My Portal
      </h2>

      {/* APPS LABEL */}
      <div
        className="
          bg-[#eef3fb]
          text-[#1e5aa8]
          rounded-lg
          font-semibold
          shadow-sm
          flex items-center justify-center
          text-xs sm:text-sm lg:text-base

          h-12
          lg:h-auto
          lg:p-3
        "
      >
        {/* Mobile: icon | Desktop: text */}
        <span className="lg:hidden text-lg">Apps</span>
        <span className="hidden lg:inline">Apps</span>
      </div>

      {/* Example menu item placeholder */}
      {/* You can add icons here later */}
    </div>
  );
}
