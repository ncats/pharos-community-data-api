const endpoints = require("./models/endpoints");
const kinasecancer = require("./data_sources/kinase-cancer-predictions/index")

exports.ping = endpoints.ping;
exports.sample = endpoints.sample;
exports.predictions = kinasecancer.predictions;