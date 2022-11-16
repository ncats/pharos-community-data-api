

export class Prediction {
    value: string;
    alternateName: string;
    confidence: number;
    constructor(value: string, alternateName: string, confidence: number) {
        this.value = value;
        this.alternateName = alternateName;
        this.confidence = confidence;
    }
}

export class PredictionSet {
    name: string;
    schemaType: string;
    confidenceName: string;
    confidenceDescription: string;
    confMax: number;
    confMin: number;

    predictions: Prediction[] = [];

    constructor(name: string, schemaType: string, confidenceName: string, confidenceDescription: string, confMax: number, confMin: number) {
        this.name = name;
        this.schemaType = schemaType;
        this.confidenceName = confidenceName;
        this.confidenceDescription = confidenceDescription;
        this.confMax = confMax;
        this.confMin = confMin;
    }

    addPrediction(value: string, alternateName: string, confidence: number) {
        this.predictions.push(new Prediction(value, alternateName, confidence));
    }

    asJSON() : any {
        const predictions: any[] = [];
        this.predictions.forEach(p => {
            predictions.push({
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
            });
        });
        return predictions;
    }
}
