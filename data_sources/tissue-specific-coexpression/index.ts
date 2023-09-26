import {Request, Response} from "express";
import {setHeaders} from "../../models/endpoints";
import querystring from "querystring";
import PairwiseService from "../pairwise-relationship-data/pairwiseService";
import url from "url";
import {PredictionSet} from "../../models/prediction";
import {getMinimalCitation} from "../../models/modelData";


export async function tissueSpecificCoexpression(req: Request, res: Response): Promise<any> {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);

    if (queryMap.target) {
        const targetQuery = queryMap.target.toString();
        try {
            let dataDescriptions: any = await PairwiseService.getAllDataDescs('GTEx', 'Gene_Coexpression');
            let dataDescIds = [];
            for (let dataDesc of dataDescriptions) {
                dataDescIds.push(Object(dataDesc.id));
            }

            try {
                await PairwiseService.searchTermSecondaryPathways(
                    {
                        "genes": [targetQuery],
                        "dataDescs": dataDescIds
                    })
                    .then(data => {
                        const ps = new PredictionSet("Tissue Specific Coexpression", "Protein", "Tissue",
                            "Pairwise Relationship",
                            1, 0, null, "Query Target");
                        Object.entries(data).forEach((match: any) => {
                            {
                                match = match[1];
                                let dataSource = match.dataDesc.id.split("|")[0];
                                let tissue = match.dataDesc.id.split("|")[1];
                                match.posGenes.forEach((gene: any) => {
                                    const extraFields: any =
                                        {
                                            identifier: [
                                                {
                                                    "@type": "PropertyValue",
                                                    "name": "Coexpressed Target",
                                                    "value": gene
                                                },
                                                {
                                                    "@type": "PropertyValue",
                                                    "name": "Data Source",
                                                    "value": dataSource
                                                }],
                                        };
                                    ps.addPrediction(match.gene, "", tissue, extraFields);
                                })
                            }
                        })
                        ps.addCitation(getMinimalCitation(37333417));
                        res.end(JSON.stringify([ps.asJSON()]))
                    });
                return;
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err)
        }
    }
    res.end("No Protein Provided!");
}

exports.tissueSpecificCoexpression = tissueSpecificCoexpression;