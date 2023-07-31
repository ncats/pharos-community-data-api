import {Request, Response} from "express";
import {setHeaders} from "../../models/endpoints";
import querystring from "querystring";
import PairwiseService from "./pairwiseService";
import url from "url";
import {PredictionSet} from "../../models/prediction";
import {getMinimalCitation} from "../../models/modelData";

export async function interactorScores(req: Request, res: Response): Promise<any> {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);

    if (queryMap.target) {
        const targetQuery = queryMap.target.toString();
        await PairwiseService.getInteractorScoresForTerm(targetQuery)
            .then(data => {
                //res.send(data)
                const ps = new PredictionSet("Associated Disease", "Thing", "evidence",
                    "An ECO code representing the evidence for the association", 1, 0);
                Object.entries(data).forEach((intScore: any) => {
                    {
                        intScore = intScore[1]
                        console.log(intScore);
                        const extraFields: any =
                            {
                                identifier: [
                                    {
                                        "@type": "PropertyValue",
                                        "name": "target",
                                        "value": intScore.gene
                                    }],
                                name: "Reactome FI"
                            };
                        ps.addPrediction(intScore.gene, intScore.gene, intScore.score, extraFields);
                    }
                    ps.addCitation(getMinimalCitation(35380658));
                })
                res.end(JSON.stringify([[ps.asJSON()]]))
            });
        return;
    }
    res.end("No Protein Provided!");
}

exports.interactorScores = interactorScores;
