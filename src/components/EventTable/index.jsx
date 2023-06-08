import React from "react";

const EventTable = ({ events }) => {
  return (
    <div className="table_wrapper">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.extendedProps.description}</td>
              <td>{event.start?.toISOString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
