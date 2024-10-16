// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelBooking {
    address public owner;
    address public managerWallet;
    mapping(address => bool) public managers;

    struct Room {
        uint256 id;
        uint256 roomNum;
        uint256 price;
        bool isBooked;
        address bookedBy;
        string category;
        bool checkedIn;
    }

    Room[] public rooms;
    mapping(uint256 => uint256) public roomEscrow;  // Track escrow amounts by room ID
    uint256 public nextRoomId = 0;

    constructor(address _managerWallet) {
        owner = msg.sender;
        managerWallet = _managerWallet;
        managers[owner] = true;

        // Initialize rooms
        rooms.push(Room(nextRoomId++, 201, 0.01 ether, false, address(0), "Premium", false));
        rooms.push(Room(nextRoomId++, 202, 0.01 ether, false, address(0), "Premium", false));
    }

    modifier onlyManager() {
        require(managers[msg.sender], "Only managers can perform this action");
        _;
    }

    modifier onlyCustomer(uint _roomId) {
        require(rooms[_roomId].bookedBy == msg.sender, "Only the customer who booked can cancel");
        _;
    }

    function bookRoom(uint _roomId) public payable {
        require(_roomId < rooms.length, "Room does not exist");
        Room storage room = rooms[_roomId];
        require(msg.value == room.price, "Incorrect price");
        require(!room.isBooked, "Room already booked");

        room.isBooked = true;
        room.bookedBy = msg.sender;

        roomEscrow[_roomId] = msg.value; // Hold payment in escrow
    }

    function cancelBooking(uint _roomId) public onlyCustomer(_roomId) {
        Room storage room = rooms[_roomId];
        require(room.isBooked, "Room is not booked");
        require(!room.checkedIn, "Cannot cancel after check-in");

        room.isBooked = false;
        address customer = room.bookedBy;
        room.bookedBy = address(0);

        uint256 escrowAmount = roomEscrow[_roomId];
        roomEscrow[_roomId] = 0; // Reset escrow

        (bool refunded, ) = customer.call{value: escrowAmount}("");
        require(refunded, "Refund failed");
    }

    function checkIn(uint _roomId) public onlyManager {
        Room storage room = rooms[_roomId];
        require(room.isBooked, "Room is not booked");
        require(!room.checkedIn, "Already checked in");

        room.checkedIn = true;  // Mark as checked-in
        uint256 escrowAmount = roomEscrow[_roomId];
        roomEscrow[_roomId] = 0; // Clear escrow

        // Transfer funds to the manager's wallet
        (bool sent, ) = managerWallet.call{value: escrowAmount}("");
        require(sent, "Payment to manager failed");
    }

    function getRooms() public view returns (Room[] memory) {
        return rooms;
    }

}
