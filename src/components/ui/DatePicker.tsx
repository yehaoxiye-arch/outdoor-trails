"use client";

import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export default function DatePicker({ value, onChange, id }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const d = new Date(value);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewDate.year, viewDate.month, 1).getDay();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  function handlePrevMonth() {
    setViewDate((prev) => {
      const m = prev.month - 1;
      return m < 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: m };
    });
  }

  function handleNextMonth() {
    setViewDate((prev) => {
      const m = prev.month + 1;
      return m > 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: m };
    });
  }

  function handleSelectDay(day: number) {
    const selected = new Date(viewDate.year, viewDate.month, day);
    if (selected < today || selected > maxDate) return;
    const dateStr = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(dateStr);
    setIsOpen(false);
  }

  function isDisabled(day: number): boolean {
    const d = new Date(viewDate.year, viewDate.month, day);
    d.setHours(0, 0, 0, 0);
    return d < today || d > maxDate;
  }

  function isToday(day: number): boolean {
    return (
      viewDate.year === today.getFullYear() &&
      viewDate.month === today.getMonth() &&
      day === today.getDate()
    );
  }

  function isSelected(day: number): boolean {
    if (!value) return false;
    const d = new Date(value);
    return (
      viewDate.year === d.getFullYear() &&
      viewDate.month === d.getMonth() &&
      day === d.getDate()
    );
  }

  const displayText = value
    ? (() => {
        const d = new Date(value);
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
      })()
    : "";

  return (
    <div ref={containerRef} className="relative" id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-100 rounded-alltrails text-sm text-left text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors flex items-center justify-between"
      >
        <span className={displayText ? "" : "text-gray-400"}>
          {displayText || "选择出发日期"}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-alltrails shadow-lg border border-gray-200 z-50 p-3 md:bottom-auto md:top-full md:mb-0 md:mt-1">
          {/* 头部：年月导航 */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-text-primary">
              {viewDate.year}年{viewDate.month + 1}月
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-xs text-text-secondary py-1">
                {d}
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day, i) =>
              day === null ? (
                <div key={`empty-${i}`} />
              ) : (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  disabled={isDisabled(day)}
                  className={`h-8 flex items-center justify-center text-sm rounded transition-colors ${
                    isSelected(day)
                      ? "bg-primary-500 text-white font-semibold"
                      : isToday(day)
                      ? "bg-primary-100 text-primary-700 font-medium"
                      : isDisabled(day)
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-text-primary hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              )
            )}
          </div>

          {/* 底部提示 */}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-text-secondary text-center">
              支持未来14天内的日期
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
