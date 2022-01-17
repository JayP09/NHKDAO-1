// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Nhktoken.sol";
import "hardhat/console.sol";

contract Burn is NhkToken{
    NhkToken public nhkToken;

    constructor(NhkToken _nhkToken){
        nhkToken = _nhkToken;
    }

    

    function burn(uint _amount) public {
        require(_amount >= balances[msg.sender],"Error");
        console.log(address(0));
        nhkToken.burnToken(msg.sender, address(0), _amount);
        if(_amount >= balances[address(this)]){
            nhkToken.burnToken(address(this), address(0), _amount);
        }
    }

    function burnPending() external view returns(uint){
        return balances[address(this)];
    }
}