import { formatEther } from 'ethers';
import './ManagerPage.css';

const ManagerPage = ({ rooms, contract }) => {

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
