// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "solmate/tokens/ERC1155.sol";

/**
 * @title Pod
 * @author Naama Paulemont
 * @notice The Pod contract is a headless podcast protocol that allows hosts to create podcasts and episodes, and for guests to be nominated to be on the show.
 */
contract Pod is ERC1155 {
    error InvalidHost();
    error GuestIsHost();
    error InsufficientFunds();
    error WithdrawalFailed();

    /// CONSTANTS ///
    uint256 public constant VOTE_VALUE = 0.01 ether;

    /// STRUCTS ///
    struct Episode {
        uint256 podcastId;
        uint256 episodeId;
        string episodeUri;
        address host;
        address guest;
        address prevHost;
        address prevGuest;
        address nextGuest;
        address nextHost;
        uint256 timestamp;
        string topic;
        uint256 collectibleValue;
    }
    struct Podcast {
        mapping(uint256 => Episode) episodes;
        uint256 episodeSize;
        address host;
        address guest;
        string topic;
        RevenueShare revenueShares;
        uint256 podcastId;
        uint256 latestEpisodeId;
        uint256 fundValue;
        uint256 voteBidValue;
        string metadataUri;
        string name;
        string description;
    }

    struct RevenueShare {
        uint256 hostRevenueShare;
        uint256 guestRevenueShare;
        uint256 publicGoodsShare;
    }

    /// VARIABLES ///
    string public defaultMetadataUri;
    /// @notice Latest unused token id
    uint256 latestTokenId;
    uint256 publicGoodsValue;
    mapping(uint256 => Podcast) public podcastIdToPodcast;
    mapping(uint256 => Episode) public episodeIdToEpisode;
    mapping(address => mapping(uint256 => address)) public nominations;
    mapping(address => uint256) public votes;
    mapping(uint256 => string) public tokenIdToMetadataUri;
    mapping(string => uint256) public podcastNameToId;
    mapping(address => uint256) public fundBalanceOf;

    /// CONSTRUCTOR ///
    constructor(string memory _defaultMetadataUri) {
        defaultMetadataUri = _defaultMetadataUri;
    }

    /// PUBLIC/EXTERNAL FUNCTIONS ///
    function createPodcast(
        string memory _name,
        string memory _desc,
        string memory _podMetadataUri
    ) external {
        latestTokenId += 1;
        Podcast storage newPodcast = podcastIdToPodcast[latestTokenId];
        newPodcast.host = msg.sender;
        newPodcast.podcastId = latestTokenId;
        newPodcast.metadataUri = _podMetadataUri;
        newPodcast.name = _name;
        newPodcast.description = _desc;
        tokenIdToMetadataUri[latestTokenId] = _podMetadataUri;
        podcastNameToId[_name] = latestTokenId;
        _mint(msg.sender, latestTokenId, 1, "");
    }

    function addEpisode(
        uint256 _podcastId,
        string memory _topic,
        string memory _episodeUri,
        uint256 _collectibleValue,
        address _prevGuest
    ) external {
        if (!(podcastIdToPodcast[_podcastId].host == msg.sender)) {
            revert InvalidHost();
        }
        latestTokenId += 1;
        Episode storage newEpisode = episodeIdToEpisode[latestTokenId];
        podcastIdToPodcast[_podcastId].episodeSize += 1;

        newEpisode.podcastId = _podcastId;
        newEpisode.episodeId = latestTokenId;
        newEpisode.episodeUri = _episodeUri;
        newEpisode.host = podcastIdToPodcast[_podcastId].host;
        newEpisode.prevHost = podcastIdToPodcast[_podcastId].host;
        newEpisode.prevGuest = _prevGuest;
        newEpisode.timestamp = block.timestamp;
        newEpisode.topic = _topic;
        newEpisode.collectibleValue = _collectibleValue;

        tokenIdToMetadataUri[latestTokenId] = _episodeUri;
    }

    function nominate(uint256 podcastId, address guestAddress)
        external
        payable
    {
        if (msg.value != VOTE_VALUE) {
            revert InsufficientFunds();
        }
        if (guestAddress == podcastIdToPodcast[podcastId].host) {
            revert GuestIsHost();
        }
        votes[guestAddress] += 1;
        podcastIdToPodcast[podcastId].fundValue += VOTE_VALUE;
        publicGoodsValue += VOTE_VALUE;
        nominations[guestAddress][podcastId] = msg.sender;
    }

    function addVote(
        uint256 podcastId,
        address guestAddress,
        uint256 _votes
    ) external payable {
        uint256 votesValue = _votes * VOTE_VALUE;
        if (msg.value != votesValue) {
            revert InsufficientFunds();
        }
        if (guestAddress == podcastIdToPodcast[podcastId].host) {
            revert GuestIsHost();
        }
        votes[guestAddress] += _votes;
        podcastIdToPodcast[podcastId].fundValue += votesValue;
        publicGoodsValue += votesValue;
    }

    function setRevenueShare(
        uint256 _podcastId,
        uint256 hostRevenueShare,
        uint256 guestRevenueShare,
        uint256 publicGoodsShare
    ) external {
        if (podcastIdToPodcast[_podcastId].host != msg.sender) {
            revert InvalidHost();
        }
        podcastIdToPodcast[_podcastId]
            .revenueShares
            .hostRevenueShare = hostRevenueShare;
        podcastIdToPodcast[_podcastId]
            .revenueShares
            .guestRevenueShare = guestRevenueShare;
        podcastIdToPodcast[_podcastId]
            .revenueShares
            .publicGoodsShare = publicGoodsShare;
    }

    // @junaama TODO: implement this
    // function closeVoting(uint256 _podcastId, uint256 _epsiodeId) public {}

    function mintEpisodeCollectible(uint256 _episodeId, uint256 _podcastId)
        public
        payable
    {
        if (msg.value != episodeIdToEpisode[_episodeId].collectibleValue) {
            revert InsufficientFunds();
        }
        uint256 publicGoodsShare = msg.value *
            (podcastIdToPodcast[_podcastId].revenueShares.publicGoodsShare /
                100);
        uint256 hostRevenueShare = msg.value *
            (podcastIdToPodcast[_podcastId].revenueShares.hostRevenueShare /
                100);
        uint256 guestRevenueShare = msg.value *
            (podcastIdToPodcast[_podcastId].revenueShares.guestRevenueShare /
                100);
        publicGoodsValue += publicGoodsShare;
        fundBalanceOf[podcastIdToPodcast[_podcastId].host] += hostRevenueShare;
        fundBalanceOf[episodeIdToEpisode[_episodeId].guest] += guestRevenueShare;
        _mint(msg.sender, _episodeId, 1, "");
    }

    function withdrawPodcastFunds(uint256 _podcastId) public payable {
        if (msg.sender != podcastIdToPodcast[_podcastId].host) {
            revert InvalidHost();
        }
        (bool succ, ) = msg.sender.call{
            value: podcastIdToPodcast[_podcastId].fundValue
        }("");
        if (!succ) {
            revert WithdrawalFailed();
        }
    }

    function withdrawPublicGoodsFunds(address _publicGoodsAddress) external payable {
        require(
            msg.sender == address(this),
            "Only the contract can withdraw funds"
        );
        (bool succ, ) = _publicGoodsAddress.call{value: publicGoodsValue}("");
        if(!succ){
            revert WithdrawalFailed();
        }
    }

    function getLatestTokenId() public view returns (uint256) {
        return latestTokenId;
    }

    /// FUNCTION OVERRIDES ///
    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        if (bytes(tokenIdToMetadataUri[_tokenId]).length != 0)
            return tokenIdToMetadataUri[_tokenId];
        return defaultMetadataUri;
    }
}
