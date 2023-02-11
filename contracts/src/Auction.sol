// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title Auction
 * @author Naama Paulemont
 * @notice Implements the english auction logic for the podcast
 * @notice Auction decides who gets to be the next guest on the podcast
 */
contract Auction {
    event AuctionStart();
    event Bid();
    event AuctionEnd();

    uint256 public tokenId;
    uint256 public endAt;
    bool public started;
    bool public ended;

    address public highestBidder;
    uint256 public highestBid;
    mapping(address => uint256) public bids;

    constructor(uint256 _tokenId, uint256 _endAt, uint256 _startingBid){
        tokenId = _tokenId;
        endAt = _endAt;
        highestBid = _startingBid;
        started = false;
        ended = false;
    }
    /**
     * @dev Starts the auction manually or automatically
     */
    function startAuction() public {}

    /**
     * @dev Ends the auction manually or automatically
     */
    function endAuction() public {}

    function bid() public payable {}

    function withdraw() public {}
}