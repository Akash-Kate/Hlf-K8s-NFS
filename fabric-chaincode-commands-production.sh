
TOT


Packaging the chaincode --->

tar cfz code.tar.gz connection.json
tar cfz basic-org1.tgz code.tar.gz metadata.json
chmod 777 basic-org1.tgz
rm -rf code.tar.gz

# Install the chaincode in every peer

peer lifecycle chaincode install ./builders/external/chaincode/packaging/basic-org1.tgz


basic:918855dcb080727cf3ba245412c5ffd861bafd2e49456ee5676ae7355553d81a



peer lifecycle chaincode approveformyorg --channelID delhi-channel --name basic --version 1.0 --init-required --package-id basic:918855dcb080727cf3ba245412c5ffd861bafd2e49456ee5676ae7355553d81a --sequence 1 -o orderer:7050 --tls --cafile $ORDERER_CA


peer lifecycle chaincode checkcommitreadiness --channelID delhi-channel --name basic --version 1.0 --init-required --sequence 1 -o -orderer:7050 --tls --cafile $ORDERER_CA

peer lifecycle chaincode commit -o orderer:7050 --channelID delhi-channel --name basic --version 1.0 --sequence 1 --init-required --tls true --cafile $ORDERER_CA --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer1-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt --peerAddresses peer2-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt --peerAddresses peer3-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/ca.crt


peer chaincode invoke -o orderer:7050 --isInit --tls true --cafile $ORDERER_CA -C delhi-channel -n basic --peerAddresses peer0-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer1-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt --peerAddresses peer2-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt --peerAddresses peer3-org1:7051 --tlsRootCertFiles /organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/ca.crt -c '{"Args":["InitLedger"]}' --waitForEvent



peer lifecycle chaincode querycommitted \
  --channelID mh \
  --name basic \
  --output json



peer lifecycle chaincode checkcommitreadiness --ch
