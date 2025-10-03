const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiError } = require("../utils/ApiError.js");
const { AddCertificateHash, AddBulkCertificateHash } = require("../tx.js");
const { CheckCertificate } = require("../query.js");
const { initiateConnection } = require("../utils/connectionHandler.js");



const registerIdentity  = asyncHandler(async (req, res) => {
     console.log("Inside controllers req.body =  = = == = = = = = = = =",req.body);
    

    
})


module.exports = { registerIdentity };
