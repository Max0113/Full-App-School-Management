"use client";
import React, { useState, useMemo, useRef } from "react";

// =====================================================================
// CONFIG
// =====================================================================
// Styling is done with Tailwind utility classes throughout. The few
// values that MUST be computed at runtime (pixel offsets for time
// positions, and per-event colors that come straight from the DB) stay
// as inline styles — everything else is a Tailwind class.
const START_HOUR = 7;
const END_HOUR = 19;
const HOUR_HEIGHT = 64; // px per hour
const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_FULL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SWIPE_THRESHOLD = 50;

// Fallback palette for subjects that don't already carry a color from the DB.
const SUBJECT_PALETTE = [
  { bg: "#2D6A4F", text: "#FFFFFF" }, // emerald
  { bg: "#C9A227", text: "#22303C" }, // gold
  { bg: "#3B5BA5", text: "#FFFFFF" }, // indigo
  { bg: "#8E5572", text: "#FFFFFF" }, // plum
];
function colorForSubject(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return SUBJECT_PALETTE[hash % SUBJECT_PALETTE.length];
}

// =====================================================================
// DATA SHAPE
// =====================================================================
// Read-only calendar: it only displays events. Adding/removing séances
// happens in your own form/API/DB — refetch and pass the new `events`
// array back in as a prop when that happens.
//
// Expected row from the DB:
//   { id, start_time: "2026-08-24 08:00:00", end_time: "2026-08-24 10:00:00", subject_name }
//
// Mapper (same one you wrote):
//   return {
//     id: s.id,
//     title: s.subject_name,
//     start: s.start_time,
//     end: s.end_time,
//     backgroundColor: colors.bg,
//     textColor: colors.text,
//     extendedProps: { classe_name: selectedClasse?.name ?? "3A" },
//   };



const rawSeances = [
  { id: 1, subject_name: "Mathématiques", start_time: "2026-08-24 08:00:00", end_time: "2026-08-24 10:00:00" },
  { id: 2, subject_name: "Physique", start_time: "2026-08-26 08:00:00", end_time: "2026-08-26 10:00:00" },
  { id: 3, subject_name: "Français", start_time: "2026-08-31 09:00:00", end_time: "2026-08-31 10:30:00" },
  { id: 4, subject_name: "Anglais", start_time: "2026-09-02 13:00:00", end_time: "2026-09-02 14:30:00" },
];


