// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "solmate/tokens/ERC1155.sol";
import "solmate/auth/Owned.sol";

/**
 * @title Pod
 * @author junaama (https://github.com/junaama)
 * @notice The Pod contract is a headless podcast protocol that allows hosts to create podcasts and episodes, and for guests to be nominated to be on the show.
 */
contract Pod is ERC1155, ERC1155TokenReceiver, Owned {
    /// ERRORS ///
    error InvalidHost();
    error GuestCantBeHost();
    error InsufficientFunds();
    error WithdrawalFailed();
    error NoBalance();
    error PollAlreadyClosed();
    error PollNotOverYet();
    error GuestAlreadyNominated();
    error GuestNotNominated();

    /// CONSTANTS ///
    uint256 public constant VOTE_VALUE = 0.0001 ether;

    /// STRUCTS ///
    struct Episode {
        uint256 podcastId;
        uint256 episodeId;
        uint256 timestamp;
        uint256 collectibleValue;
        address host;
        address guest;
        address prevHost;
        address prevGuest;
        address nextGuest;
        address nextHost;
        string episodeUri;
    }
    struct Podcast {
        uint256 podcastId;
        uint256 latestEpisodeId;
        uint256 balance;
        uint256 episodeSize;
        uint256 currentPollId;
        string name;
        string description;
        string topic;
        string metadataUri;
        address host;
        address guest;
        mapping(uint256 => Episode) episodes;
        RevenueShare revenueShares;
    }
    struct Poll {
        uint256 podcastId;
        uint256 endsAt;
        bool isPollOpen;
        uint256 highestVoteCount;
        address currentWinningAddress;
        mapping(address => uint256) votes;
        mapping(address => bool) nominated;
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

    /// @notice Latest unused poll id
    uint256 latestPollId;

    uint256 publicGoodsValue;
    mapping(uint256 => Podcast) public podcastIdToPodcast;
    mapping(uint256 => Episode) public episodeIdToEpisode;
    mapping(uint256 => Poll) public pollIdToPoll;
    mapping(uint256 => string) public tokenIdToMetadataUri;
    mapping(string => uint256) public podcastNameToId;
    mapping(address => uint256) public fundBalanceOf;
    uint256[] public podcastIdList;
    mapping(uint256 => uint256[]) public podcastIdToEpisodeIdList;

    /// CONSTRUCTOR ///
    constructor(string memory _defaultMetadataUri) Owned(msg.sender) {
        defaultMetadataUri = _defaultMetadataUri;
        emit URI(_defaultMetadataUri, 0);
    }

    /// PUBLIC/EXTERNAL FUNCTIONS ///
    function createPodcast(
        string memory _name,
        string memory _desc,
        string memory _podMetadataUri,
        string memory _topic
    ) external {
        latestTokenId += 1;
        Podcast storage newPodcast = podcastIdToPodcast[latestTokenId];
        newPodcast.host = msg.sender;
        newPodcast.podcastId = latestTokenId;
        newPodcast.metadataUri = _podMetadataUri;
        newPodcast.name = _name;
        newPodcast.description = _desc;
        newPodcast.topic = _topic;
        tokenIdToMetadataUri[latestTokenId] = _podMetadataUri;
        podcastNameToId[_name] = latestTokenId;
        podcastIdList.push(latestTokenId);
        _mint(msg.sender, latestTokenId, 1, "");
    }

    function addEpisode(
        uint256 _podcastId,
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
        latestPollId += 1;

        newEpisode.podcastId = _podcastId;
        newEpisode.episodeId = latestTokenId;
        newEpisode.episodeUri = _episodeUri;
        newEpisode.host = podcastIdToPodcast[_podcastId].host;
        newEpisode.prevHost = podcastIdToPodcast[_podcastId].host;
        newEpisode.prevGuest = _prevGuest;
        newEpisode.timestamp = block.timestamp;
        newEpisode.collectibleValue = _collectibleValue;

        podcastIdToPodcast[_podcastId].latestEpisodeId = latestTokenId;
        podcastIdToPodcast[_podcastId].episodes[latestTokenId] = newEpisode;

        podcastIdToPodcast[_podcastId].currentPollId = latestPollId;
        podcastIdToEpisodeIdList[_podcastId].push(latestTokenId);
        tokenIdToMetadataUri[latestTokenId] = _episodeUri;
    }

    function nominate(
        uint256 _podcastId,
        address guestAddress
    ) external payable {
        if (msg.value != VOTE_VALUE) {
            revert InsufficientFunds();
        }
        if (guestAddress == podcastIdToPodcast[_podcastId].host) {
            revert GuestCantBeHost();
        }
        uint256 currentPollId = podcastIdToPodcast[_podcastId].currentPollId;
        Poll storage currentPoll = pollIdToPoll[currentPollId];
        if (currentPoll.isPollOpen == false) {
            revert PollAlreadyClosed();
        }
        if (currentPoll.nominated[guestAddress] == true) {
            revert GuestAlreadyNominated();
        }
        currentPoll.nominated[guestAddress] = true;
        currentPoll.votes[guestAddress] += 1;
        if (currentPoll.votes[guestAddress] > currentPoll.highestVoteCount) {
            currentPoll.highestVoteCount = currentPoll.votes[guestAddress];
            currentPoll.currentWinningAddress = guestAddress;
        }
        publicGoodsValue += VOTE_VALUE;
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
            revert GuestCantBeHost();
        }
        uint256 currentPollId = podcastIdToPodcast[podcastId].currentPollId;
        Poll storage currentPoll = pollIdToPoll[currentPollId];
        if (currentPoll.isPollOpen == false) {
            revert PollAlreadyClosed();
        }
        if (currentPoll.nominated[guestAddress] == false) {
            revert GuestNotNominated();
        }
        currentPoll.votes[guestAddress] += _votes;
        if (currentPoll.votes[guestAddress] > currentPoll.highestVoteCount) {
            currentPoll.highestVoteCount = currentPoll.votes[guestAddress];
            currentPoll.currentWinningAddress = guestAddress;
        }

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

    function closePoll(uint256 _podcastId) public {
        uint256 currentPollId = podcastIdToPodcast[_podcastId].currentPollId;
        Poll storage currentPoll = pollIdToPoll[currentPollId];
        if (currentPoll.endsAt <= block.timestamp) {
            revert PollNotOverYet();
        }
        if (!currentPoll.isPollOpen) {
            revert PollAlreadyClosed();
        }
        currentPoll.isPollOpen = false;
        address winner = currentPoll.currentWinningAddress;
        Podcast storage _podcast = podcastIdToPodcast[_podcastId];
        _podcast.guest = winner;
    }

    function mintEpisodeCollectible(
        uint256 _episodeId,
        uint256 _podcastId
    ) public payable {
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
        fundBalanceOf[
            episodeIdToEpisode[_episodeId].guest
        ] += guestRevenueShare;
        _mint(msg.sender, _episodeId, 1, "");
    }

    function withdrawFunds() public payable {
        if (fundBalanceOf[msg.sender] <= 0) {
            revert NoBalance();
        }
        (bool succ, ) = msg.sender.call{value: fundBalanceOf[msg.sender]}("");
        if (!succ) {
            revert WithdrawalFailed();
        }
    }

    function withdrawPublicGoodsFunds(
        address _publicGoodsAddress
    ) external payable onlyOwner {
        (bool succ, ) = _publicGoodsAddress.call{value: publicGoodsValue}("");
        if (!succ) {
            revert WithdrawalFailed();
        }
    }

    function getLatestTokenId() public view returns (uint256) {
        return latestTokenId;
    }

    function getCurrentPollInfo(
        uint256 _podcastId
    ) public view returns (uint256, bool, address, uint256) {
        uint256 currentPollId = podcastIdToPodcast[_podcastId].currentPollId;
        return (
            pollIdToPoll[currentPollId].endsAt,
            pollIdToPoll[currentPollId].isPollOpen,
            pollIdToPoll[currentPollId].currentWinningAddress,
            pollIdToPoll[currentPollId].highestVoteCount
        );
    }

    function getCurrentPollAddressVotes(
        uint256 _podcastId,
        address _guestAddress
    ) public view returns (uint256) {
        uint256 currentPollId = podcastIdToPodcast[_podcastId].currentPollId;
        return pollIdToPoll[currentPollId].votes[_guestAddress];
    }

    function getPodcastIdList() public view returns (uint256[] memory) {
        return podcastIdList;
    }

    function getEpisodeIdList(
        uint256 _podcastId
    ) public view returns (uint256[] memory) {
        return podcastIdToEpisodeIdList[_podcastId];
    }

    /// FUNCTION OVERRIDES ///
    function uri(
        uint256 _tokenId
    ) public view override returns (string memory) {
        if (bytes(tokenIdToMetadataUri[_tokenId]).length != 0)
            return tokenIdToMetadataUri[_tokenId];
        return defaultMetadataUri;
    }
}
