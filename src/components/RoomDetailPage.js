import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const RoomDetailPage = ({ contract, userAddress }) => {
  const [rooms, setRooms] = useState([]);

  // Fetch all rooms without filtering by category
  const loadRooms = async () => {
    if (contract) {
      const allRooms = await contract.getRooms();
      setRooms(allRooms);
    }
  };

  useEffect(() => {
    loadRooms();
  }, [contract]);

  const bookRoom = async (roomId, price) => {
    try {
      const transaction = await contract.bookRoom(roomId, { value: price });
      await transaction.wait();
      alert("Room booked successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="room-detail-page">
      <h2>All Rooms</h2>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              <p>Room Number: {room.roomNum.toString()}</p>
              <p>Price: {ethers.formatEther(room.price.toString())} ETH</p>
              <p>Status: 
                {room.checkedIn ? "Checked In" : 
                room.isBooked ? "Booked (Waiting for check-in)" : "Available"}
              </p>
              {!room.isBooked && (
                <button onClick={() => bookRoom(index, room.price)}>Book Room</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
};

export default RoomDetailPage;
