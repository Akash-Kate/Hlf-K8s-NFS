const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { AddCertificateHash } = require("../tx.js");
const { CheckCertificate } = require("../query.js");
const { initiateConnection } = require("../utils/connectionHandler.js");

// regex pattern to validate hash
// const validationRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z0-9]+$/;
const validationRegex = /^(?=(?:.*[a-z]){3})(?=(?:.*\d){3})[a-zA-Z0-9]+$/
// chaincode name from .env file
const chaincodeName = process.env.CHAINCODE_NAME;

// fetching connection instance
let instance1 = null;
const fetchConnection = async () => {
  try {
    instance1 = await initiateConnection();
  } catch (error) {
    console.log(
      "Some error while initiating instance1 connection in controller!"
    );
    throw new Error(
      "Failed to initiate instance1: Error Msg: " + error.message
    );
  }
};

fetchConnection();
console.log("instance connection in controller: " + instance1);


// MY
// {
//     "channelName": "mh",
//     "data": {
//         "txnId": "aisog124449",
//         "hash_value": "crrttdki3yu9e827d7205",
//         "deptCode": "tcs123422"
//     }
// }





// {
//     "txnId" : "bchd4bhdsf101",
//     "hashdata": {
//         "hashvalue": "11234bf2a03ce57ea36cd7846gfjhkj0e210111122"
//     },
//     "channel": "mh",
//     "deptCode" : "MHt436783" 
// }




// controller to add new single certificate
const addCertificate = asyncHandler(async (req, res) => {
  console.log("Inside controllers req.body =  = = == = = = = = = = =",req.body);
  console.log("chaincodeName  = = = = = = = = =  = = =  = = =  = =",chaincodeName);
  const { channel, txnId, deptCode, hashdata } = req.body;

  const reqBodyLength = Object.keys(req.body).length;
  console.log(`Num. of Parameters in request body = ${reqBodyLength}`);

  if (reqBodyLength !== 4) {
    throw new ApiError(
      400,
      "E001",
      "Incorrect Number of arguments in request!"
    );
  }
  
  let channelName = channel;
  let data = {
    "txnId": txnId,
    "hash_value": hashdata.hashvalue,
    "deptCode": deptCode
  }

  if (!(channelName && data)) {
    throw new ApiError(400, "E002", "Some Null or Empty Arguments!");
  }

  // data.txnId,data.hash_value,data.deptCode
  // const { txnId, hash_value, deptCode } = data;

  if (!(data.txnId && data.hash_value && data.deptCode)) {
    throw new ApiError(
      400,
      "E002",
      "Incorrect or Null Arguments inside data field!"
    );
  }

  if ([data.txnId, data.hash_value, data.deptCode].some((field) => field.trim() === "")) {
    throw new ApiError(
      400,
      "E002",
      "Some fields have empty space inside data!"
    );
  }

  // if (!validationRegex.test(data.hash_value)) {
  //   throw new ApiError(400, "E006", "Invalid characters in hashvalue!");
  // }

  // if (!validationRegex.test(data.txnId)) {
  //   throw new ApiError(400, "E006", "Invalid characters in Transaction Id!");
  // }

  const payload = {
    channelName,
    chaincodeName,
    instance1,
    data,
  };

  try {
    const result = await AddCertificateHash(payload);
    console.log("Lets see if this line is being executed i.e after AddCertificateHash");
    res.status(201).json(result);
  } catch (error) {
    console.log("Something went wrong while adding new certificate!");
    console.error(error.message);
    throw new ApiError(
      500,
      "E005",
      "Internal Server Error: while adding single certificate!"
    );
  }
});

// controller to add bulk certificates

// const addBulkCertificate = asyncHandler(async (req, res) => {
//   const { channelname, txnId, deptCode, hashdata } = req.body;

//   const reqBodyLength = Object.keys(req.body).length;
//   console.log(`Num. of Parameters in request body = ${reqBodyLength}`);

//   if (reqBodyLength !== 4) {
//     throw new ApiError(
//       400,
//       "E001",
//       "Incorrect Number of arguments in request!"
//     );
//   }

//   const hashValuesAndTxnId = hashdata.hashlist.hash_values;
//   if (
//     hashValuesAndTxnId.some(
//       (hashData) => !validationRegex.test(hashData.hash_value)
//     )
//   ) {
//     throw new ApiError(
//       400,
//       "E006",
//       "Invalid characters in some hashvalues in given list!"
//     );
//   }

//   const data = hashValuesAndTxnId.map((hashData) => {
//     return {
//       txnId: hashData.txnId,
//       hash_value: hashData.hash_value,
//       deptCode: deptCode,
//     };
//   });

//   const payload = {
//     channelname,
//     chaincodeName,
//     txnId,
//     data,
//   };

//   try {
//     const result = await AddBulkCertificateHash(payload);
//     res.status(201).json(result);
//   } catch (error) {
//     console.log("Something went wrong while adding bulk certificates!");
//     console.error(error.message);
//     throw new ApiError(
//       500,
//       "E005",
//       "Internal Server Error: while adding bulk certificates!"
//     );
//   }
// });






// {
//     "txnId" : "bchd4bhdsf101",
//     "hashdata": {
//         "hashvalue": "11234bf2a03ce57ea36cd7846gfjhkj0e210111122"
//     },
//     "channel": "delhi-channel"
// }




// controller to check certificate if it exist in blockchain
const checkCertificate = asyncHandler(async (req, res) => {
  const { channel, txnId, hashdata } = req.body;


  const reqBodyLength = Object.keys(req.body).length;
  console.log(`Num. of Parameters in request body = ${reqBodyLength}`);


   let channelName = channel;
  let data = {
    "txnId": txnId,
    "hash_value": hashdata.hashvalue,
  }




  if (reqBodyLength !== 3) {
    throw new ApiError(
      400,
      "E001",
      "Incorrect Number of arguments in request!"
    );
  }

  if (!(channelName && data.txnId && data)) {
    throw new ApiError(400, "E002", "Some Null or Empty Arguments!");
  }

  // // const { hash_value } = data;
  // if (!validationRegex.test(data.hash_value)) {
  //   throw new ApiError(400, "E006", "Invalid characters in hashvalue!");
  // }

  // if (!validationRegex.test(data.txnId)) {
  //   throw new ApiError(400, "E006", "Invalid characters in Transaction Id!");
  // }

  const payload = {
    channelName,
    chaincodeName,
    instance1,
    data,
  };

  try {
    const result = await CheckCertificate(payload);
    res.status(200).json(result);
  } catch (error) {
    console.log("Something went wrong while adding bulk certificates!");
    console.error(error.message);
    throw new ApiError(
      500,
      "E005",
      "Internal Server Error: while checking certificate!"
    );
  }
});

//module.exports = { addCertificate, addBulkCertificate, checkCertificate };

module.exports = { addCertificate, checkCertificate };
