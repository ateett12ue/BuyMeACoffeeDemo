// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract BuyMeACoffee {
    uint public totalCoffee;
    address payable public owner;

    event NewMemo (
        address indexed from,
        uint256 timeStamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timeStamp;
        string name;
        string message;
    }

    
    mapping (address => Memo) public userMemos;
    Memo[] memos;

    constructor(){
        owner = payable(msg.sender);
        totalCoffee = 0;
    }

    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "value should be greater than zero");
        Memo memory coffee = Memo(
                msg.sender,
                block.timestamp,
                _name,
                _message
            );
        memos.push(coffee);
        userMemos[msg.sender] = coffee;
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function withDrawCoffeeMoney() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
}
