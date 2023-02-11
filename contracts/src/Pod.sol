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
        bool headless;
        string topic;
        uint256 hostRevenueShare;
        uint256 guestRevenueShare;
        uint256 publicGoodsShare;
        uint256 podcastId;
        uint256 latestEpisodeId;
        uint256 fundValue;
        uint256 voteBidValue;
        VoteBid currentVoteBid;
        string metadataUri;
        string name;
        string description;
    }
    struct VoteBid {
        uint256 endsAt;
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

    /// CONSTRUCTOR ///
    constructor(string memory _defaultMetadataUri) {
        defaultMetadataUri = _defaultMetadataUri;
    }

    /// PUBLIC/EXTERNAL FUNCTIONS ///
    function createPodcast(
        string memory _name,
        string memory _desc,
        bool _headless,
        string memory _podMetadataUri
    ) external {
        latestTokenId += 1;
        Podcast storage newPodcast = podcastIdToPodcast[latestTokenId];
        newPodcast.host = msg.sender;
        newPodcast.headless = _headless;
        newPodcast.podcastId = latestTokenId;
        newPodcast.metadataUri = _podMetadataUri;
        newPodcast.name = _name;
        newPodcast.description = _desc;
        tokenIdToMetadataUri[latestTokenId] = _podMetadataUri;
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
        podcastIdToPodcast[_podcastId].episodeSize += 1;
    }

    function nominate(uint256 podcastId, address guestAddress)
        external
        payable
    {
        require(
            msg.value == VOTE_VALUE,
            "Insufficient funds for nomination amount"
        );
        if (msg.value != VOTE_VALUE) {
            revert InsufficientFunds();
        }
        if (guestAddress == podcastIdToPodcast[podcastId].host) {
            revert GuestIsHost();
        }
        nominations[guestAddress][podcastId] = msg.sender;
        votes[guestAddress] += 1;
        podcastIdToPodcast[podcastId].fundValue += VOTE_VALUE;
        publicGoodsValue += VOTE_VALUE;
    }

    function addVote(
        uint256 podcastId,
        address guestAddress,
        uint256 _votes
    ) external payable {
        uint256 votesValue = _votes * VOTE_VALUE;
        require(msg.value == votesValue, "Insufficient funds for vote amount");
        require(
            nominations[guestAddress][podcastId] != address(0),
            "Guest is not nominated"
        );
        require(
            guestAddress != podcastIdToPodcast[podcastId].host,
            "Guest is the host"
        );
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
        require(
            podcastIdToPodcast[_podcastId].host == msg.sender,
            "Only the host can set the revenue share"
        );
        podcastIdToPodcast[_podcastId].hostRevenueShare = hostRevenueShare;
        podcastIdToPodcast[_podcastId].guestRevenueShare = guestRevenueShare;
        podcastIdToPodcast[_podcastId].publicGoodsShare = publicGoodsShare;
    }

    // @junaama TODO: implement this
    // function closeVoting(uint256 _podcastId, uint256 _epsiodeId) public {}

    function mintEpisodeCollectible(uint256 _episodeId, uint256 _podcastId)
        public
        payable
    {
        require(
            msg.value == episodeIdToEpisode[_episodeId].collectibleValue,
            "Insufficient funds for collectible value"
        );
        uint256 publicGoodsShare = msg.value *
            (podcastIdToPodcast[_podcastId].publicGoodsShare / 100);
        uint256 hostRevenueShare = msg.value *
            (podcastIdToPodcast[_podcastId].hostRevenueShare / 100);
        uint256 guestRevenueShare = msg.value *
            (podcastIdToPodcast[_podcastId].guestRevenueShare / 100);
        publicGoodsValue += publicGoodsShare;
        _mint(msg.sender, _episodeId, 1, "");
    }

    function withdrawPodcastFunds(uint256 _podcastId) public payable {
        require(
            msg.sender == podcastIdToPodcast[_podcastId].host,
            "Only the host can withdraw funds"
        );
    }

    function withdrawPublicGoodsFunds() external payable {
        require(
            msg.sender == address(this),
            "Only the contract can withdraw funds"
        );
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
