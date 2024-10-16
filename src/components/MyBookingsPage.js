import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MyBookingsPage = ({ contract, userAddress }) => {
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const rooms = await contract.getRooms();
        const bookings = rooms.filter(room => room.bookedBy === userAddress);
        setMyBookings(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (contract && userAddress) {
      fetchBookings();
    }
  }, [contract, userAddress]);

  const cancelBooking = async (roomId) => {
    try {
      const tx = await contract.cancelBooking(roomId);
      await tx.wait();
      alert("Booking cancelled and refund processed.");
      window.location.reload();
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  return (
    <div>
      <h1>My Bookings</h1>
      {myBookings.length > 0 ? (
        myBookings.map(room => (
          <div key={room.id}>
            <p>Room {room.roomNum} - {room.category}</p>
            <button onClick={() => cancelBooking(room.id)}>Cancel</button>
          </div>
        ))
      ) : (
        <p>No current bookings.</p>
      )}
    </div>
  );
};

export default MyBookingsPage;
