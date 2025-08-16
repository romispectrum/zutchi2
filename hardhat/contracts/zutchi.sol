//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

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

    address immutable public zircuitToken;

    
    
    // Events
    event TokenMinted(address indexed to, uint256 indexed tokenId);
    event TokenBurned(uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);
    event LevelUp(uint256 level);
    
    /**
     * @dev Constructor sets the name and symbol
     */
    constructor(address _zircuitToken) ERC721("Zutchi", "ZUTCHI") Ownable(msg.sender) {
        require(_zircuitToken != address(0), "Invalid ZIRCUIT token address");
        zircuitToken = _zircuitToken;
    }
    
    /**
     * @dev Mints a new NFT to the specified address
     * @return tokenId The ID of the newly minted token
     */
    function mint() payable public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        _totalSupply++;

        zutchis[newTokenId] = ZutchiData({
            bornAtBlock: block.number,
            energy: 100e18,  // Changed from 1e20 to 100e18 (100 tokens)
            health: 100,
            level: 1,
            xp: 1,
            isBusy: false,
            freeAtBlock: 0,
            hungryAtBlock: block.number+100000,
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

    function getZutchiAttributes(uint256 tokenId) public view returns (ZutchiData memory) {
        require((_totalSupply >= tokenId), "Token does not exist");
        return zutchis[tokenId];
    }


    function putToSleep(uint256 tokenId, uint256 sleepDuration) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(block.number+sleepDuration <= zutchis[tokenId].hungryAtBlock, "hungry");
        
        zutchis[tokenId].isBusy = true;
        zutchis[tokenId].freeAtBlock = block.number + sleepDuration;
        
        // Calculate effective sleep based on nutrition (higher nutrition = more effective sleep)
        // nutrition is in 1e18 scale, so we divide by 1e18 to get the multiplier
        uint256 effectiveSleep = sleepDuration * (zutchis[tokenId].nutrition*1e16 + 1e18);
        
        // Energy regeneration with 1e18 scale, capped at 100e18
        zutchis[tokenId].energy = zutchis[tokenId].energy + effectiveSleep > 100e18 ? 
            100e18 : zutchis[tokenId].energy + effectiveSleep;
        zutchis[tokenId].xp += sleepDuration/2;
        if (zutchis[tokenId].xp >= 2^zutchis[tokenId].level) {
            zutchis[tokenId].level += 1;
            zutchis[tokenId].xp -= 2**zutchis[tokenId].level;
            emit LevelUp(zutchis[tokenId].level);
        }
    }

    function putToWork(uint256 tokenId, uint256 workDuration) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(block.number+workDuration <= zutchis[tokenId].hungryAtBlock, "hungry");
        
        // Calculate effective energy with nutrition multiplier (using 1e18 scale)
        uint256 effectiveEnergy = zutchis[tokenId].energy * (zutchis[tokenId].nutrition + 100) / 100;
        require(effectiveEnergy >= workDuration * 1e18, "noEnergy");
        
        zutchis[tokenId].isBusy = true;
        zutchis[tokenId].freeAtBlock = block.number + workDuration;
        zutchis[tokenId].energy = effectiveEnergy - (workDuration * 1e18);
        if (zutchis[tokenId].energy < 0) {
            zutchis[tokenId].energy = 0;
        }
        zutchis[tokenId].xp += workDuration;
        if (zutchis[tokenId].xp >= 2**zutchis[tokenId].level) {
            zutchis[tokenId].level += 1;
            emit LevelUp(zutchis[tokenId].level);
        }
    }

    function feed(uint256 tokenId, uint256 foodAmount) public {
        require(msg.sender == ownerOf(tokenId), "notOwner");
        require(block.number >= zutchis[tokenId].freeAtBlock, "isBusy");
        require(foodAmount > 0, "foodAmount");

        IERC20(zircuitToken).transferFrom(msg.sender, address(this), foodAmount);

        // Increase nutrition (1 ZIRCUIT = 1e18 nutrition points)
        zutchis[tokenId].nutrition += foodAmount;
        zutchis[tokenId].hungryAtBlock = block.number+(foodAmount*10000);
        zutchis[tokenId].xp += foodAmount;
        if (zutchis[tokenId].xp >= 2**zutchis[tokenId].level) {
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

    function getPotetionalFrens(uint256 tokenId) public view returns (uint256[] memory) {
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
                potentialFrens[i] = potentialFrens[PFL-1];
                potentialFrens.pop();
                
                // Add to frens for both tokens
                zutchis[tokenId].frens.push(frenId);
                zutchis[frenId].frens.push(tokenId);
                
                return true;
            }
        }
        return false;
    }

    function declineFren(uint256 frenId, uint256 tokenId) public returns (bool) {
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





}
