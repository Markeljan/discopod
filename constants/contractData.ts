export const PODCHAIN_ADDRESS = "0x00B69629dc38C6AB09280bF5cD40d1E8adcF549c"
export const PODCHAIN_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_defaultMetadataUri",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "GuestIsHost",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InsufficientFunds",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InvalidHost",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        }
      ],
      "name": "TransferBatch",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TransferSingle",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "URI",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "VOTE_VALUE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_podcastId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_topic",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_episodeUri",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_collectibleValue",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_prevGuest",
          "type": "address"
        }
      ],
      "name": "addEpisode",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "podcastId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "guestAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_votes",
          "type": "uint256"
        }
      ],
      "name": "addVote",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "owners",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        }
      ],
      "name": "balanceOfBatch",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "balances",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_desc",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "_headless",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "_podMetadataUri",
          "type": "string"
        }
      ],
      "name": "createPodcast",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "defaultMetadataUri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "episodeIdToEpisode",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "podcastId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "episodeId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "episodeUri",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "host",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "guest",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "prevHost",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "prevGuest",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "nextGuest",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "nextHost",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "topic",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "collectibleValue",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_episodeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_podcastId",
          "type": "uint256"
        }
      ],
      "name": "mintEpisodeCollectible",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "podcastId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "guestAddress",
          "type": "address"
        }
      ],
      "name": "nominate",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "nominations",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "podcastIdToPodcast",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "episodeSize",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "host",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "guest",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "headless",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "topic",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "hostRevenueShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "guestRevenueShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "publicGoodsShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "podcastId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "latestEpisodeId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "fundValue",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "voteBidValue",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "endsAt",
              "type": "uint256"
            }
          ],
          "internalType": "struct Pod.VoteBid",
          "name": "currentVoteBid",
          "type": "tuple"
        },
        {
          "internalType": "string",
          "name": "metadataUri",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "ids",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "amounts",
          "type": "uint256[]"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeBatchTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_podcastId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "hostRevenueShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "guestRevenueShare",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "publicGoodsShare",
          "type": "uint256"
        }
      ],
      "name": "setRevenueShare",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "tokenIdToMetadataUri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "uri",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_podcastId",
          "type": "uint256"
        }
      ],
      "name": "withdrawPodcastFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawPublicGoodsFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]