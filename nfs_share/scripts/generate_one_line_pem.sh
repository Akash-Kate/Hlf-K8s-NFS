#!/bin/bash

function one_line_pem {
    awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}'  $1
}


echo $2
# send 1 from ansible as $1
# send org1 org2 org3 etc as $2
ORG=$1
PEERPEM=organizations/peerOrganizations/$2.example.com/tlsca/tlsca.$2.example.com-cert.pem
CAPEM=organizations/peerOrganizations/$2.example.com/ca/ca.$2.example.com-cert.pem


echo "$(one_line_pem $PEERPEM)" > connection-profile/onelinepeerpem/peerPem$2.pem

echo "$(one_line_pem $CAPEM)" > connection-profile/onelinecapem/caPem$2.pem




