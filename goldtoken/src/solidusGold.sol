// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract SolidusGold is ERC20, Ownable {
    uint256 PRECISION = 10**18; 

    mapping(address => Token) public tokens;
    address[] public tokenAddresses;

    struct Token {
        address tokenAddress;
        uint256 balance;
        uint256 supplyCap;
        uint256 minRiskParameter;
        uint256 maxRiskParameter;
        uint256 tokenDecimals; //how many tokens represent 1oz of gold?
    }   

    //events
    event AddTokenAddress(
        address indexed token, 
        uint256 supplyCap, 
        uint256 minRiskParameter, 
        uint256 maxRiskParameter,
        uint256 tokenDecimals
        );

    event RemoveTokenAddress(
        address tokentoken
        );

    event ReduceTokenSupplyCap(
        address token, 
        uint amount
        );

    event IncreaseTokenSupplyCap(
        address token, 
        uint amount
        );

    event Deposit(
        address from, 
        address token, 
        uint256 depositAmount,
        uint256 mintAmount
        );

    event Redeem(
        address from, 
        address token, 
        uint256 amount
        );

    event AlterMinRiskParameter(
        address token, 
        uint256 minRiskParameter
        );

    event AlterMaxRiskParameter(
        address token, 
        uint256 maxRiskParameter
        );

    // Should add TokenA, TokenB and PaxosGold with corresponding supply caps, risk parameters, decimals
    constructor() ERC20("Solidus", "SOL") Ownable(){
        //addTokenAddress(0x5FbDB2315678afecb367f032d93F642f64180aa3, 1000*10**6, 105e18, 120e18, 10**6);
        //addTokenAddress(0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512, 1000*10**9, 102e18, 123e18, 10**9);
        //addTokenAddress(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0, 1000*10**3, 1012e17, 1093e17, 10**3);
    }
    // Should return 18, and show up correctly in Metamask. Should not be editable.
    function decimals() public view override virtual returns (uint8) {
        return 18;
    }
    
    
