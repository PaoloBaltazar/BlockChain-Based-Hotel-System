import React, { useState, useEffect } from 'react';

const MyBookingsPage = ({ contract, userAddress }) => {
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const rooms = await contract.getRooms();
        console.log("Fetched rooms:", rooms); // Debug log for fetched rooms
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

      // Update local state to remove the canceled booking
      setMyBookings((prevBookings) => prevBookings.filter(room => room.id !== roomId));
      
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
            {room.checkedIn ? (
              <p>Status: Checked In</p> // Indicate checked-in status if manager has checked in the room
            ) : (
              <button onClick={() => cancelBooking(room.id)}>Cancel</button> // Cancel button only if not checked in
            )}
          </div>
        ))
      ) : (
        <p>No current bookings.</p>
      )}
    </div>
  );
};

export default MyBookingsPage;
