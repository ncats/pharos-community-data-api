import express, {Application, Request, Response} from 'express';
// @ts-ignore
import {ping, sample} from "./models/endpoints";
// @ts-ignore
import {predictions} from "./data_sources/kinase-cancer-predictions/index"
import {interactorScores} from "./data_sources/pairwise-relationship-data";
import {tissueSpecificCoexpression} from "./data_sources/tissue-specific-coexpression";
import {cancerSpecificCoExpression} from "./data_sources/cancer-specific-coexpression";

const app: Application = express()

const port: number = 3001

app.get('/ping*', (req: Request, res: Response) => ping(req, res));

app.get("/sample?*", (req: Request, res: Response) => sample(req, res));

app.get("/predictions?*", (req: Request, res: Response) => predictions(req, res));

app.get("/interactorScores?*", (req: Request, res: Response) => interactorScores(req, res));

app.get("/tissueSpecificCoexpression?*", (req: Request, res: Response) => tissueSpecificCoexpression(req, res));

app.get("/cancerSpecificCoExpression?*", (req: Request, res: Response) => cancerSpecificCoExpression(req, res));


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
});
