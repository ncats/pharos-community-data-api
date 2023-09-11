

export class Prediction {
    value: string;
    alternateName: string;
    confidence: number;
    extraFields: any;
    constructor(value: string, alternateName: string, confidence: number, extraFields: any) {
        this.value = value;
        this.alternateName = alternateName;
        this.confidence = confidence;
        this.extraFields = extraFields;
    }
}

export class PredictionSet {
    name: string;
    alternateName: string;
    schemaType: string;
    confidenceName: string;
    confidenceDescription: string;
    confMax: number;
    confMin: number;
    style: "table" | "card";
    citation: any;

    predictions: Prediction[] = [];

    constructor(name: string,
                schemaType: string,
                confidenceName: string,
                confidenceDescription: string,
                confMax: number,
                confMin: number,
                style: "table" | "card" = "table",
                alternateName?: string) {
        this.name = name;
        this.schemaType = schemaType;
        this.confidenceName = confidenceName;
        this.confidenceDescription = confidenceDescription;
        this.confMax = confMax;
        this.confMin = confMin;
        this.style = style;
        if (alternateName) {
            this.alternateName = alternateName;
        }
    }

    addPrediction(value: string, alternateName: string, confidence: number, extraFields: any = null) {
        this.predictions.push(new Prediction(value, alternateName, confidence, extraFields));
    }

    asJSON() : any {
        const predictions: any[] = [];
        this.predictions.forEach(p => {
            const predictionObj: any = {
                "@type": "Prediction",
                "name": this.name,
                "value": {
                    "@context": "https://schema.org",
                    "@type": this.schemaType,
                    "name": p.value,
                    "alternateName": p.alternateName,
                },
                "confidence": {
                    "@context": "https://schema.org",
                    "@type": "QuantitativeValue",
                    "value": p.confidence,
                    "alternateName": this.confidenceName,
                    "description": this.confidenceDescription,
                    "maxValue": this.confMax,
                    "minValue": this.confMin
                }
            };
            if (this.alternateName) {
                predictionObj.alternateName = this.alternateName;
            }
            if (p.extraFields) {
                for (var k in p.extraFields) {
                    predictionObj.value[k] = p.extraFields[k];
                }
            }
            predictions.push(predictionObj);
        });
        return {
            predictions: predictions,
            style: this.style,
            citation: this.citation
        };
    }

    addCitation(citation: any) {
        this.citation = citation;
    }
}
