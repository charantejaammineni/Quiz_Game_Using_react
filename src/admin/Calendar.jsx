import { useState } from "react";
import Breadcrumb from "../components/Breadcrumb";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="admin-page">
        <Breadcrumb/>
      <h1>Calendar</h1>

      <p>View and manage important quiz dates.</p>

      <div className="calendar-card">
        <h2>Select Date</h2>

        {/* Date picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(event) =>
            setSelectedDate(event.target.value)
          }
        />

        {selectedDate && (
          <p>
            Selected Date: <strong>{selectedDate}</strong>
          </p>
        )}
      </div>

      <div className="calendar-events">
        <h2>Upcoming Activities</h2>

        <div className="event-item">
          <strong>Quiz Review</strong>
          <p>Review quiz questions and answers.</p>
        </div>

        <div className="event-item">
          <strong>Monthly Report</strong>
          <p>Check monthly quiz performance.</p>
        </div>
      </div>
    </div>
  );
}

export default Calendar;