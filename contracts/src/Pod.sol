// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Pod {
    struct Episode {
        uint256 podcastId;
        string episodeUri;
        address host;
        address[] guest;
        address prevHost;
        address prevGuest;
        address nextGuest;
        address nextHost;
        uint256 timestamp;
        string topic;
        Auction auction;
    }

    struct Podcast {
        Episode[] episodes;
        address[] hosts;
        address[] guests;
        address host;
        bool headless;
        string[] topics;
        uint256 hostRevenueShare;
        uint256 guestRevenueShare;
        uint256 publicGoodsShare;
    }

    struct Auction {
        uint256 auctionId;
        uint256 auctionStart;
        uint256 auctionEnd;
        uint256 auctionDuration;
        uint256 auctionStartPrice;
        uint256 auctionEndPrice;
        uint256 auctionCurrentPrice;
        uint256 auctionCurrentBid;
        uint256 episodeId;
        address auctionCurrentBidder;
        bool auctionEnded;
        bool auctionStarted;
        bool auctionCancelled;
    }
    function startPodcast() public returns (uint256 podcastId){

    }
    function setRevenueShare(uint256 podcastId, uint256 hostRevenueShare, uint256 guestRevenueShare, uint256 publicGoodsShare) public {

    }
    function addEpisode(uint256 podcastId, string memory episodeUri, string memory topic) public returns (uint256 episodeId){

    }
    function startAuction(uint256 episodeId, uint256 auctionStartPrice, uint256 auctionEndPrice, uint256 auctionDuration) public returns (uint256 auctionId){

    }

    function transferGuest() public {

    }
    function transferHost() public {

    }
    function transferToPublicGoods() public {

    }
    function transferToHost() public {

    }
    function transferToGuest() public {

    }
    function collect() public {

    }
    
}
