import fs from "fs";
import {Request, Response} from "express";
import url from "url";
import querystring from "querystring";
import {getMinimalCitation} from "../../models/modelData";
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
        const targetQuery = queryMap.target.toString();
        const targetList = targetQuery.split('|');
        const predictions: any[] = [];
        targetList.forEach(target => {
            const ps = new PredictionSet("Predicted Cancer", "MedicalCondition", "probability",
                "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
                1, 0);
            const data = targetLookup.get(target);
            if (data && data.predictions && data.predictions.length > 0) {
                data.predictions.forEach((pred: any) => {
                    ps.addPrediction(pred.disease, findMeshID(pred.disease), pred.probability);
                });
                ps.addCitation(getMinimalCitation(34888523));
                predictions.push(ps.asJSON());
            }
        });
        res.end(JSON.stringify(predictions));
        return;
    }
    if (queryMap.disease) {
        const diseaseQuery = queryMap.disease.toString();
        const diseaseList = diseaseQuery.split('|');
        const predictions: any[] = [];
        diseaseList.forEach(disease => {
            const mesh_id = disease.startsWith("MESH:") ? disease.split(':')[1] : disease;
            const ps = new PredictionSet("Predicted Kinase", "Protein", "probability",
                "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
                1, 0, "card");
            const data = diseaseLookup.get(mesh_id);
            if (data && data.predictions && data.predictions.length > 0) {
                data.predictions.forEach((pred: any) => {
                    ps.addPrediction(pred.target, null, pred.probability);
                });
                ps.addCitation(getMinimalCitation(34888523));
                predictions.push(ps.asJSON());
            }
        });
        res.end(JSON.stringify(predictions));
        return;
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