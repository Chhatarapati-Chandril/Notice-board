import React from "react";
import HomeNav from "../components/HomeNav";

function NoticeBoard() {
  return (
    <>
      <HomeNav title="Notice Board" />

      <div className="pt-20 p-10">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Notice Board
        </h1>
        <p className="text-gray-300">
          All notices will appear here...
        </p>
      </div>
    </>
  );
}

export default NoticeBoard;
