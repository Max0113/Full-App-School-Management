import React from "react";

const colorMap = {
  blue: "bg-blue-300 text-blue-600",
  green: "bg-green-300 text-green-600",
  red: "bg-red-300 text-red-600",
  yellow: "bg-yellow-300 text-yellow-600",
  purple: "bg-purple-300 text-purple-600",
};

function Card({ title, icon, num, color }) {
  return (
    <div className="bg-[#171717] border border-sidebar-border text-white p-5 rounded-md flex gap-3 flex-col w-96">
      <h2 className="font-bold">{title}</h2>
      <div className="flex justify-between items-center">
        <div
          className={`p-3 rounded-md text-2xl ${colorMap[color] ?? "bg-gray-300 text-gray-600"}`}
        >
          {icon}
        </div>
        <p className="font-bold text-2xl">{num || "0"}</p>
      </div>
    </div>
  );
}

export default Card;
