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
    <div className="dark:bg-[#171717] border border-sidebar-border dark:text-white p-5 rounded-md">
      <h2 className="font-bold">{title}</h2>
      <div className="flex justify-between items-center mt-3">
        <div className={`p-3 rounded-md text-2xl ${colorMap[color] ?? "bg-gray-300 dark:text-gray-600"}`}>
          {icon}
        </div>
        <p className="font-bold text-3xl">{num || "0"}</p>
      </div>
    </div>
  );
}

export default Card;
