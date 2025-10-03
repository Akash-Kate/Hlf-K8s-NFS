const { getCCP } = require("./buildCCP");
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");
const walletPath = path.join(__dirname, "wallet");
const {buildWallet} =require('./AppUtils');
//const singletone = require('./fabricGateway')

exports.AddCertificateHash = async (request) => {

// *** Below code is the code which is for specifying endorser peers at the application level ****
// Tried and tested but not sure of only 2 peers or specified peers are endorsing as the TPS is Same
// Even if specify the endorsing peers and dont the TPS is same

    //let org = request.org;
    //let num = Number(org.match(/\d/g).join(""));
    //try {
    //await gateway.connect(ccp, {
    //    wallet,
    //    identity: request.userId,
    //    discovery: { enabled: true, asLocalhost: false } // using asLocalhost as this gateway is using a fabric network deployed locally
    //});
    // Build a network instance based on the channel where the smart contract is deployed
    //const gateway = await getGateway();
    //const instance1 = request.instance1;
    //const network = await instance1.getNetwork(request.channelName);
    //const channel = network.getChannel();
    //console.log("Object get own propertyNames channel object------------------->",Object.getOwnPropertyNames(Object.getPrototypeOf(channel)));
    //console.log("channel.getEndorsers() LLLets check ----------->",channel.getEndorsers()); // working
    //const endorsingPeers = channel.getEndorsers(); // working when discovery is true
    //console.log("Endorsing Peer Array Got FRom getEndorser method ------------------------------------------->",endorsingPeers);
    // Pick specific endorsing peers to endorse transaction
    //const selectedPeers = endorsingPeers.filter(peer =>
        //['peer0-org1:7051','peer1-org1:7051'].includes(peer.name)
    //);
    //console.log("Let's see if we picked specific peers as endorsing peers-------->",selectedPeers);
    // Get the contract from the network.
    //const contract = network.getContract(request.chaincodeName);
    //console.log("DATA--->",request.data);
    //let data = request.data;
    //const transaction = await contract.createTransaction('addCertificateHash');
    //console.log("Object get properties of Transaction Object------------------->",Object.getOwnPropertyNames(Object.getPrototypeOf(transaction)));
    //transaction.setEndorsingPeers(selectedPeers);
    //const result = await transaction.submit(data.txnId,data.hash_value,data.deptCode);



    // This method was automatically picking up the endorsing peers via discovery service
    // Above we have picked up the peers which will endorse the transactions

    // let result = await contract.submitTransaction('addCertificateHash',data.txnId,data.hash_value,data.deptCode);

	try{

	const instance1 = request.instance1;
	const network = await instance1.getNetwork(request.channelName);

	// get the contract from network
	const contract  = network.getContract(request.chaincodeName);
	console.log("DATA----->",request.data);
	let data = request.data;

  // // First evaluate the transaction and check if the hash_value already exists and if it does return from here only

  let check = await contract.evaluateTransaction("checkCertificate", data.hash_value);

  if (check.toString() === "Certificate Found") {
            return {
                ERROR: "E003",
                status: "exist",
                result: "Certificate already exists",
                transactionId: data.txnId
            };
        }


  // If the evaluateTransaction does not return anything then call the submitTransaction

	let result = await contract.submitTransaction("addCertificateHash",data.txnId,data.hash_value,data.deptCode);

	// Check if the certificate already exists
        if (result.toString() === "Certificate already exists in the ledger") {
            return {
                ERROR: "E003",
                status: "exist",
                result: "Certificate already exists",
                transactionId: data.txnId
            };
        }

// If the certificate was successfully added, return the result
        return {
            status: "success",
            result: "Certificate Uploaded Successfully",
            transactionId: data.txnId
        };


    }catch(error)
	{
		console.error("Error in AddCertificateHash:", error.message);
        	// Handle specific error types or messages
        	let errorMessage = "Internal Server Error";
        	if (error.message.includes("Certificate already exists")) {
            		errorMessage = "Certificate already exists";
        	}

        	return {
            		ERROR: "E005",
            		status: "failed",
            		result: errorMessage,
            		transactionId: data.txnId
        		};
        };

  }




exports.AddBulkCertificateHash = async (request) => {
//  let org = request.org;
//  let num = Number(org.match(/\d/g).join(""));
//  const ccp = getCCP(num);

 // const wallet = await buildWallet(Wallets, walletPath);

//  const gateway = new Gateway();
  let TXNID = request.txnId;
 
 try {
/*
    await gateway.connect(ccp, {
      wallet,
      identity: request.userId,
      discovery: { enabled: true, asLocalhost: false }, // using asLocalhost as this gateway is using a fabric network deployed locally
    });
*/
    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(request.channelName);

    // Get the contract from the network.
    const contract = network.getContract(request.chaincodeName);
    console.log("DATA--->", request.data);
    let data = request.data;

    // Initialize responses array
    let responses = [];

    for (let i = 0; i < data.length; i++) {
      try {
        let result = await contract.submitTransaction(
          "addCertificateHash",
          data[i].txnId,
          data[i].hash_value,
          data[i].deptCode
        );

        // Check if the certificate already exists
        if (result.toString() === "Certificate already exists in the ledger") {
          responses.push({
            ERROR: "E003",
            status: "exist",
            result: "Certificate already exists",
            transactionId: data[i].txnId,
          });
        }

        // If the certificate was successfully added, return the result
        responses.push({
          status: "success",
          result: "Certificate Uploaded Successfully",
          transactionId: data[i].txnId,
        });
      } catch (error) {
        console.error(`Error for txnId ${data[i].txnId}:`, error.message);

        let errorMessage = "Internal Server Error";
        if (error.message.includes("Certificate already exists")) {
          errorMessage = "Certificate already exists";
        }

        responses.push({
          ERROR: "E005",
          status: "failed",
          result: errorMessage,
          transactionId: data[i].txnId,
        });
      }
    }

    return {
      status: "bulk_upload",
      responses: responses,
    };
  } catch (error) {
    console.error("Error in AddCertificateHash:", error.message);
    return {
      ERROR: "E005",
      status: "failed",
      result: "Internal Server Error",
      transactionId: TXNID,
    };
  }
};




















