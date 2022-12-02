import {Prediction, PredictionSet} from "./prediction";
import {ParsedUrlQuery} from "querystring";

export function getPong(map: ParsedUrlQuery) {
    const ps = new PredictionSet("Ping Result", "Thing", "probability",
        "Everything needs a confidence metric, even in a simple ping response",
        1, 0);
    const properties = [];
    for (let field in map) {
        properties.push(
        {
            "@type": "PropertyValue",
            "name": field,
            "value": map[field]
        })
    }
    ps.addPrediction("Pong", null, 1, {identifier: properties});
    return ps.asJSON();
}

export function getPredictedDiseases() {
    const ps = new PredictionSet("Predicted Cancer", "MedicalCondition", "probability",
        "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
        1, 0);
    ps.addPrediction("Carcinoma, Non-Small-Cell Lung", "MESH:D002289", 0.85);
    ps.addPrediction("Lung Neoplasms", "MESH:D008175", 0.7400128810648348);
    ps.addCitation(getCitation());
    return ps.asJSON();
}

export function getPredictedTargets() {
    const ps = new PredictionSet("Predicted Kinase", "Protein", "probability",
        "Measure of the relevance of inhibiting a particular protein kinase for a specific cancer",
        1, 0, "card");
    ps.addPrediction("MOK", null, 0.925);
    ps.addPrediction("AMHR2", null, 0.915);
    return ps.asJSON();
}

export function getPredictedLigands() {
    const ps = new PredictionSet("Predicted Ligands", "ChemicalSubstance", "Confidence Measure",
        "Use this field to provide your measure of confidence in your prediction",
        10, 0, "card");
    ps.addPrediction("drug name", "alternate name", 0.5,
        { hasRepresentation: { name: "smiles", value: "CN1CCN(CC1)C1=Nc2cc(Cl)ccc2Nc2ccccc12" } });
    ps.addPrediction("drug name 2", "alternate name 2", 5,
        { hasRepresentation: { name: "smiles", value: "FC(F)(F)Oc1cccc(CN2CCN(CC2)C2=Nc3cc(Cl)ccc3Nc3ccccc23)c1" } });
    ps.addPrediction("drug name 3", "alternate name 3", 2.5,
        { hasRepresentation: { name: "smiles", value: "COc1ccccc1CNN1c2ccc(Cl)cc2N=C(N2CCN(C)CC2)c2ccccc12" } });
    ps.addPrediction("drug name 4", "alternate name 4", 1.25,
        { hasRepresentation: { name: "smiles", value: "CCOc1ccc2ccccc2c1C(=O)NN1c2ccc(Cl)cc2N=C(N2CCN(C)CC2)c2ccccc12" } });
    ps.addPrediction("drug name 5", "alternate name 5", 3.75,
        { hasRepresentation: { name: "smiles", value: "COc1cccc(c1)C(=O)NN1c2ccc(Cl)cc2N=C(N2CCN(C)CC2)c2ccccc12" } });
    ps.addPrediction("drug name 6", "alternate name 6", 9,
        { hasRepresentation: { name: "smiles", value: "COc1ccc(cc1)C(=O)NN1c2ccc(Cl)cc2N=C(N2CCN(C)CC2)c2ccccc12" } });
    ps.addCitation(getMinimalCitation());
    return ps.asJSON();
}
export function getMinimalCitation() {
    return {
        "@context": "http://schema.org",
        "@type": "ScholarlyArticle",
        "identifier": {
            "@type": "PropertyValue",
            "name": "PMID",
            "value": 33156327
        }
    };
}
export function getCitation() {
    return {
        "@context": "http://schema.org",
        "@type": "ScholarlyArticle",
        "name": "Supervised learning with word embeddings derived from PubMed captures latent knowledge about protein kinases and cancer",
        "abstract": "Inhibiting protein kinases (PKs) that cause cancers has been an important topic in cancer therapy for years. So far, almost 8% of >530 PKs have been targeted by FDA-approved medications, and around 150 protein kinase inhibitors (PKIs) have been tested in clinical trials. We present an approach based on natural language processing and machine learning to investigate the relations between PKs and cancers, predicting PKs whose inhibition would be efficacious to treat a certain cancer. Our approach represents PKs and cancers as semantically meaningful 100-dimensional vectors based on word and concept neighborhoods in PubMed abstracts. We use information about phase I-IV trials in ClinicalTrials.gov to construct a training set for random forest classification. Our results with historical data show that associations between PKs and specific cancers can be predicted years in advance with good accuracy. Our tool can be used to predict the relevance of inhibiting PKs for specific cancers and to support the design of well-focused clinical trials to discover novel PKIs for cancer therapy.",
        "url": "https://pubmed.ncbi.nlm.nih.gov/34888523/",
        "author": [
            { "@type": "Person", "name": "Vida Ravanmehr" },
            { "@type": "Person", "name": "Hannah Blau" },
            { "@type": "Person", "name": "Luca Cappelletti" },
            { "@type": "Person", "name": "Tommaso Fontana" },
            { "@type": "Person", "name": "Leigh Carmody" },
            { "@type": "Person", "name": "Ben Coleman" },
            { "@type": "Person", "name": "Joshy George" },
            { "@type": "Person", "name": "Justin Reese" },
            { "@type": "Person", "name": "Marcin Joachimiak" },
            { "@type": "Person", "name": "Giovanni Bocci" },
            { "@type": "Person", "name": "Peter Hansen" },
            { "@type": "Person", "name": "Carol Bult" },
            { "@type": "Person", "name": "Jens Rueter" },
            { "@type": "Person", "name": "Elena Casiraghi" },
            { "@type": "Person", "name": "Giorgio Valentini" },
            { "@type": "Person", "name": "Christopher Mungall" },
            { "@type": "Person", "name": "Tudor I Oprea" },
            { "@type": "Person", "name": "Peter N Robinson" }
        ],
        "datePublished": "2021 Dec 8",
        "publisher": {
            "@type": "Organization",
            "name": "NAR Genomics and Bioinformatics",
            "url": "https://academic.oup.com/nargab"
        },
        "identifier": {
            "@type": "PropertyValue",
            "name": "PMID",
            "value": 34888523
        },
        "creditText": "Ravanmehr et al."
    };

}