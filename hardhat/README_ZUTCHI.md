# Zutchi ERC-721 NFT Contract

A basic ERC-721 NFT contract built with OpenZeppelin v5 and Solidity 0.8.20.

## Features

- **ERC-721 Standard**: Full compliance with the ERC-721 non-fungible token standard
- **Ownable**: Access control for administrative functions
- **Mintable**: Only the contract owner can mint new NFTs
- **Burnable**: Only the contract owner can burn NFTs
- **Unlimited Supply**: No maximum supply limit - mint as many as needed
- **Metadata Support**: Base URI can be set for token metadata
- **Gas Optimized**: Efficient implementation with minimal gas costs

## Contract Functions

### View Functions
- `name()` - Returns the token collection name ("Zutchi")
- `symbol()` - Returns the token collection symbol ("ZUTCHI")
- `totalSupply()` - Returns the current number of existing NFTs
- `getCurrentTokenId()` - Returns the last minted token ID
- `ownerOf(uint256 tokenId)` - Returns the owner of a specific token
- `balanceOf(address owner)` - Returns the number of tokens owned by an address

### State-Changing Functions (Owner Only)
- `mint(address to)` - Mints a new NFT to the specified address
- `burn(uint256 tokenId)` - Burns (destroys) a specific token
- `setBaseURI(string memory baseURI)` - Sets the base URI for token metadata

### Events
- `TokenMinted(address indexed to, uint256 indexed tokenId)` - Emitted when a new token is minted
- `TokenBurned(uint256 indexed tokenId)` - Emitted when a token is burned
- `BaseURIUpdated(string newBaseURI)` - Emitted when the base URI is updated

## Deployment

The contract is deployed with **no constructor parameters** - just deploy and it's ready to use!

## Usage Examples

### Minting NFTs
```solidity
// Only the contract owner can mint
await zutchiContract.mint(userAddress);
```

### Burning NFTs
```solidity
// Only the contract owner can burn
await zutchiContract.burn(tokenId);
```

### Setting Metadata URI
```solidity
// Only the contract owner can set base URI
await zutchiContract.setBaseURI("https://api.example.com/metadata/");
```

## Testing

Run the test suite with:
```bash
yarn test
```

The tests cover:
- Contract deployment and initialization
- NFT minting functionality (unlimited supply)
- Access control (only owner can mint/burn)
- Supply tracking
- Base URI management

## Gas Costs

- **Deployment**: ~1.2M gas
- **Minting**: ~80K - 120K gas
- **Burning**: ~35K gas
- **Setting Base URI**: ~90K gas

## Security Features

- **Access Control**: Administrative functions are restricted to the contract owner
- **Safe Minting**: Uses OpenZeppelin's `_safeMint` for secure token creation
- **Input Validation**: Proper checks for token existence and ownership

## Development

This contract is part of a Scaffold-ETH 2 project. To deploy locally:

1. Start the local blockchain: `yarn chain`
2. Deploy the contract: `yarn deploy`
3. Start the frontend: `yarn start`

The contract will be available at the debug page (`/debug`) for testing and interaction.

## Key Differences from Previous Version

- ✅ **No maximum supply limit** - mint unlimited NFTs
- ✅ **Simplified constructor** - no parameters needed
- ✅ **Removed EIP-6551 complexity** - basic ERC-721 functionality
- ✅ **Cleaner codebase** - easier to understand and maintain 