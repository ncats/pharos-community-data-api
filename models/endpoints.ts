import {Request, Response} from "express";
import url from "url";
import querystring from "querystring";
import {getPong, getPredictedDiseases, getPredictedLigands, getPredictedTargets} from "./modelData";

export function setHeaders(res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
}

function ping(req: Request, res: Response): any {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    const queryMap = querystring.parse(parsedUrl.query);
    res.end(JSON.stringify([getPong(queryMap)]));
}

function sample(req: Request, res: Response): any {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    if (parsedUrl != null && 'query' in parsedUrl) {
        const targetSet = getPredictedTargets();
        const diseaseSet = getPredictedDiseases();
        const ligandSet = getPredictedLigands();
        res.end(JSON.stringify([
            targetSet,
            diseaseSet,
            ligandSet
        ]));
    }
}
exports.setHeaders = setHeaders;
exports.ping = ping;
exports.sample = sample;