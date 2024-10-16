import React, { useState } from 'react';
import { formatEther } from 'ethers';
import './ManagerPage.css';

const ManagerPage = ({ rooms, addRoom, setPrice, price, setRoomNum, roomNum, setCategory, category, deleteRoom, contract }) => {
  const [roomToDelete, setRoomToDelete] = useState('');

  const handleCheckIn = async (roomId) => {
    if (!contract) {
      alert("Contract is not available");
      return;
    }

    if (typeof contract.checkIn !== 'function') {
      console.error("CheckIn function is not defined in the contract");
      return;
    }

    try {
      const tx = await contract.checkIn(roomId);
      await tx.wait();
      alert("Room checked in successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Check-in failed", error);
      alert("Check-in failed. Please try again.");
    }
  };

  return (
    <div className="manager-page-container">
      <div className='add-room-container'>
        <h2>Add Room</h2>
        <div className="form-container">
          <input 
            type="text" 
            placeholder="Enter room number" 
            value={roomNum}
            className="input-style"
            onChange={(e) => setRoomNum(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Enter room price in ETH" 
            value={price}
            className="input-style"
            onChange={(e) => setPrice(e.target.value)} 
          />
          <select 
            value={category} 
            className="category-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            <option value="Premium">Premium</option>
            <option value="Prestige">Prestige</option>
            <option value="Presidential">Presidential</option>
          </select>
          <button onClick={addRoom} className='add-room-button'>Add Room</button>
        </div>
      </div>

      <div className="delete-room-container">
        <h2>Delete Room</h2>
        <div className="form-container">
          <input 
            type="text" 
            placeholder="Enter room number to delete" 
            value={roomToDelete}
            onChange={(e) => setRoomToDelete(e.target.value)} 
            className="input-style"
          />
          <button 
            onClick={() => deleteRoom(roomToDelete)} 
            className='delete-room-button'>
            Delete Room
          </button>
        </div>
      </div>

      <div className='room-container'>
        <h2>Room List</h2>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Price (ETH)</th>
              <th>Status</th>
              <th>Category</th>
              <th>User Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms && rooms.length > 0 ? rooms.map((room, index) => (
              <tr key={index} className="room-item">
                <td>{room?.roomNum?.toString() || 'N/A'}</td>
                <td>{room?.price ? formatEther(room.price.toString()) : 'N/A'}</td>
                <td>{room?.checkedIn ? "Checked In" : room?.isBooked ? "Booked (Waiting for check-in)" : "Not Booked"}</td>
                <td>{room?.category || 'N/A'}</td>
                <td>{room?.isBooked ? room.bookedBy : 'TBD'}</td>
                <td>
                  {room?.isBooked && !room?.checkedIn && (
                    <button onClick={() => handleCheckIn(index)} className="check-in-button">
                      Check In
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6">No rooms available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPage;
