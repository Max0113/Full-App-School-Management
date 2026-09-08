"use client";

import React from "react";

const START_HOUR = 7;
const END_HOUR = 20;

// 30 minutes per grid row
const MINUTES_PER_ROW = 30;
const ROW_HEIGHT = 40;

const DAY_LABELS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const SUBJECT_COLORS = {
  Mathématiques: {
    bg: "#EDE9FE",
    text: "#6D28D9",
  },
  Français: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
  },
  Physique: {
    bg: "#D1FAE5",
    text: "#047857",
  },
  Anglais: {
    bg: "#FEF3C7",
    text: "#B45309",
  },
};

const DEFAULT_COLOR = {
  bg: "#F3F4F6",
  text: "#374151",
};

// =====================================================
// TIME HELPERS
// =====================================================

function timeToMinutes(time) {
  if (!time) return 0;

  const [hours = 0, minutes = 0] = String(time)
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function formatTime(time) {
  const minutes = timeToMinutes(time);

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}`;
}

// =====================================================
// DAY
// =====================================================

function getDayIndex(jour) {
  const DAY_LABELS = {
    "Lundi": 0,
    "Mardi": 1,
    "Mercredi": 2,
    "Jeudi": 3,
    "Vendredi": 4,
    "Samedi": 5,
    "Dimanche": 6
  };
  return DAY_LABELS[jour] ?? -1;
}

// =====================================================
// COLOR
// =====================================================

function getSubjectColor(subject) {
  return SUBJECT_COLORS[subject] || DEFAULT_COLOR;
}

// =====================================================
// COMPONENT
// =====================================================

export default function ClassScheduleTable({
  sessionsData = [],
  selectedClasse = null,
  onSessionClick,
}) {
  const sessions = Array.isArray(sessionsData)
    ? sessionsData
    : sessionsData
      ? [sessionsData]
      : [];

  // Total rows:
  // 7:00 -> 19:00 = 12 hours
  // 12 * 2 = 24 half-hour rows
  const totalRows =
    ((END_HOUR - START_HOUR) * 60) / MINUTES_PER_ROW;

  // =====================================================
  // TIME ROWS
  // =====================================================

  const timeRows = Array.from(
    { length: totalRows },
    (_, index) => {
      const minutes =
        START_HOUR * 60 +
        index * MINUTES_PER_ROW;

      return minutes;
    }
  );

  return (
    <div className="w-full bg-background font-sans text-foreground">

      {/* =================================================
          CALENDAR
      ================================================= */}
      <div className="w-full overflow-x-auto rounded-xl border border-sidebar-border shadow-sm">
        <div className="min-w-[900px]">

          {/* =================================================
              HEADER
          ================================================= */}
          <div
            className="grid"
            style={{
              gridTemplateColumns:
                "80px repeat(7, minmax(0, 1fr))",
            }}
          >
            {/* Time header */}
            <div className="h-11 border-b border-sidebar-border" />

            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="flex h-11 items-center justify-center border-b border-l border-sidebar-border bg-white/5"
              >
                <span className="text-[13px] font-bold text-white">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* =================================================
              BODY
          ================================================= */}
          <div
            className="relative grid"
            style={{
              gridTemplateColumns:
                "80px repeat(7, minmax(0, 1fr))",

              gridTemplateRows: `repeat(${totalRows}, ${ROW_HEIGHT}px)`,
            }}
          >

            {/* =================================================
                BACKGROUND
            ================================================= */}
            {timeRows.map((minutes, rowIndex) => {
              const hour = Math.floor(minutes / 60);
              const minute = minutes % 60;

              return (
                <React.Fragment key={minutes}>

                  {/* TIME LABEL */}
                  <div
                    className="bg-white/5 border-b  pr-3 text-right"
                    style={{
                      gridColumn: 1,
                      gridRow: rowIndex + 1,
                    }}
                  >
                    {minute === 0 && (
                      <span className="text-[11px] text-white">
                        {hour > 12 ? hour - 12 : hour}
                        {hour >= 12 ? "pm" : "am"}
                      </span>
                    )}
                  </div>

                  {/* DAY CELLS */}
                  {DAY_LABELS.map((_, dayIndex) => (
                    <div
                      key={`${minutes}-${dayIndex}`}
                      className={
                        minute === 0
                          ? "border-b border-l border-sidebar-border"
                          : "border-b border-l border-sidebar-border"
                      }
                      style={{
                        gridColumn: dayIndex + 2,
                        gridRow: rowIndex + 1,
                      }}
                    />
                  ))}
                </React.Fragment>
              );
            })}

            {/* =================================================
                SESSIONS
            ================================================= */}
            {sessions.map((session, index) => {
              const dayIndex = getDayIndex(session.day);

              if (dayIndex === -1) {
                return null;
              }

              const startMinutes = timeToMinutes(
                session.start_time
              );

              const endMinutes = timeToMinutes(
                session.end_time
              );

              if (endMinutes <= startMinutes) {
                return null;
              }

              // =================================================
              // START POSITION
              // =================================================

              const calendarStartMinutes =
                START_HOUR * 60;

              /*
               * Example:
               *
               * 07:00 = row 1
               * 07:30 = row 2
               * 08:00 = row 3
               * 08:30 = row 4
               * 09:00 = row 5
               * 09:30 = row 6
               * 10:00 = row 7
               * 10:30 = row 8
               */

              const startRow =
                Math.floor(
                  (startMinutes -
                    calendarStartMinutes) /
                    MINUTES_PER_ROW
                ) + 1;

              // =================================================
              // DURATION
              // =================================================

              const durationMinutes =
                endMinutes - startMinutes;

              /*
               * 10:30 -> 12:00
               *
               * duration = 90 minutes
               * 90 / 30 = 3 rows
               */

              const rowSpan = Math.max(
                1,
                Math.ceil(
                  durationMinutes /
                    MINUTES_PER_ROW
                )
              );

              // Don't display outside calendar
              if (
                startRow < 1 ||
                startRow > totalRows
              ) {
                return null;
              }

              const colors = getSubjectColor(
                session.subject_name
              );

              return (
                <div
                  key={session.id ?? index}
                  className="z-10 p-1"
                  style={{
                    gridColumn: dayIndex + 2,
                    gridRow: `${startRow} / span ${rowSpan}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      onSessionClick?.(session)
                    }
                    className="flex h-full w-full flex-col overflow-hidden rounded-md px-2 py-1.5 text-left transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >

                    {/* SUBJECT */}
                    <div className="truncate text-xs font-bold">
                      {session.subject_name || "Cours"}
                    </div>

                    {/* CLASS */}
                    {(selectedClasse?.name ||
                      session.classe_name) && (
                      <div className="truncate text-[11px] opacity-80">
                        {selectedClasse?.name ||
                          session.classe_name}
                      </div>
                    )}

                    {/* TIME */}
                    <div className="text-[10px] opacity-80">
                      {formatTime(session.start_time)}
                      {" – "}
                      {formatTime(session.end_time)}
                    </div>

                    {/* ROOM */}
                    {session.room_name && (
                      <div className="truncate text-[10px] opacity-70">
                        {session.room_name}
                      </div>
                    )}

                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}