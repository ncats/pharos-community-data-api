import fs from "fs";
import {Request, Response} from "express";
import url from "url";
import querystring from "querystring";
import {getCitation, getMinimalCitation, getPong} from "../../models/modelData";
// @ts-ignore
import {setHeaders} from "../../models/endpoints";
import {PredictionSet} from "../../models/prediction";

const {reviver} = require("./utilities");

const diseaseLookupText = fs.readFileSync(__dirname + '/data/diseaseLookup.json', {encoding: "utf-8"});
const targetLookupText = fs.readFileSync(__dirname + '/data/targetLookup.json', {encoding: "utf-8"});

const diseaseLookup = JSON.parse(diseaseLookupText, reviver);
const targetLookup = JSON.parse(targetLookupText, reviver);

function predictions(req: Request, res: Response): any {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);

    if (queryMap.target) {
        const data = targetLookup.get(queryMap.target.toString());
        if (data && data.predictions && data.predictions.length > 0) {
            const ps = new PredictionSet("Predicted Cancer", "MedicalCondition", "probability",
                "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
                1, 0);
            data.predictions.forEach((pred: any) => {
                ps.addPrediction(pred.disease, findMeshID(pred.disease), pred.probability);
            });
            ps.addCitation(getMinimalCitation(34888523));
            res.end(JSON.stringify([
                ps.asJSON()
            ]));
            return;
        }
    }
    if (queryMap.disease) {
        const disease = queryMap.disease.toString();
        const mesh_id = disease.startsWith("MESH:") ? disease.split(':')[1] : disease;
        const data = diseaseLookup.get(mesh_id);
        if (data && data.predictions && data.predictions.length > 0) {
            const ps = new PredictionSet("Predicted Kinase", "Protein", "probability",
                "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
                1, 0, "card");
            data.predictions.forEach((pred: any) => {
                ps.addPrediction(pred.target, null, pred.probability);
            });
            ps.addCitation(getMinimalCitation(34888523));
            res.end(JSON.stringify([
                ps.asJSON()
            ]));
            return;
        }
    }
    res.end();
}

function findMeshID(testDisease: string) {
    for (let disease of diseaseLookup) {
        if (disease[1].source_name === testDisease) {
            return "MESH:" + disease[0];
        }
    }
    return null;
}

exports.predictions = predictions;