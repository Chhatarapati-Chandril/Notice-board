export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-[0_10px_30px_rgba(30,90,168,0.15)]
      rounded-lg p-5 flex flex-col gap-4
      h-[calc(100vh-80px)] sticky top-28">
      
      <h2 className="text-2xl font-bold text-[#0f2a44] mb-4">
        My Portal
      </h2>

      <div className="p-3 bg-[#eef3fb] text-[#1e5aa8]
        rounded-lg font-semibold text-center shadow-sm">
        Apps
      </div>
    </div>
  );
}
