const express = require("express");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const { registerUser, userExist } = require("./registerUser");
// const singletone = require("./fabricGateway");
const { initiateConnection } = require("./utils/connectionHandler.js");
// for enabling CORS policy
const cors = require("cors");
// for Http securit headers
const helmet = require("helmet");
// for HTTPs-SSL-cert(added for VAPT)
const https = require("https");
const fs = require("fs");
// for Content Security Policy random nonce generation
const crypto = require("crypto");
// enforcement of TLS
const constants = require("constants");
//for tls info
const tls = require("tls");
// import configs from .env file
require("dotenv").config();
// for headers
const onHeaders = require("on-headers");
// getting remote ip of req user
const requestIp = require("request-ip");

const app = express();

app.set("trust proxy", true);
// Use morgan for logging HTTP requests in the combined format
app.use(morgan("combined"));

// importing port value from .env file or set to default to 4000
const port = process.env.PORT || 4000;

// generating CSP random nonce
function generateNonce() {
  return crypto.randomBytes(16).toString("hex").substr(0, 8);
}

//for HTTPs-SSL-cert(added for VAPT)
const options = {
  key: fs.readFileSync("./sslCert/server.key"),
  cert: fs.readFileSync("./sslCert/server.cert"),

    // Disable TLS v1.0, v1.1, and v1.2, and enforce only TLS
    secureOptions:
    constants.SSL_OP_NO_TLSv1 |
    constants.SSL_OP_NO_TLSv1_1 |
    constants.SSL_OP_NO_TLSv1_2,
  minVersion: "TLSv1.3",
};

//for checking tls version (added for VAPT)
const socket = new tls.TLSSocket();
const tlsVersion = socket.getProtocol();
console.log(`Current TLS version: ${tlsVersion}`);

// cors policy configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // to manage req origin source ex- origin: 'http://example.com'
    credentials: true, // allow cookies on cross-origin requests
  })
);
app.use(bodyparser.json());

// Use the Helmet middleware to set various HTTP headers, including CSP withn random nonce (added for VAPT)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: [
          "'self'",
          (req, res) => {
            const nonce = generateNonce();
            res.locals.nonce = nonce;
            return `'nonce-${nonce}'`;
          },
        ],
        styleSrc: ["'self'"],
      },
    },
  })
);

// Enable X-XSS-Protection of browser (added for VAPT)
app.use((req, res, next) => {
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// importing logger obj
const logger = require("./utils/logger.js");

// adding request-ip middleware to trace req IP
app.use(requestIp.mw());
// Creating Middleware to log req and resp of API
function logAPI(req, res, next) {
  res.on("finish", () => {
    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip;
    const logMessage = {
      remoteIP: clientIp,
      method: req.method,
      url: req.url,
      timestamp: new Date().toLocaleString(),
      // requestBody: req.body, // commment it to protect logging of confidential data
    };
    logger.info(`API Request: ${JSON.stringify(logMessage)}`);

    const logRespMessage = {
      statusCode: res.statusCode,
    };
    // logger.info("API Response", logRespMessage);
    logger.info(`API Response: ${JSON.stringify(logRespMessage)}`);
  });
  next();
}
app.use(logAPI);

// Handling Arbitrary HTTP Method (for VAPT)
const allowedMethods = ["GET", "POST"];
// Middleware to check Arbitrary HTTP Method
app.use((req, res, next) => {
  if (!allowedMethods.includes(req.method)) {
    console.log("HTTP Method Not Allowed!!");
    res.setHeader("Allow", allowedMethods.join(", "));
    return res.status(405).send("Method Not Allowed"); // Or handle as needed
  }
  next();
});

// Disable ETag generation globally (added for VAPT)
app.set("etag", false);

// creating a middleware to remove some headers when response is setting headers (apply before routes)
app.use(async (req, res, next) => {
  onHeaders(res, () => {
    res.removeHeader("ETag");
  });
  next();
});

// import routes
const certificateRouter = require("./routes/certificate.routes.js");
const authRouter = require("./routes/auth.routes.js");
const identityRouter = require("./routes/identity.routes.js");
// auth token route
app.use("/user/auth", authRouter);
app.use("/", certificateRouter);
app.use("/identity",identityRouter);

// middleware to handle my custom error class errors
const { ApiError } = require("./utils/ApiError.js");
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error(`${JSON.stringify(err)}`)
    // Check if it's your custom error
    res.status(err.statusCode).json({
      ERROR: err.errorCode,
      status: err.success ? "success" : "failed",
      result: err.result,
    });
  } else {
    // Handle other errors (e.g., server errors)
    console.error(err);
    logger.error(err)
    res.status(500).json({
      ERROR: "E005",
      status: "failed",
      result: "Internal Server Error!",
    });
  }
});

