import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5f9]">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/noticeboard")}
          className="bg-[#1e5aa8] text-white px-6 py-2 rounded-lg hover:bg-[#174a8a]"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
