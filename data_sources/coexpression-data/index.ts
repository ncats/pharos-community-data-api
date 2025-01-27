import {Request, Response} from "express";
import {setHeaders} from "../../models/endpoints";
import url from "url";
import querystring from "querystring";
import PairwiseService from "../pairwise-relationship-data/pairwiseService";
import {PredictionSet} from "../../models/prediction";
import {getMinimalCitation} from "../../models/modelData";

function formatCancerSpecificData(data: any) {
    const ps = new PredictionSet("Cancer Specific Coexpression", "Protein", "",
        "", 1, 0, null, "Coexpressed Target",
        ["Data Source", "Cancer Type", "Coexpressed Target"]);
    Object.entries(data).forEach((match: any) => {
        {
            match = match[1];
            let dataSource = match.dataDesc.id.split("|")[0];
            let cancerType = match.dataDesc.id.split("|")[1];
            if (match && match.posGenes) {
                match.posGenes.forEach((gene: any) => {
                    const extraFields: any =
                        {
                            identifier: [
                                {
                                    "@type": "PropertyValue",
                                    "name": "Data Source",
                                    "value": dataSource
                                },
                                {
                                    "@type": "PropertyValue",
                                    "name": "Cancer Type",
                                    "value": cancerType
                                }
                            ],
                        };
                    ps.addPrediction(gene, "", null, extraFields);
                });
            }
        }
    })
    return ps;
}

function formatTissueSpecificData(data: any) {
    const ps = new PredictionSet("Tissue Specific Coexpression", "Protein", "",
        "", 1, 0, null, "Coexpressed Target",
        ["Data Source", "Tissue", "Coexpressed Target"]);
    Object.entries(data).forEach((match: any) => {
        {
            match = match[1];
            let dataSource = match.dataDesc.id.split("|")[0];
            let tissue = match.dataDesc.id.split("|")[1];
            if (match && match.posGenes) {
                match.posGenes.forEach((gene: any) => {
                    const extraFields: any =
                        {
                            identifier: [
                                {
                                    "@type": "PropertyValue",
                                    "name": "Data Source",
                                    "value": dataSource
                                }, {
                                    "@type": "PropertyValue",
                                    "name": "Tissue",
                                    "value": tissue
                                }],
                        };
                    ps.addPrediction(gene, "", null, extraFields);
                })
            }
        }
    })
    ps.addCitation(getMinimalCitation(37333417));
    return ps;
}

export async function coexpressionData(req: Request, res: Response): Promise<any>{
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);
    if (queryMap.target) {
        const targetQuery = queryMap.target.toString();
        const csDataDescriptions: any = PairwiseService.getAllDataDescs('TCGA', 'Gene_Coexpression');
        const tsDataDescriptions: any = PairwiseService.getAllDataDescs('GTEx', 'Gene_Coexpression');

        return Promise.all([csDataDescriptions, tsDataDescriptions]).then((dataDescriptionResults: any[]) => {
            const csDataDescIds = dataDescriptionResults[0].map((o: any) => Object(o.id));
            const tsDataDescIds = dataDescriptionResults[1].map((o: any) => Object(o.id));

            const csPairwiseSearch = PairwiseService.searchTermSecondaryPathways(
                {
                    "genes": [targetQuery],
                    "dataDescs": csDataDescIds
                });
            const tsPairwiseSearch = PairwiseService.searchTermSecondaryPathways(
                {
                    "genes": [targetQuery],
                    "dataDescs": tsDataDescIds
                });
            return Promise.all([csPairwiseSearch, tsPairwiseSearch]).then((pwSearchResults: any[]) => {
                const csPs = formatCancerSpecificData(pwSearchResults[0]);
                const tsPs = formatTissueSpecificData(pwSearchResults[1]);
                res.end(JSON.stringify([tsPs.asJSON(), csPs.asJSON()]));
            })
        });
    }
    res.end("No Protein Provided!");
}

exports.coexpressionData = coexpressionData;