// defining our ORG and userId values
// const org = "Org1MSP";
// const userId = "dove";

// user register on fabric network function
// async function register() {
//   try {
//     //let org = org;
//     //let userId = userId;
//     let result = await registerUser({ OrgMSP: org, userId: userId });
//     console.log("USER CREATED", result);
//     return result;
//   } catch (error) {
//     return error;
//   }
// }

 //creating HTTPS enabled server (added for VAPT)
 const server = https.createServer(options, app);

//start server
async function startServer() {
  try {
    // app.listen(port, () => {
    //   console.log(`Server is running on port ${port}`);
    // });

    // starting HTTPS server
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
    let user = await register();
    console.log("USER CREATED OR NOT ----->", user);
    const instance1 = await initiateConnection();
    console.log("instance connection in app.js: " + instance1);
  } catch (error) {
    console.error(
      `Failed to establish the gateway connection: ${error.message}`
    );
    process.exit(1); // Exit the process if the gateway connection fails
  }
}

startServer();

// Wrap the gateway connection setup in an async function
/*
async function startServer() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    let user = await register();
    console.log("USER CREATED OR NOT ----->", user);

    instance1 = await singletone.getConnection();
    console.log("Instance1 in app.js---->", instance1);

    instance2 = await singletone.getConnection();
    console.log(
      "true if instnce1 and instance2 are same in app.js---------->",
      instance1 === instance2
    );
  } catch (error) {
    console.error(
      `Failed to establish the gateway connection: ${error.message}`
    );
    process.exit(1); // Exit the process if the gateway connection fails
  }
}

startServer();
*/

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

/*
app.post("/addCertificateHash", async (req, res) => {
  try {
    //const start = performance.now();
    let payload = {
      channelName: req.body.channelName,
      chaincodeName: chaincodeName,
      txnId: req.body.txnId,
      instance1: instance1,
      data: req.body.data,
    };

    let result = await AddCertificateHash(payload);
    res.send(JSON.stringify(result));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/bulkCertificateHash", async (req, res) => {
  try {
    let hashValuesAndTxnId = req.body.hashdata.hashlist.hash_values;

    let payload = {
      org: org,
      channelName: req.body.channelname,
      chaincodeName: chaincodeName,
      userId: userId,
      txnId: req.body.txnId,
      data: hashValuesAndTxnId.map((hash) => {
        return {
          txnId: hash.txnId,
          hash_value: hash.hash_value,
          deptCode: req.body.deptCode,
        };
      }),
    };

    let result = await AddBulkCertificateHash(payload);
    res.send(JSON.stringify(result));
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/checkCertificateHash", async (req, res) => {
  try {
    let payload = {
      org: org,
      channelName: req.body.channelName,
      chaincodeName: chaincodeName,
      userId: userId,
      txnId: req.body.txnId,
      instance1: instance1,
      data: req.body.data,
    };

    let result = await CheckCertificate(payload);
    res.send(JSON.stringify(result));
  } catch (error) {
    res.status(500).send(error);
  }
});
*/
