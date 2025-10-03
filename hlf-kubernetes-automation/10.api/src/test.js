const { gatewayInstance } = require('./fabricGateway')



exports.testing_gateway = async (request) => {
let gateway = gatewayInstance.gateway;
console.log("gateway inside test.js ----> ",gateway)

}
