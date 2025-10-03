const singletone = require("../fabricGateway.js");

const initiateConnection = async () => {
  try {
    let instance1 = await singletone.getConnection();
    console.log("Instance1 in app.js---->", instance1);

    let instance2 = await singletone.getConnection();
    console.log(
      "true if instance1 and instance2 are same in app.js -------->",
      instance1 === instance2
    );
    return instance1;
  } catch (error) {
    console.log("Some error while initiating instance1 connection!");
    throw new Error(error.message);
  }
};

module.exports = { initiateConnection };
