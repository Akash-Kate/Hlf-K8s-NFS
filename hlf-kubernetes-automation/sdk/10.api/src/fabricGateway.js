const { getCCP } = require("./buildCCP");
const { Wallets, Gateway } = require("fabric-network");
const path = require("path");
const walletPath = path.join(__dirname, "wallet");
const { buildWallet } = require("./AppUtils");



let org = "Org1MSP";
let userId = "domicile";

const singletone = (function () {
  let instance = null;

  async function createConnection() {
    let num = Number(org.match(/\d/g).join(""));
    const ccp = getCCP(num);

    const wallet = await buildWallet(Wallets, walletPath);

    const gateway = new Gateway();

     try {
        await gateway.connect(ccp, {
        wallet,
        identity: userId,
        discovery: { enabled: true, asLocalhost: false },
    });

    console.log("gateway object created in fabricGateway.js", gateway);

    return gateway;

    } catch (error) {
        throw new Error(`Failed to connect to the gateway: ${error.message}`);
    }
  }

  return {
    getConnection: function () {
      if (!instance) {
        instance = createConnection();
      }

      return instance;
    },
  };
})();


module.exports = singletone;
