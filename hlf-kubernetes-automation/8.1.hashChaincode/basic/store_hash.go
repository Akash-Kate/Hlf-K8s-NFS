
package main

import (
        "encoding/json"
        "fmt"
        "log"
        "os"
        "time"

        "github.com/golang/protobuf/ptypes"
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

// QueryResult structure used for handling result of query
type QueryResult struct {
        Key    string `json:"Key"`
        Record *Asset
}

// Certificate hash already Exists returns true when hash exists in world state
func (s *SmartContract) hashExists(ctx contractapi.TransactionContextInterface, hash string) (bool, error) {
        hashJSON, err := ctx.GetStub().GetState(hash)
        if err != nil {
                return false, fmt.Errorf("failed to read from world state. %s", err.Error())
        }

        return hashJSON != nil, nil
}


func (s *SmartContract) addCertificateHash(ctx contractapi.TransactionContextInterface,hashValue string) error 
{
	exists, err := s.hashExists(ctx, hashValue)
	 if err != nil {
            return err
    	}

     if exists {
                return fmt.Errorf("the asset %s already exists",hashValue)
        }

	// Store the hash in the ledger
	err = ctx.GetStub().PutState(hashValue)
	if err != nil {
		return fmt.Errorf("failed to store hash in the ledger: %s", err)
	}

	// Return a success message
	//return fmt.Errorf("data stored successfully in the blockchain : %s",hash_value)

	// Return a success message
	successMessage := fmt.Printf("Data stored successfully in the blockchain: %s", hashValue)
	return successMessage, nil
}


// checkCertificate checks if a certificate hash is present in the ledger
func (s *SmartContract) checkCertificateHash(ctx contractapi.TransactionContextInterface, hash_value string) (string, error) {
    // Check if hash exists
    certificateIfExists, err := ctx.GetStub().GetState(hash_value)
    if err != nil {
        return "", fmt.Errorf("failed to read from the world state (ledger): %s", err)
    }

    if certificateIfExists != nil {
        // Hash found, return success message
        return fmt.Sprintf("Certificate with hash %s found: %s", hash_value, certificateIfExists), nil
    }

    // Hash not found, return a message indicating it's not present
    return fmt.Sprintf("Certificate with hash %s not found", hash_value), nil
}



func main() {
        // See chaincode.env.example
        config := serverConfig{
                CCID:    os.Getenv("CHAINCODE_ID"),
                Address: os.Getenv("CHAINCODE_SERVER_ADDRESS"),
        }

        chaincode, err := contractapi.NewChaincode(&SmartContract{})

        if err != nil {
                log.Panicf("error create certificate-hash-store chaincode: %s", err)
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
                log.Panicf("error starting certificate-hash-store chaincode: %s", err)
        }
}






// func (s *SmartContract) addCertificateHash(ctx contractapi.TransactionContextInterface, hash_value string) error {
//     // Check if hash exists
//     hashExists, err := ctx.GetStub().GetState(hash_value)
//     if err != nil {
//         return fmt.Errorf("failed to read from the world state (ledger): %s", err)
//     }

//     if hashExists != nil {
//         return fmt.Errorf("the asset %s already exists", hash_value)
//     }

//     // Store the hash in the ledger
//     err = ctx.GetStub().PutState(hash_value, []byte("some value")) // Replace "some value" with your actual data
//     if err != nil {
//         return fmt.Errorf("failed to store hash in the ledger: %s", err)
//     }

//     // Return a success message
//     successMessage := fmt.Sprintf("Data stored successfully in the blockchain: %s", hash_value)
//     return fmt.Errorf(successMessage)
// }
