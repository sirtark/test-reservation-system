import React, { useState, useEffect } from "react";
import { getServices, createReservation, getAvailableTimes, getUnavailableDates } from "../api/api";

function ReservationForm({ onReservationCreated }) {
  const [services, setServices] = useState([]);
  const [clientName, setClientName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesData = await getServices();
        setServices(servicesData);
        const unavailable = await getUnavailableDates();
        setUnavailableDates(unavailable);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (date) {
        try {
          const times = await getAvailableTimes(date);
          setAvailableTimes(times);
          if (!times.includes(timeSlot)) {
            setTimeSlot("");
          }
        } catch (err) {
          console.error("Error fetching available times:", err);
        }
      } else {
        setAvailableTimes([]);
      }
    };
    fetchAvailableTimes();
  }, [date, timeSlot]);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !selectedService || !date || !timeSlot) {
      setError("Please complete all fields.");
      return;
    }
    if (unavailableDates.includes(date)) {
      setError("The selected date is fully booked.");
      return;
    }
    setError("");
    setLoading(true);
    const reservationData = { clientName, service: selectedService, date, time: timeSlot };
    try {
      const response = await createReservation(reservationData);
      if (response.success) {
        setClientName("");
        setSelectedService("");
        setDate("");
        setTimeSlot("");
        onReservationCreated();
      } else {
        setError(response);
      }
    } catch (err) {
      console.error("Error creating reservation:", err);
      if (err.response && err.response.status === 409) {
        setError(`Error creating reservation: ${err.response.data.message || "Conflict: Reservation already exists."}`);
      } else {
        setError("Error creating reservation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="reservation-form" onSubmit={handleSubmit}>
      <h2>Make a Reservation</h2>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <label>Client Name:</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
        />
      </div>
      <div className="form-group">
        <label>Service:</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Time Slot:</label>
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          disabled={!date || availableTimes.length === 0}
        >
          <option value="">Select a time slot</option>
          {availableTimes.map((slot) => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Reserving..." : "Reserve"}
      </button>
    </form>
  );
}

export default ReservationForm;
