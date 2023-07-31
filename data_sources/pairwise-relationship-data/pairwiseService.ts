import axios from "axios";

class PairwiseService {
    static getInteractorScoresForTerm(term: string) {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://idg.reactome.org/idgpairwise/relationships/combinedScoreGenesForTerm/${term}`)
                .then((res) => {
                    resolve(
                        Object.entries(res.data).map(([gene, score]) => ({
                            gene: gene,
                            score: score,
                        }))
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

export default PairwiseService;