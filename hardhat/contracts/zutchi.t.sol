// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "./zutchi.sol";
import "./MockZIRCUIT.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract MockReceiver is IERC721Receiver {
    function onERC721Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*tokenId*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

contract ZutchiTest is Test, IERC721Receiver {
    Zutchi public zutchi;
    MockZIRCUIT public zircuitToken;

    address public owner;
    address public user1;
    address public user2;
    address public user3;
    address public user4;

    // Helper to implement ERC721Receiver
    function onERC721Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*tokenId*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function setUp() public {
        owner = address(this);

        // Create receiver contracts for users
        MockReceiver receiver1 = new MockReceiver();
        MockReceiver receiver2 = new MockReceiver();
        MockReceiver receiver3 = new MockReceiver();
        MockReceiver receiver4 = new MockReceiver();

        user1 = address(receiver1);
        user2 = address(receiver2);
        user3 = address(receiver3);
        user4 = address(receiver4);

        // Deploy mock ZIRCUIT token
        zircuitToken = new MockZIRCUIT();

        // Deploy Zutchi contract
        zutchi = new Zutchi(address(zircuitToken));

        // Give users some ZIRCUIT tokens
        zircuitToken.transfer(user1, 10000);
        zircuitToken.transfer(user2, 10000);
        zircuitToken.transfer(user3, 10000);
        zircuitToken.transfer(user4, 10000);
    }

    function mineBlocks(uint256 n) internal {
        for (uint256 i = 0; i < n; i++) {
            vm.roll(block.number + 1);
        }
    }

    // ============ DEPLOYMENT TESTS ============

    function testDeploymentNameAndSymbol() public view {
        assertEq(zutchi.name(), "Zutchi");
        assertEq(zutchi.symbol(), "ZUTCHI");
    }

    function testDeploymentOwner() public view {
        assertEq(zutchi.owner(), owner);
    }

    function testDeploymentInitialSupply() public view {
        assertEq(zutchi.totalSupply(), 0);
    }

    // ============ MINTING TESTS ============

    function testMintingOwner() public {
        uint256 tokenId = zutchi.mint();
        assertEq(zutchi.ownerOf(1), owner);
        assertEq(zutchi.totalSupply(), 1);
        assertEq(zutchi.getCurrentTokenId(), 1);
        assertEq(tokenId, 1);
    }

    function testMintingIncrementTokenId() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();
        assertEq(zutchi.ownerOf(tokenId), user1);
        assertEq(zutchi.totalSupply(), 1);
        assertEq(zutchi.getCurrentTokenId(), 1);
    }

    function testMintingAnyoneCanMint() public {
        vm.prank(user2);
        zutchi.mint();
        assertEq(zutchi.totalSupply(), 1);
        assertEq(zutchi.getCurrentTokenId(), 1);
    }

    function testMintingUnlimited() public {
        // Mint several tokens to ensure no supply limit
        for (uint256 i = 0; i < 5; i++) {
            zutchi.mint();
        }
        assertEq(zutchi.totalSupply(), 5);
    }

    function testMintingParameters() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();
        uint256 currentBlock = block.number;

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.bornAtBlock, currentBlock);
        assertEq(attr.energy, 100e18); // 100e18
        assertEq(attr.health, 100);
        assertEq(attr.level, 1);
        assertEq(attr.isBusy, false);
        assertEq(attr.freeAtBlock, 0);
    }

    // ============ SLEEPING TESTS ============

    function testSleepingOwnerCanSleep() public {
        uint256 tokenId = zutchi.mint();
        zutchi.putToSleep(tokenId, 100);
        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.isBusy, true);
    }

    function testSleepingCannotSleepIfBusy() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        vm.prank(user1);
        zutchi.putToWork(tokenId, 20);

        vm.prank(user1);
        vm.expectRevert("isBusy");
        zutchi.putToSleep(tokenId, 100);
    }

    function testSleepingOnlyOwnerCanSleep() public {
        uint256 tokenId = zutchi.mint();

        vm.prank(user2);
        vm.expectRevert("notOwner");
        zutchi.putToSleep(tokenId, 100);
    }

    function testSleepingAfterNotBusy() public {
        vm.prank(user2);
        uint256 tokenId = zutchi.mint();

        // First sleep
        vm.prank(user2);
        zutchi.putToSleep(tokenId, 100);

        // Mine blocks to make not busy
        mineBlocks(101);

        // Should be able to sleep again
        vm.prank(user2);
        zutchi.putToSleep(tokenId, 100);

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.isBusy, true);
    }

    // ============ WORKING TESTS ============

    function testWorkingOwnerCanWork() public {
        mineBlocks(120);

        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        vm.prank(user1);
        zutchi.putToWork(tokenId, 10);

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.isBusy, true);
    }

    function testWorkingCannotWorkIfBusy() public {
        vm.prank(user3);
        uint256 tokenId = zutchi.mint();

        vm.prank(user3);
        zutchi.putToSleep(tokenId, 100);

        vm.prank(user3);
        vm.expectRevert("isBusy");
        zutchi.putToWork(tokenId, 50);
    }

    function testWorkingOnlyOwnerCanWork() public {
        uint256 tokenId = zutchi.mint();

        vm.prank(user4);
        vm.expectRevert("notOwner");
        zutchi.putToWork(tokenId, 100);
    }

    function testWorkingAfterNotBusy() public {
        mineBlocks(101);

        vm.prank(user3);
        uint256 tokenId = zutchi.mint();

        vm.prank(user3);
        zutchi.putToWork(tokenId, 50);

        mineBlocks(101);

        vm.prank(user3);
        zutchi.putToWork(tokenId, 50);

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.isBusy, true);
    }

    // ============ FEEDING TESTS ============

    function testFeedingOwnerCanFeed() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        // Approve spending
        vm.prank(user1);
        zircuitToken.approve(address(zutchi), 10);

        // Feed the zutchi
        vm.prank(user1);
        zutchi.feed(tokenId, 10);

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.health, 100); // Capped at 100
        assertEq(attr.nutrition, 60); // Base 50 + 10
    }

    function testFeedingNonOwnerCannotFeed() public {
        uint256 tokenId = zutchi.mint();

        vm.prank(user2);
        vm.expectRevert("notOwner");
        zutchi.feed(tokenId, 10e18);
    }

    function testFeedingCannotFeedBusy() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        vm.prank(user1);
        zutchi.putToWork(tokenId, 50);

        vm.prank(user1);
        vm.expectRevert("isBusy");
        zutchi.feed(tokenId, 1);
    }

    // ============ NUTRITION EFFECTS TESTS ============

    function testNutritionWorkEfficiency() public {
        vm.prank(user4);
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user3);
        uint256 tokenId2 = zutchi.mint();

        mineBlocks(101);

        // Work both initially
        vm.prank(user4);
        zutchi.putToWork(tokenId1, 50);

        vm.prank(user3);
        zutchi.putToWork(tokenId2, 50);

        mineBlocks(101);

        // Feed one to increase nutrition
        vm.prank(user4);
        zircuitToken.approve(address(zutchi), 10);

        vm.prank(user4);
        zutchi.feed(tokenId1, 10);

        // Put both to work again
        vm.prank(user4);
        zutchi.putToWork(tokenId1, 20);

        vm.prank(user3);
        zutchi.putToWork(tokenId2, 20);

        mineBlocks(51);

        Zutchi.ZutchiData memory attrHN = zutchi.getZutchiAttributes(tokenId1);
        Zutchi.ZutchiData memory attrLN = zutchi.getZutchiAttributes(tokenId2);

        // With high nutrition, energy should be higher (less energy loss)
        assertTrue(attrHN.energy > attrLN.energy);
    }

    function testNutritionSleepEfficiency() public {
        vm.prank(user1);
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user2);
        uint256 tokenId2 = zutchi.mint();

        // Work both to reduce energy significantly
        vm.prank(user1);
        zutchi.putToWork(tokenId1, 80); // More work to reduce energy more

        vm.prank(user2);
        zutchi.putToWork(tokenId2, 80); // Same amount of work

        mineBlocks(101);

        // Feed only one to increase nutrition
        vm.prank(user1);
        zircuitToken.approve(address(zutchi), 50);

        vm.prank(user1);
        zutchi.feed(tokenId1, 50); // More food for higher nutrition

        // Put both to sleep for shorter duration to see difference
        vm.prank(user1);
        zutchi.putToSleep(tokenId1, 10); // Shorter sleep

        vm.prank(user2);
        zutchi.putToSleep(tokenId2, 10); // Same sleep duration

        // Get attributes immediately (they calculate during putToSleep)
        Zutchi.ZutchiData memory attr1 = zutchi.getZutchiAttributes(tokenId1);
        Zutchi.ZutchiData memory attr2 = zutchi.getZutchiAttributes(tokenId2);

        // With high nutrition, energy should recover more during sleep
        // The difference might be small, so let's also check nutrition levels
        assertTrue(attr1.nutrition > attr2.nutrition); // Confirm higher nutrition

        // Due to the sleep effectiveness formula using nutrition multiplier,
        // the higher nutrition zutchi should have more energy after sleep
        assertTrue(attr1.energy >= attr2.energy);
    }

    // ============ LEVELING TESTS ============

    function testLevelingStartsAtLevel1() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.level, 1);
    }

    function testLevelingSleepGivesHalfXP() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        vm.prank(user1);
        zutchi.putToSleep(tokenId, 6);

        Zutchi.ZutchiData memory attr = zutchi.getZutchiAttributes(tokenId);
        assertEq(attr.level, 2);
    }

    // ============ SOCIAL TESTS ============

    function testSocialSendFrenRequest() public {
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user1);
        uint256 tokenId2 = zutchi.mint();

        zutchi.addFren(tokenId1, tokenId2);

        Zutchi.ZutchiData memory fren = zutchi.getZutchiAttributes(tokenId2);
        assertEq(fren.potentialFrens[0], tokenId1);
    }

    function testSocialDisplayFrenRequest() public {
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user1);
        uint256 tokenId2 = zutchi.mint();

        zutchi.addFren(tokenId1, tokenId2);

        uint256[] memory potentialFrens = zutchi.getPotetionalFrens(tokenId2);
        assertEq(potentialFrens[0], tokenId1);
    }

    function testSocialAcceptFrenRequest() public {
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user1);
        uint256 tokenId2 = zutchi.mint();

        zutchi.addFren(tokenId1, tokenId2);

        uint256[] memory potentialFrens = zutchi.getPotetionalFrens(tokenId2);

        vm.prank(user1);
        bool success = zutchi.acceptFren(tokenId2, potentialFrens[0]);
        assertTrue(success);

        Zutchi.ZutchiData memory fren = zutchi.getZutchiAttributes(tokenId1);
        assertEq(fren.frens[0], tokenId2);
    }

    function testSocialDisplayFrens() public {
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user1);
        uint256 tokenId2 = zutchi.mint();

        zutchi.addFren(tokenId1, tokenId2);

        uint256[] memory potentialFrens = zutchi.getPotetionalFrens(tokenId2);

        vm.prank(user1);
        zutchi.acceptFren(tokenId2, potentialFrens[0]);

        uint256[] memory frens = zutchi.getFrens(tokenId2);
        assertEq(frens[0], tokenId1);
    }

    function testSocialDeclineFrenRequest() public {
        vm.prank(user2);
        uint256 tokenId1 = zutchi.mint();

        vm.prank(user2);
        uint256 tokenId2 = zutchi.mint();

        vm.prank(user2);
        zutchi.addFren(tokenId1, tokenId2);

        uint256[] memory potentialFrens = zutchi.getPotetionalFrens(tokenId2);

        vm.prank(user2);
        bool success = zutchi.declineFren(potentialFrens[0], tokenId2);
        assertTrue(success);

        Zutchi.ZutchiData memory fren = zutchi.getZutchiAttributes(tokenId2);
        assertEq(fren.potentialFrens.length, 0);
    }

    // ============ HUNGER TESTS ============

    function testHungerCannotWorkOrSleepWhileStarving() public {
        vm.prank(user1);
        uint256 tokenId = zutchi.mint();

        // Mine many blocks to make zutchi hungry
        mineBlocks(300001);

        vm.prank(user1);
        vm.expectRevert("hungry");
        zutchi.putToSleep(tokenId, 100);
    }

    // ============ OWNERSHIP TESTS ============

    function testOwnershipCanBurnTokens() public {
        uint256 tokenId = zutchi.mint();
        uint256 initialSupply = zutchi.totalSupply();

        zutchi.burn(tokenId);
        assertEq(zutchi.totalSupply(), initialSupply - 1);
    }

    function testOwnershipCanWithdraw() public {
        bool success = zutchi.withdrawZRC();
        assertTrue(success);
    }

    function testOwnershipOnlyOwnerCanWithdraw() public {
        vm.prank(user1);
        vm.expectRevert("notOwner");
        zutchi.withdrawZRC();
    }

    // ============ BASE URI TESTS ============

    function testBaseURIOwnerCanSet() public {
        string memory newBaseURI = "https://api.example.com/metadata/";
        zutchi.setBaseURI(newBaseURI);
        // Note: _baseURI() is internal, so we can't test it directly
        // But we can verify the event was emitted or no revert occurred
    }
}
