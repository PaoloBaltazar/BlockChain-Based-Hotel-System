import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate for redirection
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import RoomDetailPage from './components/RoomDetailPage';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractABI from './constants/contractABI';
import MyBookingsPage from './components/MyBookingsPage'; // Import MyBookingsPage

const CONTRACT_ADDRESS = "0xC09d0e0340d41c04373482D794f1f150412bb4C7";
const MANAGER_ADDRESS = "0xA5f8CB40B12B582844F4d7FD7B554F911bF35bDc";

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [price, setPrice] = useState("");
  const [roomNum, setRoomNum] = useState("");
  const [category, setCategory] = useState("");
  const [isManager, setIsManager] = useState(false);

  const loadBlockchainData = async (provider) => {
    try {
      const signer = await provider.getSigner();
      const hotelBookingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const rooms = await hotelBookingContract.getRooms();
      setRooms(rooms);

      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);

      setIsManager(userAddress.toLowerCase() === MANAGER_ADDRESS.toLowerCase());

      setProvider(provider);
      setContract(hotelBookingContract);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await loadBlockchainData(provider);

        window.ethereum.on('accountsChanged', async (accounts) => {
          await loadBlockchainData(provider);
        });
      }
    };

    initialize();
  }, []);

  const addRoom = async () => {
    if (!price || isNaN(price) || !roomNum || isNaN(roomNum) || !category) {
      alert("Please enter valid room number, price, and select a category.");
      return;
    }

    try {
      const transaction = await contract.addRoom(
        ethers.parseEther(price),
        parseInt(roomNum),
        category
      );
      await transaction.wait();
      alert("Room added successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error("Room addition failed", error);
    }
  };

  const deleteRoom = async (roomNum) => {
    if (!roomNum || isNaN(roomNum)) {
        alert("Please enter a valid room number.");
        return;
    }

    const roomId = rooms.findIndex(room => room.roomNum.toString() === roomNum);
    if (roomId === -1) {
        alert("Room not found.");
        return;
    }

    try {
        const transaction = await contract.deleteRoom(roomId);
        await transaction.wait();
        alert("Room deleted successfully!");
        window.location.reload(); 
    } catch (error) {
        console.error("Room deletion failed", error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Nav userAddress={userAddress} provider={provider} isManager={isManager} />
        <Routes>
          {/* Default Route - Manager or Customer Homepage */}
          <Route 
            path="/" 
            element={isManager ? (
              <ManagerPage 
                rooms={rooms} 
                addRoom={addRoom} 
                setPrice={setPrice} 
                price={price} 
                setRoomNum={setRoomNum} 
                roomNum={roomNum} 
                setCategory={setCategory} 
                category={category} 
                deleteRoom={deleteRoom}
                contract={contract}
              />
            ) : (
              <CustomerPage />
            )} 
          />

          {/* Route to display My Bookings for customers only */}
          <Route 
            path="/my-bookings" 
            element={isManager ? <Navigate to="/" /> : <MyBookingsPage contract={contract} userAddress={userAddress}/>} 
          />

          {/* Route to display all rooms */}
          <Route 
            path="/rooms" 
            element={isManager ? <Navigate to="/" /> : <RoomDetailPage contract={contract} userAddress={userAddress} />} 
          />

          {/* Manager Page Route */}
          <Route 
            path="/manager" 
            element={<ManagerPage 
              rooms={rooms} 
              addRoom={addRoom} 
              setPrice={setPrice} 
              price={price} 
              setRoomNum={setRoomNum} 
              roomNum={roomNum} 
              setCategory={setCategory} 
              category={category} 
              deleteRoom={deleteRoom} 
            />} 
          />

          {/* Redirect all other routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
