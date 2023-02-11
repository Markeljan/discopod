#!/usr/bin/env bash

# Read the RPC URL
echo Enter Your RPC URL:
echo Example: "https://eth-mainnet.alchemyapi.io/v2/XXXXXXXXXX"
read -s rpc

# Read the contract name
echo Which contract do you want to deploy \(eg Greeter\)?
read contract

# Read the constructor arguments
echo Enter constructor arguments separated by spaces \(eg 1 2 3\):
read -ra args

#Read the Private Key
echo Enter Your Private Key:
read -s prvk

forge create ./src/${contract}.sol:${contract} -i --rpc-url $rpc --constructor-args ${args} --legacy --private-key $prvk

# manual: forge create ./src/Pod.sol:Pod --via-ir --rpc-url $RPC_URL --constructor-args "https://METADATAURI.com" --legacy --private-key $PRIVATE_KEY