# Create Application channel (Run this cmd in any 1 peer of 1 org)
# This cmd will create block file from tx file of that particular channel


./scripts/createAppChannel.sh delhi-channel


# Join the channel to peers with channel block file (Run this cmnd in peer which you want to join the channel)

peer channel join -b ./channel-artifacts/delhi-channel.block


# Update Anchor Peer (Any 1 peer of an Org)

./scripts/updateAnchorPeer.sh Org1MSP delhi-channel
