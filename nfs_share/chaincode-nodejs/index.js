const { contract } = require('fabric-contract-api');
const shim = require('fabric-shim');



class SimpleChaincode extends contract {

    // initialize the chaincode
    async InitLedger(ctx) {
        console.log("Initialization successfull ...");
        return "Ledger Initialized Successfully (No starting data inserted)";
    }

    // async Invoke(stub) {
    //     let ret = stub.getFunctionAndParameters();
    //     console.info("ret: " + ret);
    //     let method = this[ret.fcn];
    //     if (!method) {
    //         console.log('no method of name:' + ret.fcn + ' found');
    //         return shim.success();
    //     }
    //     try {
    //         let payload = await method(stub, ...ret.params);
    //         return shim.success(payload);
    //     } catch (err) {
    //         console.log(err);
    //         return shim.error(err);
    //     }
    // }


    async addCertificateHash(ctx, txnId, hash_value, deptCode)
    {

        let certificateIfExists = await ctx.stub.getState(hash_value);
	    console.log("Chech the output of getState function--->",certificateIfExists);

        if (certificateIfExists && certificateIfExists.length > 0) {
                throw new Error("Certificate already exists in the ledger");
        }

        let cert_hash = {
            txnId: txnId,
            hash_value: hash_value,
            deptCode: deptCode

        }

            await ctx.stub.putState(hash_value, Buffer.from(JSON.stringify(cert_hash)));
            console.log("Certificate stored successfully",cert_hash);
            
            return "Certificate Hash successfully stored"
    }

    async checkCertificate(ctx, hash_value) {


        const certificateIfExists = await ctx.stub.getState(hash_value); // get the asset from chaincode state
        if (!certificateIfExists || certificateIfExists.length === 0) {
            throw new Error("False");
        }
        return "Certificate Found";

    }


};

const server = shim.server(new SimpleChaincode(), {
    ccid: process.env.CHAINCODE_ID,
    address: process.env.CHAINCODE_SERVER_ADDRESS
});

server.start();
