import fs from "fs";

const {reviver} = require("../kinase-cancer-predictions/utilities");
const targetLookup = JSON.parse(fs.readFileSync(__dirname + '/targetLookup.json', {encoding: "utf-8"}), reviver);

import {Request, Response} from "express";
import {setHeaders} from "../../models/endpoints";
import url from "url";
import querystring from "querystring";
import {PredictionSet} from "../../models/prediction";
import {getMinimalCitation} from "../../models/modelData";

export function associations(req: Request, res: Response): any {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);

    if (queryMap.target) {
        const targetQuery = queryMap.target.toString();
        const associations = targetLookup.get(targetQuery);
        if (associations && associations.length > 0) {
            const ps = new PredictionSet("Associated Disease", "MedicalCondition", "evidence",
                "An ECO code representing the evidence for the association", null, null);
            associations.forEach((assoc: any) => {
                const extraFields: any =
                {
                    identifier: [
                    {
                        "@type": "PropertyValue",
                        "name": "type",
                        "value": assoc.type
                    },
                    {
                        "@type": "PropertyValue",
                        "name": "reference",
                        "value": assoc.reference
                    }]
                };
                ps.addPrediction(assoc.diseaseTerm, assoc.diseaseID, assoc.evidenceCodeName, extraFields);
            });
            ps.addCitation(getMinimalCitation(35380658));
            res.end(JSON.stringify([ps.asJSON()]));
            return;
        }
    }
    res.end("No target provided!");
}
exports.associations = associations;