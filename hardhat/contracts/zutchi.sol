//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./LotteryOracle.sol";

// Simple Lottery Oracle interface
interface ISimpleLotteryOracle {
    function getSimpleRandom(uint256 max) external view returns (uint256);
}

/**
 * @title Zutchi
 * @dev A basic ERC-721 NFT contract using OpenZeppelin
 * @author BuidlGuidl
 */
contract Zutchi is ERC721, Ownable {
    // Simple counter for token IDs
    uint256 private _tokenIds;

    // Track actual total supply
    uint256 private _totalSupply;

    // Base URI for token metadata
    string private _baseTokenURI;

    // ✅ Add per-token data structure
    struct ZutchiData {
        uint256 bornAtBlock;
        uint256 energy;
        uint256 health;
        uint256 level;
        uint256 xp;
        bool isBusy;
        uint256 freeAtBlock;
        uint256 hungryAtBlock;
        uint256 lastAteAt;
        uint256 nutrition;
        uint256[] frens;
        uint256[] potentialFrens;
    }

    mapping(uint256 => ZutchiData) public zutchis;

    address public immutable zircuitToken;

    // Oracle contract address for random numbers
    SimpleLotteryOracle public immutable lotteryOracle;

    // Simple Lottery System
    struct SimpleLottery {
        address[] participants;
        uint256 totalPool;
        bool isActive;
        address winner;
        uint256 endBlock;
    }

    SimpleLottery public currentLottery;
    uint256 public constant LOTTERY_DURATION = 43200; // 24 hours: 24 * 60 * 60 / 2 = 43,200 blocks

    // Events
    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event TokenBurned(uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);
    event LevelUp(uint256 level);
    event LotteryStarted(uint256 endBlock);
    event LotteryEntry(address participant, uint256 amount);
    event LotteryWinner(address winner, uint256 prize);

    /**
     * @dev Constructor sets the name and symbol
     */
    constructor(
        address _zircuitToken
    ) ERC721("Zutchi", "ZUTCHI") Ownable(msg.sender) {
        require(_zircuitToken != address(0), "Invalid ZIRCUIT token address");
        zircuitToken = _zircuitToken;

        // Deploy the lottery oracle
        lotteryOracle = new SimpleLotteryOracle();

        // Initialize first lottery
        _startNewLottery();
    }

    /**
     * @dev Mints a new NFT to the specified address
     * @return tokenId The ID of the newly minted token
     */
    function mint() public payable returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _totalSupply++;

        zutchis[newTokenId] = ZutchiData({
            bornAtBlock: block.number,
            energy: 100e18, // Changed from 1e20 to 100e18 (100 tokens)
            health: 100,
            level: 1,
            xp: 1,
            isBusy: false,
            freeAtBlock: 0,
            hungryAtBlock: block.number + 100000,
            lastAteAt: block.number,
            nutrition: 50,
            frens: new uint256[](0),
            potentialFrens: new uint256[](0)
        });

        emit TokenMinted(msg.sender, newTokenId);

        return newTokenId;
    }

    /**
     * @dev Returns the current token ID counter
     * @return Current token ID
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Returns the total supply of existing tokens
     * @return Total supply
     */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev Returns the base URI for token metadata
     * @return Base URI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Burns a token (only owner can burn)
     * @param tokenId ID of the token to burn
     */
    function burn(uint256 tokenId) public onlyOwner {
        _totalSupply--;
        _burn(tokenId);
        emit TokenBurned(tokenId);
    }

    function getZutchiAttributes(
        uint256 tokenId
    ) public view returns (ZutchiData memory) {
        require((_totalSupply >= tokenId), "Token does not exist");
        return zutchis[tokenId];
    }

    function putToSleep(uint256 tokenId, uint256 sleepDuration) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(
            block.number + sleepDuration <= zutchis[tokenId].hungryAtBlock,
            "hungry"
        );

        zutchis[tokenId].isBusy = true;
        zutchis[tokenId].freeAtBlock = block.number + sleepDuration;

        // Calculate effective sleep based on nutrition (higher nutrition = more effective sleep)
        // nutrition is in 1e18 scale, so we divide by 1e18 to get the multiplier
        uint256 effectiveSleep = sleepDuration *
            (zutchis[tokenId].nutrition * 1e16 + 1e18);

        // Energy regeneration with 1e18 scale, capped at 100e18
        zutchis[tokenId].energy = zutchis[tokenId].energy + effectiveSleep >
            100e18
            ? 100e18
            : zutchis[tokenId].energy + effectiveSleep;
        zutchis[tokenId].xp += sleepDuration / 2;
        if (zutchis[tokenId].xp >= 2 ^ zutchis[tokenId].level) {
            zutchis[tokenId].level += 1;
            zutchis[tokenId].xp -= 2 ** zutchis[tokenId].level;
            emit LevelUp(zutchis[tokenId].level);
        }
    }

    function putToWork(uint256 tokenId, uint256 workDuration) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(
            block.number + workDuration <= zutchis[tokenId].hungryAtBlock,
            "hungry"
        );

        // Calculate effective energy with nutrition multiplier (using 1e18 scale)
        uint256 effectiveEnergy = (zutchis[tokenId].energy *
            (zutchis[tokenId].nutrition + 100)) / 100;
        require(effectiveEnergy >= workDuration * 1e18, "noEnergy");

        zutchis[tokenId].isBusy = true;
        zutchis[tokenId].freeAtBlock = block.number + workDuration;
        zutchis[tokenId].energy = effectiveEnergy - (workDuration * 1e18);
        if (zutchis[tokenId].energy < 0) {
            zutchis[tokenId].energy = 0;
        }
        zutchis[tokenId].xp += workDuration;
        if (zutchis[tokenId].xp >= 2 ** zutchis[tokenId].level) {
            zutchis[tokenId].level += 1;
            emit LevelUp(zutchis[tokenId].level);
        }
    }

    //2s blocktime

    function feed(uint256 tokenId, uint256 foodAmount) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(foodAmount > 0, "foodAmount");

        IERC20(zircuitToken).transferFrom(
            msg.sender,
            address(this),
            foodAmount
        );

        // Add to simple lottery
        _addToLottery(msg.sender, foodAmount);

        // Increase nutrition (1 ZIRCUIT = 1e18 nutrition points)
        zutchis[tokenId].nutrition += foodAmount;
        zutchis[tokenId].hungryAtBlock = block.number + (foodAmount * 10000);
        zutchis[tokenId].xp += foodAmount;
        if (zutchis[tokenId].xp >= 2 ** zutchis[tokenId].level) {
            zutchis[tokenId].level += 1;
            emit LevelUp(zutchis[tokenId].level);
        }
    }

    function withdrawZRC() public returns (bool) {
        require(msg.sender == owner(), "notOwner");
        uint256 balance = IERC20(zircuitToken).balanceOf(address(this));
        if (balance > 0) {
            IERC20(zircuitToken).transfer(owner(), balance);
        }
        return balance == 0;
    }

    function getFrens(uint256 tokenId) public view returns (uint256[] memory) {
        return zutchis[tokenId].frens;
    }

    function getPotetionalFrens(
        uint256 tokenId
    ) public view returns (uint256[] memory) {
        return zutchis[tokenId].potentialFrens;
    }

    function addFren(uint256 tokenId, uint256 frenId) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(frenId <= _totalSupply, "Fren token does not exist");
        zutchis[frenId].potentialFrens.push(tokenId);
    }

    function acceptFren(uint256 tokenId, uint256 frenId) public returns (bool) {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(frenId <= _totalSupply, "Fren token does not exist");

        uint256[] storage potentialFrens = zutchis[tokenId].potentialFrens;
        uint256 PFL = potentialFrens.length;

        for (uint256 i = 0; i < PFL; i++) {
            if (potentialFrens[i] == frenId) {
                // Remove from potential frens
                potentialFrens[i] = potentialFrens[PFL - 1];
                potentialFrens.pop();

                // Add to frens for both tokens
                zutchis[tokenId].frens.push(frenId);
                zutchis[frenId].frens.push(tokenId);

                return true;
            }
        }
        return false;
    }

    function declineFren(
        uint256 frenId,
        uint256 tokenId
    ) public returns (bool) {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(frenId <= _totalSupply, "Fren token does not exist");

        uint256[] storage potentialFrens = zutchis[tokenId].potentialFrens;
        uint256 PFL = potentialFrens.length;

        for (uint256 i = 0; i < PFL; i++) {
            if (potentialFrens[i] == frenId) {
                // Remove from potential frens
                potentialFrens[i] = potentialFrens[PFL - 1];
                potentialFrens.pop();
                return true;
            }
        }
        return false;
    }

    // Simple Lottery Functions

    function _startNewLottery() internal {
        currentLottery.isActive = true;
        currentLottery.endBlock = block.number + LOTTERY_DURATION;
        currentLottery.totalPool = 0;
        currentLottery.winner = address(0);
        // Clear participants array
        delete currentLottery.participants;

        emit LotteryStarted(currentLottery.endBlock);
    }

    function _addToLottery(address participant, uint256 amount) internal {
        require(currentLottery.isActive, "No active lottery");

        // Check if lottery should end
        if (block.number >= currentLottery.endBlock) {
            _endLottery();
            _startNewLottery();
        }

        // Add participant (can be added multiple times for more chances)
        currentLottery.participants.push(participant);
        currentLottery.totalPool += amount;

        emit LotteryEntry(participant, amount);
    }

    function _endLottery() internal {
        require(currentLottery.isActive, "Lottery not active");
        currentLottery.isActive = false;

        if (
            currentLottery.participants.length > 0 &&
            currentLottery.totalPool > 0
        ) {
            // Use oracle for random number
            uint256 randomIndex;
            try
                lotteryOracle.getSimpleRandom(
                    currentLottery.participants.length
                )
            returns (uint256 rand) {
                randomIndex = rand;
            } catch {
                // Fallback to block-based randomness
                randomIndex =
                    uint256(
                        keccak256(
                            abi.encodePacked(block.timestamp, block.prevrandao)
                        )
                    ) %
                    currentLottery.participants.length;
            }

            address winner = currentLottery.participants[randomIndex];
            currentLottery.winner = winner;

            // Transfer prize to winner
            IERC20(zircuitToken).transfer(winner, currentLottery.totalPool);

            emit LotteryWinner(winner, currentLottery.totalPool);
        }
    }

    // Public function to manually end lottery
    function endLottery() external onlyOwner {
        require(currentLottery.isActive, "No active lottery");
        require(
            block.number >= currentLottery.endBlock,
            "Lottery not finished"
        );

        _endLottery();
        _startNewLottery();
    }

    // View functions for lottery info
    function getCurrentLotteryInfo()
        external
        view
        returns (
            uint256 totalPool,
            uint256 endBlock,
            uint256 participantCount,
            bool isActive,
            address winner
        )
    {
        return (
            currentLottery.totalPool,
            currentLottery.endBlock,
            currentLottery.participants.length,
            currentLottery.isActive,
            currentLottery.winner
        );
    }
}
