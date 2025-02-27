import React, { useState, useEffect } from "react";
import ReservationForm from "./components/ReservationForm";
import ReservationsList from "./components/ReservationsList";
import { getReservations } from "./api/api";
import { AppBar, Toolbar, Button, Container, Typography } from "@mui/material";
import EmergencyIcon from '@mui/icons-material/Emergency';

function App() {
  const [reservations, setReservations] = useState([]);
  const [view, setView] = useState("reservation");

  const fetchReservations = async () => {
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          {/* Icono de emergencia */}
          <EmergencyIcon color= 'inherit' sx={{ marginRight: 2 }} />
          
          {/* Título en el Toolbar */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Reservation System
          </Typography>
          
          <Button color="inherit" onClick={() => setView("reservation")}>
            Reserve
          </Button>
          <Button color="inherit" onClick={() => { fetchReservations(); setView("reservationList"); }}> 
            Reservation List
          </Button>
        </Toolbar>
      </AppBar>
      <h1>Reservation System</h1>
      {view === "reservation" && <ReservationForm onReservationCreated={fetchReservations} />}
      {view === "reservationList" && <ReservationsList reservations={reservations} />}
    </Container>
  );
}

export default App;
