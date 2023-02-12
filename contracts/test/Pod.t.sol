// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "../src/Pod.sol";
import "../lib/forge-std/src/Test.sol";
contract PodTest is Test {
    Pod public pod;
    function setUp() public {
        pod = new Pod("https://contracturi.com");
    }

    function testCreatePodcast() public {
        pod.createPodcast("Podcast Name", "Podcast Description", "Podcast Metadata URI");
        assertEq(pod.getLatestTokenId(), 1);
    }
    function testPodcastName() public {
        pod.createPodcast("Podcast Name", "Podcast Description", "Podcast Metadata URI");
        assertEq(pod.podcastNameToId("Podcast Name"), 1);
    }
    
}
