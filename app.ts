import express, {Application, query, Request, Response} from 'express'
import url from "url";
import {getCitation, getPredictedDiseases, getPredictedTargets} from "./models/modelData";
const querystring = require("querystring");

const app: Application = express()

const port: number = 3001

function setHeaders(res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
}


app.get('/ping*', (req: Request, res: Response) => {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    if (parsedUrl != null && 'query' in parsedUrl && parsedUrl.query != null) {
        const queryMap = querystring.parse(parsedUrl.query);
        res.end(JSON.stringify(queryMap));
    } else {
        res.end('pong');
    }
});

app.get("/predictions?*", (req: any, res) => {
    setHeaders(res);
    const parsedUrl = url.parse(req.url);
    if (parsedUrl != null && 'query' in parsedUrl) {
        const queryMap = querystring.parse(parsedUrl.query);
        res.end(JSON.stringify([
            {
                predictions: getPredictedDiseases(), citation: getCitation()
            },
            {
                predictions: getPredictedTargets()
            }
        ]));
    }
});

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
