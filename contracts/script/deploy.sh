#!/usr/bin/env bash

#Read the Private Key
echo Enter Your Private Key:
read -s prvk

# Read the contract name
echo Which contract do you want to deploy \(eg Greeter\)?
read contract

# Read the constructor arguments
echo Enter constructor arguments separated by spaces \(eg 1 2 3\):
read -ra args



forge create ./src/${contract}.sol:${contract} -i --rpc-url https://rpc.testnet.mantle.xyz/ --constructor-args ${args} --legacy --private-key $prvk --verify

# manual: forge create ./src/Pod.sol:Pod --rpc-url $RPC_URL --constructor-args "https://METADATAURI.com" --legacy --private-key $PRIVATE_KEY