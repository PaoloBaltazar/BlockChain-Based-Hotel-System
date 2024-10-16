import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const PendingBookingsPage = ({ contract }) => {
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const rooms = await contract.getRooms();
        const pending = rooms.filter(room => room.isBooked && !room.checkedIn);
        setPendingBookings(pending);
      } catch (error) {
        console.error("Error fetching pending bookings:", error);
      }
    };

    if (contract) {
      fetchPendingBookings();
    }
  }, [contract]);

  const checkIn = async (roomId) => {
    try {
      const tx = await contract.checkIn(roomId);
      await tx.wait();
      alert("Check-in completed and payment released.");
      window.location.reload();
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };

  return (
    <div>
      <h2>Pending Bookings</h2>
      {pendingBookings.length > 0 ? (
        pendingBookings.map(room => (
          <div key={room.id}>
            <p>Room {room.roomNum} - {room.category}</p>
            <button onClick={() => checkIn(room.id)}>Check In</button>
          </div>
        ))
      ) : (
        <p>No pending bookings.</p>
      )}
    </div>
  );
};

export default PendingBookingsPage;
