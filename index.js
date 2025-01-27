const endpoints = require("./models/endpoints");
const kinasecancer = require("./data_sources/kinase-cancer-predictions/index")
const interactorScores = require("./data_sources/pairwise-relationship-data/index");
const coexpressionData = require("./data_sources/coexpression-data/index");

exports.ping = endpoints.ping;
exports.sample = endpoints.sample;
exports.predictions = kinasecancer.predictions;
exports.interactorScores = interactorScores.interactorScores;
exports.coexpressionData = coexpressionData.coexpressionData;