// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "../src/Pod.sol";
import "solmate/tokens/ERC1155.sol";
import "../lib/forge-std/src/Test.sol";
contract PodTest is Test, ERC1155TokenReceiver {
    Pod public pod;
    function setUp() public {
        pod = new Pod("https://contracturi.com");
    }

    function testCreatePodcast() public {
        pod.createPodcast("Podcast Name", "Podcast Description", "Podcast Metadata URI", "Podcast Topic");
        assertEq(pod.getLatestTokenId(), 1);
    }
    function testPodcastName() public {
        pod.createPodcast("Podcast Name", "Podcast Description", "Podcast Metadata URI", "podcast topic");
        assertEq(pod.podcastNameToId("Podcast Name"), 1);
    }

}
