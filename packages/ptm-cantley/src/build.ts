import * as fs from "fs";
import {parseCSV, runGraphQLquery} from '../util';

const kinaseFile = __dirname + `/../../rawdata/41586_2022_5575_MOESM3_ESM.csv`;

const matrix2uniprot = new Map<string, string>();
const pharosData = new Map<string, string>();

const phosphositeFile = __dirname + `/../../rawdata/41586_2022_5575_MOESM5_ESM.csv`;
// const phosphositeFile = __dirname + `/../../rawdata/small.csv`;
const query =
  `query Target($top: Int) {
    targets {
      targets(top: $top) {
        uniprot
        seq
      }
    }
  }`;
const variables = {"top":50000};

Promise.all([parseCSV(kinaseFile), parseCSV(phosphositeFile), runGraphQLquery(query, variables)]).then((res: any[]) => {
  const kinases = res[0];
  const phosphosites = res[1];
  const pharosSequences = res[2];

  pharosSequences.targets.targets.forEach((target: any) => {
    pharosData.set(target.uniprot, target.seq);
  });

  kinases.forEach((kinasedata: any) => {
    matrix2uniprot.set(kinasedata['Matrix_name'], kinasedata['Uniprot id']);
  });

  const dataArray = new Map<string, ResidueData[]>();

  phosphosites.forEach((site: any) => {
    const substrateAccession = site['Database Uniprot Accession'];

    if (pharosData.has(substrateAccession)) {
      const seq = "_______" + pharosData.get(substrateAccession) + "_______";
      const index = seq.indexOf(site['SITE_+/-7_AA']) + 1;

      const expectedIndex = parseInt(site['Phosphosite'].substring(1));
      if (index) {
        const residueArray = dataArray.get(substrateAccession) || [];
        if (residueArray.length == 0) {
          dataArray.set(substrateAccession, residueArray);
        }
        const dataObj = new ResidueData(index, expectedIndex);
        residueArray.push(dataObj);
        matrix2uniprot.forEach((kinaseAccession, matID) => {
          const percentage = site[matID + "_percentile"];
          if (percentage >= 90) {
            dataObj.addKinase(kinaseAccession, matID, percentage);
          }
        });
      }
    }
  });
  dataArray.forEach((residueDataArray, uniprot) => {
    ResidueData.writeToFile(uniprot, residueDataArray);
  });
});

class ResidueData {
  residue: number;
  expectedResidue: number;
  kinaseList: { accession: string, percentage: number, sym: string}[];
  constructor(residue: number, expectedResidue: number) {
    this.residue = residue;
    this.expectedResidue = expectedResidue;
    this.kinaseList = [];
  }
  addKinase(accession: string, sym: string, percentage: number) {
    this.kinaseList.push({accession: accession, percentage: percentage, sym: sym});
  }
  getDescription() {
    const sortedKinases = this.kinaseList.sort((a,b) => b.percentage - a.percentage);
    return ((this.residue != this.expectedResidue) ? `* Site originally reported at residue ${this.expectedResidue}<br/>` : "") +
        `Potential Kinases (<a href="https://pharos.nih.gov/targets?collection=${sortedKinases.map(k => k.accession)}" 
        target="_blank">Explore list in Pharos</a>):<br/> ${sortedKinases.map(k=>k.sym + " (" + k.accession + ") - " + k.percentage).join('<br/>')}`;
  }

  static writeToFile(uniprot: string, residueList: ResidueData[]) {
    const dataFile = __dirname + `/../../data/${uniprot}.json`;
    const jsonData = {
      accession: uniprot,
      features: residueList.map(residueData => {
        return {
          type: "Kinase Recognition Site",
          description: residueData.getDescription(),
          begin: residueData.residue,
          end: residueData.residue
        }
      })
    }
    fs.writeFileSync(dataFile, JSON.stringify(jsonData));
    console.log('writing: ' + dataFile);
  }
}
