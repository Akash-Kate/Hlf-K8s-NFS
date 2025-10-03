const { getCCP } = require("./buildCCP");
const { Wallets, Gateway } = require('fabric-network');
const path = require("path");
const walletPath = path.join(__dirname, "wallet");
const { buildWallet } = require('./AppUtils')


exports.CheckCertificate = async (request) => {
    let data = request.data;

    try {
        console.log("channelName = ", request.channelName);
	    const instance1 = request.instance1;
        const network = await instance1.getNetwork(request.channelName);

        // Get the contract from the network.
        console.log("chaincode Name = ", request.chaincodeName);
        const contract = network.getContract(request.chaincodeName);
        console.log("data.hashvalue ----> ", data.hash_value)
        let result = await contract.evaluateTransaction("checkCertificate", data.hash_value);

        // Check if the certificate already exists
        if (result.toString() === "Certificate Found") {
            return {
                status: "success",
                result: "Match found for uploaded certificate",
                transactionId: data.txnId
            };
        }


        if (result.toString() === "false") {
            return {
                ERROR: "E004",
                status: "failed",
                result: "No match found for uploaded certificate",
                transactionId: data.txnId
            };
        }
    }
    catch (error) {
            console.error("Error in checkCertificateHash:", error.message);
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
