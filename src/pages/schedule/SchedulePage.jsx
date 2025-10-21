import React from "react";

export default function SchedulePage() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Lịch học</h1>
        <p className="text-slate-500 mt-1">Xem và quản lý lịch dạy – học.</p>
      </div>

      {/* TODO: gắn calendar/table thật của bạn vào đây */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-500">
        (Placeholder) Trang lịch học – bạn có thể nhúng calendar hoặc danh sách
        buổi học tại đây.
      </div>
    </div>
  );
}
