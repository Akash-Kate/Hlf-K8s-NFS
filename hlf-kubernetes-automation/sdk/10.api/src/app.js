const express = require("express");
const app = express();
var morgan = require('morgan')
app.use(morgan('combined'))
const bodyparser = require("body-parser");
const { registerUser, userExist } = require("./registerUser");
const {AddCertificateHash,AddBulkCertificateHash} =require('./tx')
const {CheckCertificate} = require('./query')
const singletone = require('./fabricGateway')


const chaincodeName = "basic";
const org = "Org1MSP";
const userId = "domicile"
//const channelName = "mychannel"



var cors = require('cors')
app.use(cors())
app.use(bodyparser.json());


var instance1 = null ;
var instance2 = null ;

async function register()
{
        try {
                //let org = org;
                //let userId = userId;
                let result = await registerUser({ OrgMSP: org, userId: userId });
                console.log("USER CREATED",result)
                return result;

            } catch (error) {
                return error;
            }
}


// Wrap the gateway connection setup in an async function
async function startServer() {
    try {
	app.listen(4000, () => {
            console.log(`Server is running on port 4000`);
        });
	let user = await register();
	console.log("USER CREATED OR NOT ----->",user);

	instance1 = await singletone.getConnection();
    	console.log("Instance1 in app.js----> euuuuuuuu",instance1);

    	instance2 = await singletone.getConnection();
    	console.log("true if instnce1 and instance2 are same in app.js---------->",instance1===instance2);

  } catch (error) {
        console.error(`Failed to establish the gateway connection: ${error.message}`);
        process.exit(1); // Exit the process if the gateway connection fails
    }
}


startServer();

/*
async function register()
{
	try {
        	//let org = org;
        	//let userId = userId;
        	let result = await registerUser({ OrgMSP: org, userId: userId });
		console.log("USER CREATED",result)
        	return result;

    	    } catch (error) {
        	return error;
    	    }
}
*/
//let user = register();
//console.log("USER = = ",user)

/*
app.post("/register", async (req, res) => {

    try {
        let org = org;
        let userId = userId;
        let result = await registerUser({ OrgMSP: org, userId: userId });
        res.send(result);

    } catch (error) {
        res.status(500).send(error)
    }
});
*/

//console.log("calling test_gateway function from app.js")
//await testing_gateway()













app.post("/addCertificateHash", async (req, res) => {
    try {

	//const start = performance.now();
        let payload = {
            "channelName": req.body.channelName,
            "chaincodeName": chaincodeName,
	    "txnId": req.body.txnId,
	    "instance1": instance1,
	    "data" : req.body.data
     	}

        let result = await AddCertificateHash(payload);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(500).send(error)
    }
});


app.post("/bulkCertificateHash", async (req, res) => {
    try {

	let hashValuesAndTxnId = req.body.hashdata.hashlist.hash_values;

        let payload = {
            "org": org,
            "channelName": req.body.channelname,
            "chaincodeName": chaincodeName,
            "userId": userId,
	    "txnId": req.body.txnId,
            "data" : hashValuesAndTxnId.map(hash => {
		return {
		     "txnId":hash.txnId,
		     "hash_value":hash.hash_value,
		     "deptCode":req.body.deptCode
		};

	   })
        };

        let result = await AddBulkCertificateHash(payload);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(500).send(error)
    }
});


app.post('/checkCertificateHash', async (req, res) => {

    try {

	    let payload = {
            "org": org,
            "channelName": req.body.channelName,
            "chaincodeName": chaincodeName,
	    "userId": userId,
	    "txnId": req.body.txnId,
	    "instance1": instance1,
            "data": req.body.data
        }

        let result = await CheckCertificate(payload);
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(500).send(error)
    }

});



