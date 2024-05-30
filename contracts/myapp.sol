// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract myapp {
    struct Tip {
        string name;
        string message;
        uint timestamp;
        address from;
    }

    Tip[] public tips; //all the tips sent
    address payable public owner;

    event NewTip(
        string name,
        string message,
        uint256 timestamp,
        address indexed from
    );

    constructor() {
        owner = payable(msg.sender);
    }

    function sendTip(
        string calldata _name,
        string calldata _message
    ) external payable {
        require(msg.value > 0, "please, introduce a valid value");
        tips.push(Tip(_name, _message, block.timestamp, msg.sender));
        payable(owner).transfer(msg.value);
        emit NewTip(_name, _message, block.timestamp, msg.sender);
    }

    function getTips() public view returns (Tip[] memory) {
        return tips;
    }
}
