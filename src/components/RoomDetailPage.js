import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const RoomDetailPage = ({ contract, userAddress }) => {
  const [rooms, setRooms] = useState([]);
  const [roomStates, setRoomStates] = useState({}); // Store check-in, check-out, and total price for each room

  // Fetch all rooms
  const loadRooms = async () => {
    if (contract) {
      try {
        const allRooms = await contract.getRooms();
        setRooms(allRooms);
      } catch (error) {
        console.error("Failed to load rooms:", error);
      }
    }
  };

  useEffect(() => {
    loadRooms();
  }, [contract]);

  const handleDateChange = (e, roomId) => {
    const { name, value } = e.target;

    setRoomStates((prevStates) => {
      const roomState = prevStates[roomId] || {};
      const updatedState = { ...roomState, [name]: value };

      if (updatedState.checkIn && updatedState.checkOut) {
        const checkIn = new Date(updatedState.checkIn);
        const checkOut = new Date(updatedState.checkOut);

        if (checkOut > checkIn) {
          const difference = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          const room = rooms.find((r) => r.id === roomId);

          // Calculate total price for this room
          if (room && room.price) {
            const roomPricePerDay = ethers.formatEther(room.price.toString());
            const calculatedTotalPrice = (difference * parseFloat(roomPricePerDay)).toFixed(4);
            updatedState.totalPrice = calculatedTotalPrice;
          }
        }
      }

      return { ...prevStates, [roomId]: updatedState };
    });
  };

  const bookRoom = async (roomId) => {
    const roomState = roomStates[roomId];
    if (!roomState || !roomState.totalPrice || isNaN(roomState.totalPrice)) {
      console.error("Invalid total price for booking");
      return;
    }

    try {
      const totalCost = ethers.parseEther(roomState.totalPrice.toString());
      const checkInTimestamp = Math.floor(new Date(roomState.checkIn).getTime() / 1000);
      const checkOutTimestamp = Math.floor(new Date(roomState.checkOut).getTime() / 1000);

      const transaction = await contract.bookRoom(roomId, checkInTimestamp, checkOutTimestamp, { value: totalCost });
      await transaction.wait();
      alert("Room booked successfully!");
      loadRooms(); // Reload room states after booking
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="room-detail-page">
      <h2>Available Rooms</h2>
      <div className="rooms-list" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {rooms.length > 0 ? rooms.map((room) => (
          <div key={room.id} className="room-card" style={{ border: '1px solid #ccc', padding: '16px', margin: '8px', width: '300px' }}>
            <h3>Room {room.roomNum} ({room.category})</h3>
            <p>Price per day: {room.price ? ethers.formatEther(room.price.toString()) : "N/A"} ETH</p>

            <label>
              Check-in:
              <input
                type="date"
                name="checkIn"
                value={roomStates[room.id]?.checkIn || ""}
                onChange={(e) => handleDateChange(e, room.id)}
                disabled={room.isBooked || room.checkedIn} // Disable inputs if the room is booked or checked in
              />
            </label>
            <label>
              Check-out:
              <input
                type="date"
                name="checkOut"
                value={roomStates[room.id]?.checkOut || ""}
                onChange={(e) => handleDateChange(e, room.id)}
                disabled={room.isBooked || room.checkedIn} // Disable inputs if the room is booked or checked in
              />
            </label>

            {roomStates[room.id]?.totalPrice && (
              <p>Total Price: {roomStates[room.id].totalPrice} ETH</p>
            )}

            <button
              onClick={() => bookRoom(room.id)}
              disabled={room.isBooked || room.checkedIn} // Disable button if the room is booked or checked in
            >
              {room.isBooked ? "Booked" : "Book Now"}
            </button>
          </div>
        )) : <p>No rooms available</p>}
      </div>
    </div>
  );
};

export default RoomDetailPage;
