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
        const score = queryMap.score.toString();
        await PairwiseService.getInteractorScoresForTerm(targetQuery, score)
            .then(data => {
                const ps = new PredictionSet("Reactome Functional Interactions", "Protein", "Functional Interaction Score",
                    "Score of how likely two proteins are to interact with each other functionally",
                    1, 0, null , "Target");
                Object.entries(data).forEach((intScore: any) => {
                    {
                        intScore = intScore[1]
                        const extraFields: any =
                            {
                                identifier: [
                                    {
                                        "@type": "PropertyValue",
                                        "name": "Target",
                                        "value": intScore.gene
                                    }]
                            };
                        ps.addPrediction(intScore.gene, "", intScore.score);
                    }
                })
                ps.addCitation(getMinimalCitation(37333417));
                res.end(JSON.stringify([ps.asJSON()]))
            });
        return;
    }
    res.end("No Protein Provided!");
}

exports.interactorScores = interactorScores;
