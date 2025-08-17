//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleLotteryOracle
 * @dev Simple oracle that provides random numbers for lottery system
 */
contract SimpleLotteryOracle is Ownable {
    // Events
    event RandomNumberGenerated(
        uint256 indexed requestId,
        uint256 randomNumber,
        address indexed requester
    );

    uint256 private requestCounter;

    constructor() Ownable(msg.sender) {
        requestCounter = 0;
    }

    /**
     * @dev Generate a random number between min and max (inclusive)
     * @param min Minimum value
     * @param max Maximum value
     * @return requestId Request identifier
     * @return randomNumber The generated random number
     */
    function getRandomNumber(
        uint256 min,
        uint256 max
    ) external returns (uint256 requestId, uint256 randomNumber) {
        require(max > min, "Max must be greater than min");

        requestCounter++;
        requestId = requestCounter;

        // Simple pseudo-random number generation
        // NOTE: This is not cryptographically secure - for demo purposes only
        randomNumber =
            min +
            (uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        requestId
                    )
                )
            ) % (max - min + 1));

        emit RandomNumberGenerated(requestId, randomNumber, msg.sender);

        return (requestId, randomNumber);
    }

    /**
     * @dev Get a simple random number between 0 and max-1
     * @param max Maximum value (exclusive)
     * @return randomNumber The generated random number
     */
    function getSimpleRandom(
        uint256 max
    ) external view returns (uint256 randomNumber) {
        require(max > 0, "Max must be greater than 0");

        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender
                    )
                )
            ) % max;
    }
}
