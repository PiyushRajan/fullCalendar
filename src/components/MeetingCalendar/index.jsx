import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReactModal from "react-modal";
import EventTable from "../EventTable";

const MeetingCalendar = () => {
  const calendarRef = useRef(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskDate, setTaskDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [events, setEvents] = useState([]);
  const [isCustomButtonClicked, setCustomButtonClicked] = useState(false);

  const handleEventTitleChange = (e) => {
    setEventTitle(e.target.value);
  };

  const handleEventTitleSubmit = () => {
    if (eventTitle.trim() !== "" && taskDate !== null && eventType !== "") {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent({
        title: eventTitle,
        start: taskDate,
        description: eventDescription,
        backgroundColor: getEventColor(eventType),
      });
      setEventTitle("");
      setEventDescription("");
      setTaskDate("");
      setEventType("");
    }
  };

  const handleEventClick = (arg) => {
    setSelectedEvent(arg.event);
    setIsModalOpen(true);
  };

  const handleEventDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (event) => {
    event.remove();
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case "birthday":
        return "#FFC107";
      case "meeting":
        return "#007BFF";
      case "anniversary":
        return "#DC3545";
      default:
        return "";
    }
  };

  const renderEventContent = (arg) => {
    return (
      <div
        style={{ backgroundColor: arg.event.backgroundColor }}
        className="event-wrapper"
      >
        <span className="title-content">{arg.event.title}</span>
        <button
          className="cross-button"
          onClick={() => handleDeleteEvent(arg.event)}
        >
          x
        </button>
      </div>
    );
  };

  const handleCustomButtonClick = () => {
    setCustomButtonClicked(true);
    setEvents(calendarRef.current.getApi().getEvents());
    console.log("clicked");
  };

  return (
    <div>
      <div className="input-wrapper">
        <div className="input-inside-wrapper">
          <input
            type="text"
            value={eventTitle}
            onChange={handleEventTitleChange}
            placeholder="Event Title"
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            placeholder="Select a date"
          />
          <input
            type="text"
            value={eventDescription}
            onChange={handleEventDescriptionChange}
            placeholder="Event Description"
          />
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          >
            <option value="">Select an event type</option>
            <option value="birthday">Birthday</option>
            <option value="meeting">Meeting</option>
            <option value="anniversary">Anniversary</option>
          </select>
          <button onClick={handleEventTitleSubmit}>Add Event</button>
        </div>
      </div>
      {isCustomButtonClicked ? (
        <div>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            initialView="eventTableView"
            headerToolbar={{
              left: "prevYear prev,next nextYear",
              center: "title",
              right:
                "today dayGridMonth,timeGridWeek,timeGridDay custom-button",
            }}
            customButtons={{
              "custom-button": {
                text: "Event Table",
                click: () => setCustomButtonClicked(false),
              },
            }}
            views={{
              eventTableView: {
                type: "dayGrid",
                buttonText: "Event Table",
              },
            }}
            events={events}
          />
          <EventTable events={events} />
        </div>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          // selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          headerToolbar={{
            left: "prevYear prev,next nextYear",
            center: "title",
            right: "today dayGridMonth,timeGridWeek,timeGridDay custom-button",
          }}
          customButtons={{
            "custom-button": {
              text: "Event Table",
              click: handleCustomButtonClick,
            },
          }}
          events={events}
        />
      )}
      {selectedEvent && (
        <ReactModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Event Details"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h3 className="modal-title">{selectedEvent.title}</h3>
          <p className="modal-description">
            {selectedEvent.extendedProps.description}
          </p>
          <button className="modal-close-btn" onClick={closeModal}>
            Close
          </button>
        </ReactModal>
      )}
    </div>
  );
};

export default MeetingCalendar;
