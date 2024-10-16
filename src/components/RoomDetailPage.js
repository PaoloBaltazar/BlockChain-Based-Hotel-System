import React from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';

const RoomDetailPage = ({ contract, userAddress }) => {
  const { category } = useParams();
  const [rooms, setRooms] = React.useState([]);

  const loadRoomsByCategory = async () => {
    if (contract) {
      const allRooms = await contract.getRooms();
      const filteredRooms = allRooms.filter(room => room.category.toLowerCase() === category.toLowerCase());
      setRooms(filteredRooms);
    }
  };

  React.useEffect(() => {
    loadRoomsByCategory();
  }, [contract, category]);

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
      <h2>{category} Rooms</h2>
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
        <p>No rooms available in this category.</p>
      )}
    </div>
  );
};

export default RoomDetailPage;
