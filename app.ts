import express, {Application, Request, Response} from 'express';
// @ts-ignore
import {ping, sample} from "./models/endpoints";
// @ts-ignore
import {predictions} from "./data_sources/kinase-cancer-predictions/index"
const app: Application = express()

const port: number = 3001

app.get('/ping*', (req: Request, res: Response) => ping(req, res));

app.get("/sample?*", (req: Request, res: Response) => sample(req, res));

app.get("/predictions?*", (req: Request, res: Response) => predictions(req, res));

import {associations} from "./data_sources/alliance-genome/index"
app.get("/associations?*", (req: Request, res: Response) => associations(req, res));

app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
});
