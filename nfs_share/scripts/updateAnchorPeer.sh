CORE_PEER_LOCALMSPID=$1
CHANNEL_NAME=$2
#echo $CORE_PEER_LOCALMSPID $CHANNEL_NAME
peer channel update -o orderer:7050  -c ${CHANNEL_NAME} -f ./channel-artifacts/${CORE_PEER_LOCALMSPID}_${CHANNEL_NAME}_anchors.tx --tls  --cafile $ORDERER_CA
