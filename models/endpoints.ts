import {Request, Response} from "express";
import url from "url";
import querystring from "querystring";
import {getCitation, getPredictedDiseases, getPredictedTargets} from "./modelData";

function setHeaders(res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
}

export const ping = (req: Request, res: Response) => {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    if (parsedUrl != null && 'query' in parsedUrl && parsedUrl.query != null) {
        const queryMap = querystring.parse(parsedUrl.query);
        res.end(JSON.stringify(queryMap));
    } else {
        res.end('pong');
    }
}

export const predictions = (req: Request, res: Response) => {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    if (parsedUrl != null && 'query' in parsedUrl) {
        const queryMap = querystring.parse(parsedUrl.query);
        const diseaseSet = getPredictedDiseases();
        const targetSet = getPredictedTargets();
        res.end(JSON.stringify([
            diseaseSet,
            targetSet
        ]));
    }
}