const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5026/api";

export const getServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) throw new Error("Error fetching services");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAvailableTimes = async (date) => {
  try {
    const response = await fetch(`${API_BASE_URL}/available-times?date=${date}`);
    if (!response.ok) throw new Error("Error fetching available times");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUnavailableDates = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/unavailable-dates`);
    if (!response.ok) throw new Error("Error fetching unavailable dates");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getReservations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reservations`);
    if (!response.ok) throw new Error("Error fetching reservations");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createReservation = async (reservation) => {
  try {
    console.log(reservation);
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error creating reservation" };
  }
};