//////////////////////////////////////////////////
    //SUPPLY MANAGEMENT FUNCTIONS

    // Should get supply cap, min+max RP, balance and decimal places of token via token address. 
    function getTokenDetails(
        address _tokenAddress
        ) public view returns (
        uint256 supplyCap, 
        uint256 minRiskParameter, 
        uint256 maxRiskParameter,
        uint256 balance,
        uint256 decimal
        ) {
        Token storage token = tokens[_tokenAddress];
        return (token.supplyCap, token.minRiskParameter, token.maxRiskParameter, token.balance, token.tokenDecimals);
    }

    // Should return all of the tokens which have been added to the pool (redundant?)
    function getAddedTokens() public view returns (address[] memory) {
        return tokenAddresses;
    }

    // Should add a token to the pool, taking the address of the token, supply cap, min+max RP, and amount/decimals which equal 1oz of gold.
    // Should revert if:
    /*
        if token is already added, 
        if minRP is less than 100*10^18, 
        if maxRP is less than minRP,
        if token is 0 address or self

        (future) if optional freeze state is true?
    */
    function addTokenAddress(
        address _tokenAddress, 
        uint256 supplyCap, 
        uint256 minRiskParameter, 
        uint256 maxRiskParameter,
        uint256 tokenDecimals
        ) public onlyOwner {
        //- add a token to the pool (list of approved tokens)
        require(tokens[_tokenAddress].tokenAddress == address(0), "Token already in pool");
        require(minRiskParameter >= 100*PRECISION, "minRiskParameter cannot be less than 100 and must have 18 decimal places"); 
        require(maxRiskParameter >= minRiskParameter, "maxRiskParameter cannot be less than minRiskParameter");
        tokens[_tokenAddress] = Token(_tokenAddress, 0, supplyCap, minRiskParameter, maxRiskParameter, tokenDecimals);
        tokenAddresses.push(_tokenAddress);
        emit AddTokenAddress(_tokenAddress, supplyCap, minRiskParameter, maxRiskParameter, tokenDecimals);
    }
    // Should remove a token to the pool, taking the address of the token as a parameter.
    // Should revert if:
    /*
        if token is not in pool
        if token balance != 0
        if token balance > 0
    */
    function removeTokenAddress(
        address _tokenAddress
        ) public onlyOwner {
    //- remove a token from the pool (list of approved tokens)
        //TODO:
        // distribute & exchange tokens proportionately across the pool before discarding them
        // create function in which DAO can adjust supplies of tokens? e.g. 
        // function exchange(address tokenAddressA, address tokenAddressB, uint256 amount)
        delete tokens[_tokenAddress];
        // allegedly gas efficient way of removing token address from array
        // Find the index of the token address and remove it from the array
        uint256 index = findTokenIndex(_tokenAddress);
        require(index < tokenAddresses.length, "Token address not found");
        // If the token address is not the last one in the array, replace it with the last one
        if (index < tokenAddresses.length - 1) {
            tokenAddresses[index] = tokenAddresses[tokenAddresses.length - 1];
        }
        // Remove the last element from the array
        tokenAddresses.pop();

        emit RemoveTokenAddress(_tokenAddress);
    }

    function findTokenIndex(address _tokenAddress) internal view returns (uint256) {
    for (uint256 i = 0; i < tokenAddresses.length; i++) {
        if (tokenAddresses[i] == _tokenAddress) {
            return i;
        }
    }
    revert("Token address not found");
    }
    // Should increase the supplyCap parameter of a token in the pool.
    // Should revert if:
    /*
        if token is not in pool
        if amount is less than or equal to 0 (is this not already secured by uint256?)
    */
    function increaseTokenSupplyCap(
        address _tokenAddress, 
        uint256 amount
        ) public onlyOwner {
    //- increase the supply cap of a token
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token does not exist in pool");
        // other requires
        tokens[_tokenAddress].supplyCap += amount;
        emit IncreaseTokenSupplyCap(_tokenAddress, amount);
    }

    // Should reduce the supplyCap parameter of a token in the pool.
    // Should revert if:
    /*
        if token is not in pool
        if amount is less than or equal to 0
        if the new supplyCap would be lower than the current balance
        if the amount is larger than the supplyCap
    */
    function reduceTokenSupplyCap(
        address _tokenAddress, 
        uint256 amount
        ) public onlyOwner {
    //- reduce the supply cap of a token in the pool
    // toggle depositing?
    // automatically transfer excess tokens to another pool?
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token does not exist in pool");
        require(tokens[_tokenAddress].supplyCap >= amount, "Amount to reduce is greater than current supply cap");
        uint256 newSupplyCap = tokens[_tokenAddress].supplyCap - amount; 
        require(tokens[_tokenAddress].balance <= newSupplyCap, "Cannot reduce supply cap below token's balance in pool");
        tokens[_tokenAddress].supplyCap -= amount;
        emit ReduceTokenSupplyCap(_tokenAddress, amount);
    }

    // Should increase or reduce the minRP, taking token address as parameter
    // Should revert if:
    /*
        if token is not in pool
        if newMinRP would be less than 100*10^18 (100%)
        if MinRP would be more than MaxRP
    */
    function alterMinRiskParameter(
        address _tokenAddress, 
        uint256 newMinRiskParameter
        ) public onlyOwner {
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token does not exist in pool");
        require(newMinRiskParameter >= 100*PRECISION, "Risk parameter cannot be less than 100%");
        require(newMinRiskParameter <= tokens[_tokenAddress].maxRiskParameter, "maxRiskParameter cannot be less than minRiskParameter"); //minRP must be less than maxRP
        tokens[_tokenAddress].minRiskParameter = newMinRiskParameter;
        emit AlterMinRiskParameter(_tokenAddress, newMinRiskParameter);
    }
    // Should increase or reduce the maxRP, taking token address as parameter
    // Should revert if:
    /*
        if token is not in pool
        if newMaxRP would be less than 100*10^18 (100%)
        if MinRP would be more than MaxRP
    */
    function alterMaxRiskParameter(
        address _tokenAddress, 
        uint256 newMaxRiskParameter
        ) public onlyOwner {
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token does not exist in pool");
        require(newMaxRiskParameter >= 100*PRECISION, "Risk parameter cannot be less than 100%");
        require(newMaxRiskParameter >= tokens[_tokenAddress].minRiskParameter, "maxRiskParameter cannot be less than minRiskParameter"); //minRP must be less than maxRP
        tokens[_tokenAddress].maxRiskParameter = newMaxRiskParameter;
        emit AlterMaxRiskParameter(_tokenAddress, newMaxRiskParameter);
    }

