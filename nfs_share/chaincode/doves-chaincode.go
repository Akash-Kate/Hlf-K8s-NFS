package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type serverConfig struct {
	CCID    string
	Address string
}


// SmartContract provides functions for managing an asset
type SmartContract struct {
	contractapi.Contract
}


// Asset describes basic details of what makes up a simple asset
type Certificate struct {
    TxnID     string `json:"txnId"`
    HashValue string `json:"hash_value"`
    DeptCode  string `json:"deptCode"`
}


// InitLedger adds a base set of cars to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	fmt.Println("Ledger initialized")
	return nil
}


// CheckCertificate checks if a certificate exists in the ledger
func (s *SmartContract) CheckCertificate(ctx contractapi.TransactionContextInterface, hashValue string) (string, error) {
	fmt.Printf("[CheckCertificate] Checking for certificate with hash: %s\n", hashValue)



	// Get the certificate from the ledger
	certificateJSON, err := ctx.GetStub().GetState(hashValue)
	if err != nil {
		return "", fmt.Errorf("failed to read from world state: %s", err.Error())
	}

	// If nothing is found, return "false"
	if certificateJSON == nil {
		return "false", nil
	}

	// Parse the certificate JSON
	var cert Certificate
	err = json.Unmarshal(certificateJSON, &cert)
	if err != nil {
		return "", fmt.Errorf("failed to parse certificate JSON: %s", err.Error())
	}

	// Check if hash_value exists
	if cert.HashValue != "" {
		fmt.Printf("[CheckCertificate] Certificate found for hash: %s (TxnID: %s, Dept: %s)\n", cert.HashValue, cert.TxnID, cert.DeptCode)
		return "Certificate Found", nil
	}

	return "false", nil
}


// AddCertificateHash adds a new certificate to the world state
func (s *SmartContract) AddCertificateHash(ctx contractapi.TransactionContextInterface, txnId string, hashValue string, deptCode string) (string, error) {

	fmt.Printf("[AddCertificateHash] Received request - TxnID: %s, Hash: %s, Dept: %s\n", txnId, hashValue, deptCode)

	// Call CheckCertificate to verify if it already exists
	checkResult, err := s.CheckCertificate(ctx, hashValue)
	if err != nil {
		return "", err
	}

	if checkResult == "Certificate Found" {
		// Certificate already exists
		return "", fmt.Errorf("Certificate already exists in the ledger")
	}

	// Create a new Certificate struct
	cert := Certificate{
		TxnID:     txnId,
		HashValue: hashValue,
		DeptCode:  deptCode,
	}

	// Convert the struct into JSON
	certBytes, err := json.Marshal(cert)
	if err != nil {
		return "", fmt.Errorf("failed to marshal certificate: %s", err.Error())
	}

	// Save the certificate in the ledger with hashValue as the key
	err = ctx.GetStub().PutState(hashValue, certBytes)
	if err != nil {
		return "", fmt.Errorf("failed to put certificate in world state: %s", err.Error())
	}

	return "Certificate Hash successfully stored", nil
}


func main() {
	// See chaincode.env.example
	config := serverConfig{
		CCID:    os.Getenv("CHAINCODE_ID"),
		Address: os.Getenv("CHAINCODE_SERVER_ADDRESS"),
	}

	fmt.Println("[Main] Starting chaincode server...")
	fmt.Printf("[Main] CHAINCODE_ID: %s, CHAINCODE_SERVER_ADDRESS: %s\n", config.CCID, config.Address)

	chaincode, err := contractapi.NewChaincode(&SmartContract{})

	if err != nil {
		log.Panicf("error create basic chaincode: %s", err)
	}

	server := &shim.ChaincodeServer{
		CCID:    config.CCID,
		Address: config.Address,
		CC:      chaincode,
		TLSProps: shim.TLSProperties{
			Disabled: true,
		},
	}

	if err := server.Start(); err != nil {
		log.Panicf("error starting basic chaincode: %s", err)
	}
}