// =====================================================================
// DATE HELPERS
// =====================================================================
function parseDT(dtString) { return new Date(dtString.replace(" ", "T")); }
function pad(n) { return String(n).padStart(2, "0"); }
function minutesOfDay(date) { return date.getHours() * 60 + date.getMinutes(); }
function minutesToTop(mins) { return ((mins - START_HOUR * 60) / 60) * HOUR_HEIGHT; }
function startOfWeek(date) { const d = new Date(date); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - d.getDay()); return d; }
function isSameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function addMonths(date, n) { const d = new Date(date); d.setMonth(d.getMonth() + n); return d; }
function formatRange(days) {
  const first = days[0], last = days[days.length - 1];
  const sameMonth = first.getMonth() === last.getMonth();
  const firstStr = `${MONTH_SHORT[first.getMonth()]} ${first.getDate()}`;
  const lastStr = sameMonth ? `${last.getDate()}` : `${MONTH_SHORT[last.getMonth()]} ${last.getDate()}`;
  return `${firstStr} – ${lastStr}, ${last.getFullYear()}`;
}
function formatDay(d) { return `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }
function formatHM(date) { return `${pad(date.getHours())}:${pad(date.getMinutes())}`; }

// =====================================================================
// MAIN COMPONENT (read-only display — no add/delete here)
// =====================================================================
// Pass `events` as a prop once wired to real data, e.g.
// <CustomCalendar events={seances.map(s => mapSeance(s, selectedClasse))} />
export default function CustomCalendar({ data = rawSeances, onEventClick }) {
  
  function mapSeance(s, selectedClasse) {
    const colors = colorForSubject(s.subject_name);
    return {
      id: s.id,
      title: s.subject_name,
      start: s.start_time,
      end: s.end_time,
      backgroundColor: colors.bg,
      textColor: colors.text,
      extendedProps: { classe_name: selectedClasse?.name ?? "3A" },
    };
  }

  const events = data.map((s) => mapSeance(s));


  const [view, setView] = useState("week");
  const [anchorDate, setAnchorDate] = useState(new Date(2026, 7, 24)); // demo anchor near sample data
  const [slideDir, setSlideDir] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);
  const today = new Date();

  const weekDays = useMemo(() => {
    const base = startOfWeek(anchorDate);
    return Array.from({ length: 7 }, (_, i) => addDays(base, i));
  }, [anchorDate]);

  const monthGrid = useMemo(() => {
    const firstOfMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
    const gridStart = startOfWeek(firstOfMonth);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [anchorDate]);

  const visibleDays = view === "day" ? [anchorDate] : view === "week" ? weekDays : monthGrid;

  const hours = useMemo(() => { const arr = []; for (let h = START_HOUR; h < END_HOUR; h++) arr.push(h); return arr; }, []);
  const gridHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  const nowMinutes = minutesOfDay(today);
  const showNowLine = nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;

  function step(direction) {
    setSlideDir(direction < 0 ? "right" : "left");
    setAnimKey((k) => k + 1);
    setAnchorDate((prev) => {
      if (view === "day") return addDays(prev, direction);
      if (view === "week") return addDays(prev, direction * 7);
      return addMonths(prev, direction);
    });
  }
  const goPrev = () => step(-1);
  const goNext = () => step(1);
  function goToday() {
    setSlideDir(anchorDate > today ? "right" : anchorDate < today ? "left" : null);
    setAnimKey((k) => k + 1);
    setAnchorDate(new Date());
  }
  function changeView(v) { setView(v); setSlideDir(null); setAnimKey((k) => k + 1); }
  function jumpToDay(d) { setAnchorDate(d); setView("day"); setSlideDir(null); setAnimKey((k) => k + 1); }

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX; touchDeltaX.current = 0; }
  function handleTouchMove(e) { if (touchStartX.current !== null) touchDeltaX.current = e.touches[0].clientX - touchStartX.current; }
  function handleTouchEnd() {
    if (touchStartX.current === null) return;
    if (touchDeltaX.current <= -SWIPE_THRESHOLD) goNext();
    else if (touchDeltaX.current >= SWIPE_THRESHOLD) goPrev();
    touchStartX.current = null; touchDeltaX.current = 0;
  }

  function eventsForDate(d) {
    return events.filter((e) => isSameDay(parseDT(e.start), d));
  }

  const animClass = slideDir === "left" ? "animate-slide-in-left" : slideDir === "right" ? "animate-slide-in-right" : "";
  const headerLabel = view === "day" ? formatDay(anchorDate) : view === "week" ? formatRange(weekDays) : `${MONTH_FULL[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`;

  return (
    <div className="bg-background min-h-full p-6 font-sans text-foreground">
      <style>{`
        @keyframes slideInFromRight { from { transform: translateX(24px); opacity: 0.4; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInFromLeft { from { transform: translateX(-24px); opacity: 0.4; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-in-left { animation: slideInFromLeft 200ms ease-out; }
        .animate-slide-in-right { animation: slideInFromRight 200ms ease-out; }
      `}</style>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={goPrev}
            aria-label="Précédent"
            className="w-8 h-8 rounded-lg border border-sidebar-border bg-background text-slate-800 text-base flex items-center justify-center hover:bg-sidebar transition-colors"
          >
            ‹
          </button>
          <button
            onClick={goNext}
            aria-label="Suivant"
            className="w-8 h-8 rounded-lg border border-sidebar-border bg-background text-slate-800 text-base flex items-center justify-center hover:bg-sidebar transition-colors"
          >
            ›
          </button>
          <button
            onClick={goToday}
            className="h-8 px-3.5 rounded-lg border border-sidebar-border bg-[#2c3e50] text-xs font-semibold text-white hover:bg-sidebar transition-colors"
          >
            Today
          </button>
        </div>

        <div className="text-[15px] font-bold">{headerLabel}</div>

        <div className="flex gap-1.5">
          <button
            className="h-8 px-3.5 rounded-lg border border-sidebar-border bg-[#2c3e50] text-xs font-semibold text-white hover:bg-sidebar transition-colors"
          >
            Add Session
          </button>
          {["month", "week", "day"].map((v) => (
            <button
              key={v}
              onClick={() => changeView(v)}
              className={
                "px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors capitalize text-white" +
                (view === v
                  ? "border-sidebar-border bg-[#2c3e50]"
                  : "border-sidebar-border bg-background hover:bg-sidebar")
              }
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div
        className="bg-sidebar  border border-sidebar-border rounded-xl overflow-hidden shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {view === "month" ? (
          <MonthView key={animKey} animClass={animClass} days={monthGrid} anchorDate={anchorDate} today={today} eventsForDate={eventsForDate} onDayClick={jumpToDay} onEventClick={onEventClick} />
        ) : (
          <TimeGridView
            key={animKey} animClass={animClass} days={visibleDays} today={today} hours={hours} gridHeight={gridHeight}
            showNowLine={showNowLine} nowMinutes={nowMinutes} eventsForDate={eventsForDate} singleDay={view === "day"}
            onEventClick={onEventClick}
          />
        )}
      </div>
    </div>
  );
}

// =====================================================================
// TIME GRID (Day / Week) — display only
// =====================================================================
function TimeGridView({ animClass, days, today, hours, gridHeight, showNowLine, nowMinutes, eventsForDate, singleDay, onEventClick }) {
  // Column template is dynamic (fixed time gutter + N day columns), so
  // this one layout property stays inline — everything else is Tailwind.
  const gridStyle = { gridTemplateColumns: singleDay ? "56px 1fr" : `56px repeat(${days.length}, 1fr)` };

  return (
    <>
      {/* Day headers */}
      <div className="grid" style={gridStyle}>
        <div className="border-b border-sidebar-border" />
        {days.map((d, i) => (
          <div
            key={i}
            className={
              "text-center py-3 px-1 border-b border-sidebar-border " +
              (i === 0 ? "" : "border-l ") +
              "border-sidebar-border " +
              (isSameDay(d, today) ? "bg-emerald-50 " : "") +
              animClass
            }
          >
            <div className="text-[11px] tracking-wider text-slate-500 font-semibold uppercase">{DAY_LABELS[d.getDay()]}</div>
            <div className={"text-[15px] font-bold mt-0.5 " + (isSameDay(d, today) ? "text-emerald-700" : "text-slate-800")}>
              {singleDay ? `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}` : d.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className={"grid " + animClass} style={gridStyle}>
        {/* hour labels */}
        <div className="relative" style={{ height: gridHeight }}>
          {hours.map((h) => (
            <div key={h} className="absolute right-2 text-[11px] text-slate-500" style={{ top: minutesToTop(h * 60) - 7 }}>
              {h % 12 === 0 ? 12 : h % 12}{h < 12 ? "am" : "pm"}
            </div>
          ))}
        </div>

        {days.map((d, dayIndex) => (
          <div key={dayIndex} className="relative border-l border-sidebar-border" style={{ height: gridHeight }}>
            {/* hour separators (visual only) */}
            {hours.map((h) => (
              <div key={h} className="absolute left-0 right-0 border-b border-sidebar-border" style={{ top: minutesToTop(h * 60), height: HOUR_HEIGHT }} />
            ))}

            {eventsForDate(d).map((e) => {
              const startDate = parseDT(e.start);
              const endDate = parseDT(e.end);
              const top = minutesToTop(minutesOfDay(startDate));
              const height = Math.max(28, minutesToTop(minutesOfDay(endDate)) - top);
              return (
                <div
                  key={e.id}
                  onClick={onEventClick ? () => onEventClick(e) : undefined}
                  className={"absolute left-1 right-1 rounded-md px-2 py-1 overflow-hidden " + (onEventClick ? "cursor-pointer" : "")}
                  style={{ top, height, background: e.backgroundColor, color: e.textColor }}
                >
                  <div className="text-xs font-bold">{e.title}</div>
                  {e.extendedProps?.classe_name && <div className="text-[11px] opacity-85">{e.extendedProps.classe_name}</div>}
                  <div className="text-[10px] opacity-85">{formatHM(startDate)} – {formatHM(endDate)}</div>
                </div>
              );
            })}

            {showNowLine && isSameDay(d, today) && (
              <div className="absolute left-0 right-0 h-0.5 bg-red-500 z-10" style={{ top: minutesToTop(nowMinutes) }}>
                <div className="absolute w-2 h-2 rounded-full bg-red-500" style={{ left: -4, top: -3 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// =====================================================================
// MONTH VIEW — display only
// =====================================================================
function MonthView({ animClass, days, anchorDate, today, eventsForDate, onDayClick, onEventClick }) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className={animClass}>
      <div className="grid grid-cols-7">
        {DAY_LABELS.map((label) => (
          <div key={label} className="text-center py-2.5 px-1 text-[11px] font-semibold text-slate-500 border-b border-sidebar-border">
            {label}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((d, di) => {
            const inMonth = d.getMonth() === anchorDate.getMonth();
            const isToday = isSameDay(d, today);
            const dayEvents = eventsForDate(d);
            return (
              <div
                key={di}
                onClick={() => onDayClick(d)}
                className={
                  "min-h-[92px] border-t border-sidebar-border p-1.5 cursor-pointer transition-colors " +
                  (di === 0 ? "" : "border-l border-sidebar-border ") +
                  (isToday ? "bg-emerald-50 " : "hover:bg-stone-100 ") +
                  (inMonth ? "" : "opacity-40")
                }
              >
                <div className={"text-xs mb-1 " + (isToday ? "font-bold text-emerald-700" : "font-medium text-slate-800")}>
                  {d.getDate()}
                </div>
                {dayEvents.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    onClick={onEventClick ? (ev) => { ev.stopPropagation(); onEventClick(e); } : undefined}
                    className="text-[10px] rounded-sm px-1 py-0.5 mb-0.5 truncate"
                    style={{ color: e.textColor, background: e.backgroundColor }}
                  >
                    {formatHM(parseDT(e.start))} {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && <div className="text-[10px] text-slate-500">+{dayEvents.length - 2} de plus</div>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}