//////////////////////////////////////////////////
    //DEPOSIT AND REDEEM FUNCTIONS
        
    // Should allow a user to deposit a token in the pool and mint Solidus Gold, taking token address to deposit as parameter.
    // Should revert if:
    /*
        if token is not in pool
        if newMaxRP would be less than 100*10^18 (100%)
        if MinRP would be more than MaxRP
        if new balance would be more than supply cap
    */
    function deposit(
        address _tokenAddress, 
        uint256 depositAmount
        ) public {
        //1. require statements
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token not in pool");
        require(depositAmount + tokens[_tokenAddress].balance <= tokens[_tokenAddress].supplyCap, "Deposit amount would exceed supply cap");
        //other checks

        //2. maths
        //safemath?
        //f(x) = a(balance - supplyCap)^2 + maxRiskParameter
        // a = ((minRP - maxRP)*scaleFactor ) / supplyCap^2
        //define variables
        uint256 newBalance = tokens[_tokenAddress].balance + depositAmount; 
        uint256 balance = tokens[_tokenAddress].balance;

        //use scale factor
        int256 a = ((int(tokens[_tokenAddress].minRiskParameter)-int(tokens[_tokenAddress].maxRiskParameter)) * int256(PRECISION)) / int(tokens[_tokenAddress].supplyCap)**2;

        //riskParameter = a * (balance - supplyCap)**2 + maxRiskParameter;
        //F(x) = 1/3a(x-supplyCap)^3 + maxRP * x
        //      int[a,b] = a/3*(x-supplyCap)^3 + maxRP*x*PRECISION
        int256 integralAtNewBalance = (a/3 * (int(newBalance)  - int(tokens[_tokenAddress].supplyCap))**3) + (int(tokens[_tokenAddress].maxRiskParameter) * int(newBalance) * int(PRECISION));
        int256 integralAtBalance =    (a/3 * (int(balance)     - int(tokens[_tokenAddress].supplyCap))**3) + (int(tokens[_tokenAddress].maxRiskParameter) * int(balance)    * int(PRECISION));
        int256 p =  (integralAtNewBalance - integralAtBalance); 
        uint256 collateralPercent = uint(p) / depositAmount;
        uint256 x_mintAmount = (depositAmount*PRECISION*100*PRECISION) / collateralPercent; 
        uint256 mintAmount = x_mintAmount * (10**18 / tokens[_tokenAddress].tokenDecimals);

        //3. take tokens & update state
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), depositAmount);
        tokens[_tokenAddress].balance += depositAmount;
        // keep track of how many tokens a user has provided as collateral?
        
        //4. mint tokens & update state
        _mint(msg.sender, mintAmount); 
        //update circulating supply
        emit Deposit(msg.sender, _tokenAddress, depositAmount, mintAmount);
    }


// spNFT ?
// Will have to adjust redeem function in the future. 
// front running?? MEV?
    function redeem(
        address _tokenAddress, 
        uint256 amount //SG
        ) public {
        //users can redeem an amount of SG for a specified token (defined by _tokenAddress)
        require(amount <= balanceOf(msg.sender), "Cannot redeem more than own balance");
        require(tokens[_tokenAddress].tokenAddress != address(0), "Token not in pool");
        uint256 tokenAmount = (amount * tokens[_tokenAddress].tokenDecimals)/PRECISION;
        require(tokens[_tokenAddress].balance >= tokenAmount, "Redeeming would send token pool balance below 0");

        IERC20(_tokenAddress).transfer(msg.sender, tokenAmount);

        tokens[_tokenAddress].balance -= tokenAmount;

        _burn(msg.sender, amount);
        emit Redeem(msg.sender, _tokenAddress, tokenAmount);
    }
}
