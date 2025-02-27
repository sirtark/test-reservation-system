import React from "react";

function ReservationsList({ reservations }) {
  return (
    <div className="reservations-list">
      <h2>Reservations List</h2>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res, index) => (
              <tr key={index}>
                <td>{res.clientName || res.Client || res.client}</td>
                <td>{res.service || res.Service}</td>
                <td>{res.date || res.Date}</td>
                <td>{res.time || res.Time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReservationsList;
