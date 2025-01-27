const fs = require("fs");
const request = require('then-request');

// @ts-ignore
import {parse} from "csv-parse/sync";

export function setHeaders(res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
}

export async function parseCSV(path: string) {
  const options: any = {
    columns: true,
    skip_empty_lines: true
  };
  if(path.endsWith('.tsv')){
    options.delimiter = '\t';
  }
  const data = fs.readFileSync(path, {encoding:"utf-8"});
  // @ts-ignore
  return parse(data, options);
}

const url = 'https://ncatsidg.appspot.com/graphql'
export async function runGraphQLquery(query: string, variables: any) {
  return request('POST', url, {json: {query: query, variables: variables}})
      .then((res: any) => {
        if (res.statusCode == 200) {
          const rawData = JSON.parse(res.body.toString());
          if (rawData && rawData.data) {
            return rawData.data
          }
          return rawData;
        } else {
          console.error(`Error running query`);
          console.error(query);
        }
      });
}
