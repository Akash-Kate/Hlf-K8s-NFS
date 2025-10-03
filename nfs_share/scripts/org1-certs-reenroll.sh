# BEGIN block0
set -x

mkdir -p /organizations/peerOrganizations/org1.example.com/

export FABRIC_CA_CLIENT_HOME=/organizations/peerOrganizations/org1.example.com/



fabric-ca-client reenroll -u https://admin:adminpw@ca-org1:8054 --caname ca-org1 --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

# -----------------------------------------------------------------------------------
# peer0

echo "Generate the peer0 MSP"

fabric-ca-client reenroll -u https://peer0:peer0pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp" --csr.hosts peer0.org1.example.com --csr.hosts  peer0-org1 --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/config.yaml"

echo "Generate peer0 tls certificates"

fabric-ca-client reenroll -u https://peer0:peer0pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls" --enrollment.profile tls --csr.hosts peer0.org1.example.com --csr.hosts  peer0-org1 --csr.hosts ca-org1 --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/signcerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/keystore/"* "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/org1.example.com/tlsca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/org1.example.com/ca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/msp/cacerts/"* "/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"


# -----------------------------------------------------------------------------------
# peer1

echo "Generate the peer1 MSP"

fabric-ca-client reenroll -u https://peer1:peer1pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp" --csr.hosts peer1.org1.example.com --csr.hosts  peer1-org1 --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/config.yaml"

echo "Generate peer1 tls certificates"

fabric-ca-client reenroll -u https://peer1:peer1pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls" --enrollment.profile tls --csr.hosts peer1.org1.example.com --csr.hosts  peer1-org1 --csr.hosts ca-org1 --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/signcerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/keystore/"* "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/org1.example.com/tlsca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/org1.example.com/ca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/msp/cacerts/"* "/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"


# -----------------------------------------------------------------------------------
# peer2

echo "Generate the peer2 MSP"

fabric-ca-client reenroll -u https://peer2:peer2pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/msp" --csr.hosts peer2.org1.example.com --csr.hosts  peer2-org1 --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/msp/config.yaml"

echo "Generate peer2 tls certificates"

fabric-ca-client reenroll -u https://peer2:peer2pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls" --enrollment.profile tls --csr.hosts peer2.org1.example.com --csr.hosts  peer2-org1 --csr.hosts ca-org1 --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/ca.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/signcerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/server.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/keystore/"* "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/org1.example.com/tlsca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/org1.example.com/ca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer2.org1.example.com/msp/cacerts/"* "/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"


# -----------------------------------------------------------------------------------
# peer3

echo "Generate the peer3 MSP"

fabric-ca-client reenroll -u https://peer3:peer3pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/msp" --csr.hosts peer3.org1.example.com --csr.hosts  peer3-org1 --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/msp/config.yaml"

echo "Generate peer3 tls certificates"

fabric-ca-client reenroll -u https://peer3:peer3pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls" --enrollment.profile tls --csr.hosts peer3.org1.example.com --csr.hosts  peer3-org1 --csr.hosts ca-org1 --csr.hosts localhost --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/ca.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/signcerts/"* "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/server.crt"

cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/keystore/"* "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/server.key"

mkdir -p "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/msp/tlscacerts/ca.crt"

mkdir -p "/organizations/peerOrganizations/org1.example.com/tlsca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/tls/tlscacerts/"* "/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem"

mkdir -p "/organizations/peerOrganizations/org1.example.com/ca"
cp "/organizations/peerOrganizations/org1.example.com/peers/peer3.org1.example.com/msp/cacerts/"* "/organizations/peerOrganizations/org1.example.com/ca/ca.org1.example.com-cert.pem"



#---------------------------------------------------------------------

echo "Generate user MSP"
fabric-ca-client reenroll -u https://user1:user1pw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp" --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/config.yaml"


echo "Generate admin MSP"
fabric-ca-client reenroll -u https://org1admin:org1adminpw@ca-org1:8054 --caname ca-org1 -M "/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" --tls.certfiles "/organizations/fabric-ca/org1/tls-cert.pem" --csr.keyrequest.reusekey

cp "/organizations/peerOrganizations/org1.example.com/msp/config.yaml" "/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/config.yaml"

{ set +x; } 2>/dev/null
# END block2
