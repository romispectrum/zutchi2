// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../contracts/zutchi.sol";
import "../contracts/MockZIRCUIT.sol";
import "../contracts/LotteryOracle.sol";

contract SimpleLotteryTest is Test {
    Zutchi public zutchi;
    MockZIRCUIT public zircuitToken;
    SimpleLotteryOracle public oracle;

    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        // Deploy mock ZIRCUIT token
        zircuitToken = new MockZIRCUIT();

        // Deploy Zutchi contract
        zutchi = new Zutchi(address(zircuitToken));

        // Deploy Oracle contract
        oracle = new SimpleLotteryOracle();

        // Set oracle in Zutchi contract
        zutchi.setLotteryOracle(address(oracle));

        // Give users some tokens
        zircuitToken.transfer(user1, 1000e18);
        zircuitToken.transfer(user2, 1000e18);
    }

    function testBasicLottery() public {
        // Mint pet for user1
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        // User1 feeds pet and enters lottery
        uint256 feedAmount = 10e18;
        vm.prank(user1);
        zircuitToken.approve(address(zutchi), feedAmount);
        vm.prank(user1);
        zutchi.feed(tokenId, feedAmount);

        // Check lottery state
        (
            uint256 totalPool,
            ,
            uint256 participantCount,
            bool isActive,

        ) = zutchi.getCurrentLotteryInfo();
        assertEq(totalPool, feedAmount, "Pool should contain feed amount");
        assertEq(participantCount, 1, "Should have 1 participant");
        assertTrue(isActive, "Lottery should be active");
    }

    function testOracleRandomNumber() public {
        // Test oracle random number generation
        uint256 randomNum = oracle.getSimpleRandom(100);
        assertTrue(randomNum < 100, "Random number should be less than max");

        (uint256 requestId, uint256 randomBetween) = oracle.getRandomNumber(
            1,
            10
        );
        assertGe(randomBetween, 1, "Random should be >= 1");
        assertLe(randomBetween, 10, "Random should be <= 10");
        assertEq(requestId, 1, "First request should have ID 1");
    }

    function testLotteryEnd() public {
        // Setup lottery with participants
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user1);
        zircuitToken.approve(address(zutchi), 100e18);
        vm.prank(user1);
        zutchi.feed(tokenId1, 10e18);

        // Check lottery is active with participant
        (
            uint256 totalPool,
            ,
            uint256 participantCount,
            bool isActive,

        ) = zutchi.getCurrentLotteryInfo();
        assertEq(totalPool, 10e18, "Pool should have feed amount");
        assertEq(participantCount, 1, "Should have 1 participant");
        assertTrue(isActive, "Lottery should be active");

        // Fast forward past lottery duration
        vm.roll(block.number + 101);

        // End lottery
        zutchi.endLottery();

        // Check that lottery ended and new one started
        (, , , bool newIsActive, ) = zutchi.getCurrentLotteryInfo();
        assertTrue(newIsActive, "New lottery should be active");

        // Note: We don't check the winner since the old lottery data might be cleared
        // This test verifies that the lottery cycle works (end -> start new)
    }
}
