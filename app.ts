import express, {Application, query, Request, Response} from 'express'
import {ping, predictions} from "./models/endpoints";
const app: Application = express()

const port: number = 3001

function setHeaders(res: Response) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
}

app.get('/ping*', (req: Request, res: Response) => ping(req, res));

app.get("/predictions?*", (req: Request, res: Response) => predictions(req, res));

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})
