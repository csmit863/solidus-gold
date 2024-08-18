// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract DummyToken is ERC20, Ownable {

    uint8 decimalPlaces;
    mapping(address => bool) private _admins;
    address[] private _adminList; // Array to hold admin addresses

    event Burn(address from, uint256 amount);
    event Mint(address to, uint256 amount);
    event SetAdmin(address account, bool status);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply, 
        address admin, 
        uint8 d
        ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        setAdmin(admin, true);
        _admins[msg.sender] = true; // Owner is automatically an admin
        decimalPlaces = d;
    }

    modifier onlyAdmin() {
        require(_admins[msg.sender], "Only admins can call this function");
        _;
    }

    function decimals() public view override virtual returns (uint8) {
        return decimalPlaces;
    }

    // Only owner can mint new tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    // Admins can burn tokens, but only their own
    function burn(uint256 amount) public onlyAdmin {
        require(balanceOf(msg.sender) >= amount, "Burn amount exceeds balance");
        _burn(msg.sender, amount);
        emit Burn(msg.sender, amount);
    }

    function setAdmin(address account, bool status) public onlyOwner {
        if (status == true && _admins[account] == false) {
            _adminList.push(account); // If status is true and account is not already an admin, add it to the list
        } else if (status == false && _admins[account] == true) {
            for (uint i = 0; i < _adminList.length; i++) {
                // If status is false and account is an admin, remove it from the list
                if (_adminList[i] == account) {
                    _adminList[i] = _adminList[_adminList.length - 1];
                    _adminList.pop();
                    break;
                }
            }
        }
        _admins[account] = status;
        emit SetAdmin(account, status);
    }

    function isAdmin(address account) public view returns (bool) {
        return _admins[account];
    }

    function getAllAdmins() public view returns (address[] memory) {
        return _adminList; // Returns the list of admins
    }
}
