export const CONTRACT_ADDRESS = '0x7637f41e06Fe036dA6EC297F23dd23Df9CBef2Dd';

export const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_podcastName",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_podcastId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getPodcastId",
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
      "inputs": [],
      "name": "getPodcastName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]