import fs from "fs";
const rawData = require('./disease-alliance-json_human_25.json');

const targetLookup: Map<string, any[]> = new Map<string, any[]>();
rawData.data.forEach((row: any) => {
    let associations: any = [];
    if (targetLookup.has(row.DBObjectSymbol)) {
        associations = targetLookup.get(row.DBObjectSymbol);
    } else {
        targetLookup.set(row.DBObjectSymbol, associations);
    }
    associations.push({
        type: row.AssociationType, // i.e. is_marker_for, is_implicated_in, etc.
        diseaseID: row.DOID,
        diseaseTerm: row.DOtermName,
        evidenceCode: row.EvidenceCode,
        evidenceCodeName: row.EvidenceCodeName,
        reference: row.Reference // can be PMID, RGD, MGI
    });
});

const { replacer } = require("../kinase-cancer-predictions/utilities");
fs.writeFileSync(__dirname + '/targetLookup.json', JSON.stringify(targetLookup, replacer));