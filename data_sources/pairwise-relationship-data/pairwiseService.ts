import axios from "axios";

class PairwiseService {
    static getInteractorScoresForTerm(term: string, cutoff: number) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://idg.reactome.org/idgpairwise/relationships/combinedScoreGenesForTerm/${term}`)
                .then((res) => {
                    resolve(
                        Object.entries(res.data).map(([gene, score]) => ({
                            gene: gene,
                            score: score,
                            // @ts-ignore
                        })).filter(({score}) => score >= cutoff)
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static searchTermSecondaryPathways(postData: {}) {
        return new Promise((resolve, reject) => {
            axios
                .post(`https://idg.reactome.org/idgpairwise/pairwise/term/false`, postData)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getAllDataDescs(provenance: string, dataType: string) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://idg.reactome.org/idgpairwise/datadesc`)
                .then((res) => {
                    resolve(
                        res.data.filter((desc: any) =>
                            desc.provenance === provenance &&
                            desc.dataType === dataType))
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default PairwiseService;