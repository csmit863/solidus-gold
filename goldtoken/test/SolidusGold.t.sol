// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/solidusGold.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/mockToken.sol";

contract SolidusGoldTest is Test {
    SolidusGold solidusGold;
    DummyToken tokenA;
    DummyToken tokenB;
    DummyToken token;

    function setUp() public {
        solidusGold = new SolidusGold();
        tokenA = new DummyToken("Token A", "TKA", 0, msg.sender, 6); //1m = 1oz
        tokenB = new DummyToken("Token B", "TKB", 0, msg.sender, 9); //1b = 1oz
        token = new DummyToken("Mock Token", "MTK", 0, msg.sender, 18); //10^18 = 1oz
        token.mint(address(this), 1e18);
        token.approve(address(solidusGold), 1e18);
    }

    /////////////////       GET TOKEN ADDRESS       /////////////////////

    function test_getAddedTokens() public {
        // Assuming you have some dummy token addresses for testing
        address token1 = 0x1234567890123456789012345678901234567890;
        address token2 = 0x2345678901234567890123456789012345678901;
        address token3 = 0x3456789012345678901234567890123456789012;

        // Add some tokens
        solidusGold.addTokenAddress(token1, 1000, 105e18, 120e18, 18);
        solidusGold.addTokenAddress(token2, 2000, 105e18, 120e18, 18);
        solidusGold.addTokenAddress(token3, 3000, 105e18, 120e18, 18);
        // Get the added tokens
        address[] memory addedTokens = solidusGold.getAddedTokens();
        // Check the length of the returned array
        assertEq(addedTokens.length, 3);

        // Check the content of the returned array
        assertEq(addedTokens[0], token1);
        assertEq(addedTokens[1], token2);
        assertEq(addedTokens[2], token3);
    }


    /////////////////       ADD TOKEN ADDRESS       /////////////////////
    // Should add a token to the pool, taking the address of the token, supply cap, min+max RP, and amount/decimals which equal 1oz of gold.
    // Should revert if:
    /*
        if token is already added, 
        if minRP is less than 100*10^18, 
        if maxRP is less than minRP,
        if token is 0 address or self

        (future) if optional freeze state is true?
    */
    function testFail_addTokenAddress_TokenAlreadyInPool() public {
        solidusGold.addTokenAddress(address(tokenA), 1000, 105e18, 120e18, 10**6);
        solidusGold.addTokenAddress(address(tokenA), 1000, 105e18, 120e18, 10**6); // This should fail
    }

    function testFail_addTokenAddress_MinRiskParameterTooLow() public {
        solidusGold.addTokenAddress(address(tokenA), 1000, 95e18, 120e18, 10**6); // This should fail
    }

    function testFail_addTokenAddress_MaxRiskParameterLessThanMinRiskParameter() public {
        solidusGold.addTokenAddress(address(tokenA), 1000, 105e18, 100e18, 10**6); // This should fail
    }

    function test_addTokenAddress() public {
        solidusGold.addTokenAddress(address(tokenA), 1000, 105e18, 120e18, 10**6);
        (address tokenAddress, uint256 balance, uint256 cap, uint256 minRisk, uint256 maxRisk, uint256 decimals) = solidusGold.tokens(address(tokenA));
        
        assertEq(tokenAddress, address(tokenA));
        assertEq(balance, 0);
        assertEq(cap, 1000);
        assertEq(minRisk, 105e18);
        assertEq(maxRisk, 120e18);
        assertEq(decimals, 10**6);
    }




    /////////////////       REMOVE TOKEN ADDRESS       /////////////////////

    function test_RemoveTokenAddress() public {
        solidusGold.addTokenAddress(address(tokenA), 10**9, 105e18, 120e18, 10**6);
        solidusGold.removeTokenAddress(address(tokenA));
        (uint256 supplyCap, , , , ) = solidusGold.getTokenDetails(address(tokenA));
        assertEq(supplyCap, 0);
    }

    /////////////////       INCREASE TOKEN SUPPLY CAP       /////////////////////

    function testFail_increaseTokenSupplyCap_TokenNotInPool() public {
        SolidusGold instance = new SolidusGold();
        instance.increaseTokenSupplyCap(address(tokenA), 1000); // This should fail since tokenA is not in the pool
    }

    /////////////////       DEPOSIT       /////////////////////

    //make fuzz function

    function test_basicFunctionality() public {
        uint initialBalance = token.balanceOf(address(this));
        solidusGold.addTokenAddress(address(token), 1e18, 105e18, 120e18, 18);
        solidusGold.deposit(address(token), 1e18);
        assertEq(token.balanceOf(address(this)), initialBalance - 1e18); // 1 token should be transferred
        assertTrue(solidusGold.balanceOf(address(this)) > 0); // We should have some SolidusGold tokens
    }

    function testFail_tokenNotInPool() public {
        solidusGold.deposit(address(token), 1e18); // This should fail because the token is not added to the pool yet
    }

    function testFail_exceedingSupplyCap() public {
        solidusGold.addTokenAddress(address(token), 0.5e18, 105e18, 120e18, 18); // Supply cap is set to 0.5 tokens
        solidusGold.deposit(address(token), 1e18); // Trying to deposit 1 token, which exceeds the cap
    }

    function test_RevertWhenRedeemingMoreThanBalance() public {
        tokenA.mint(address(this), 10 * 10**6);
        tokenA.approve(address(solidusGold), 10**6);
        solidusGold.addTokenAddress(address(tokenA), 10 * 10**6, 105e18, 120e18, 10**6);
        solidusGold.deposit(address(tokenA), 10**6);
        uint256 sgBalanceBefore = solidusGold.balanceOf(address(this));
        vm.expectRevert("Cannot redeem more than own balance");
        solidusGold.redeem(address(tokenA), sgBalanceBefore + 1);
    }

    /////////////////       REDEEM       /////////////////////
    
    function test_Redeem() public {
        tokenA.mint(address(this), 10 * 10**6);
        tokenA.approve(address(solidusGold), 10 * 10**6);
        solidusGold.addTokenAddress(address(tokenA), 10 * 10**6, 105e18, 120e18, 10**6);
        solidusGold.deposit(address(tokenA), 10**6);
        assertEq(tokenA.balanceOf(address(this)), 9 * 10**6);
        assertEq(tokenA.balanceOf(address(solidusGold)), 10**6);
        uint256 sgBalance = solidusGold.balanceOf(address(this));   //939408000000000000 or 0.939408 SG
        uint256 sgEquivel = sgBalance*10**6 / 10**18;               //939408 or 0.939408 A
        solidusGold.redeem(address(tokenA), sgBalance);
        uint256 expectedTokenABalance = 10**7 - (10**6 - sgEquivel);
        assertEq(tokenA.balanceOf(address(this)), expectedTokenABalance);
        assertEq(tokenA.balanceOf(address(solidusGold)), 10**6 - sgEquivel);
        assertEq(solidusGold.balanceOf(address(this)), 0);
    }

    function testFail_redeem_more_than_balance() public {
        solidusGold.redeem(address(tokenA), 1); // Should fail because we have 0 balance
    }

    function testFail_redeem_token_not_in_pool() public {
        solidusGold.redeem(address(tokenB), 1); // Should fail because tokenB is not in the pool
    }

    function testFail_redeem_exceeds_token_pool_balance() public {
        uint256 initialAmount = 10 * 10**6;
        tokenA.mint(address(this), initialAmount);
        tokenA.approve(address(solidusGold), initialAmount);
        solidusGold.deposit(address(tokenA), initialAmount);

        uint256 sgBalance = solidusGold.balanceOf(address(this));
        solidusGold.redeem(address(tokenA), sgBalance + 1); // Should fail because it exceeds the token pool balance
    }
}
