"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendar-dark.css";

// Palette pastel façon capture d'écran
const subjectColors = {
  Mathématiques: { bg: "#EDE9FE", text: "#6D28D9" }, // violet clair
  Français: { bg: "#DBEAFE", text: "#1D4ED8" }, // bleu clair
  "Physique-Chimie": { bg: "#D1FAE5", text: "#047857" }, // vert clair
  Anglais: { bg: "#FEF3C7", text: "#B45309" },
};

export function ClanderSession() {
  const sessions = [
    {
      id: 1,
      subject_name: "Mathématiques",
      classe_name: "3A",
      start_datetime: "2026-08-17T08:00:00Z",
      end_datetime: "2026-08-17T09:30:00Z",
    },
    {
      id: 2,
      subject_name: "Français",
      classe_name: "3A",
      start_datetime: "2026-08-17T09:45:00Z",
      end_datetime: "2026-08-17T11:00:00Z",
    },
    {
      id: 3,
      subject_name: "Anglais",
      classe_name: "3A",
      start_datetime: "2026-08-17T13:00:00Z",
      end_datetime: "2026-08-17T14:30:00Z",
    },
  ];

  const events = sessions.map((s) => {
    const colors = subjectColors[s.subject_name] || {
      bg: "#F3F4F6",
      text: "#374151",
    };
    return {
      id: s.id,
      title: s.subject_name,
      start: s.start_datetime,
      end: s.end_datetime,
      backgroundColor: colors.bg,
      textColor: colors.text,
      extendedProps: { classe_name: s.classe_name },
    };
  });

  return (
    <div className="rounded-xl bg-[#0a0a0a]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="19:00:00"
        allDaySlot={false}
        height="auto"
      />
    </div>
  );
}
