# pharos-community-data-api
A test API to be used for Pharos' dynamic predictions functionality.

## Build and Run this code
1. Fork this repo from the GitHub UI
    * ![img.png](../pharos-community-data-api/img.png)
    * Select your account as the owner
2. Check out your fork locally
    ```aidl
    git clone https://github.com/{{your github ID}}/pharos-community-data-api
    ```
3. Navigate to source code directory
   ```aidl
   cd /pharos-community-data-api
   ```
4. Install all dependencies
    ```
    npm install
    ```
5. **OPTIONAL - Build Kinase-Cancer-Predictions endpoint**
    * download MESH IDs
       ```aidl
       curl https://nlmpubs.nlm.nih.gov/projects/mesh/MESH_FILES/xmlmesh/desc2022.xml > desc2022.xml
       ```
    * build lookup tables for Kinase-Cancer Predictions
       ```aidl
       cd data_sources/kinase-cancer-predictions
       node build
       cd ../..
       ```
6. **THE OTHER OPTION - Skip building Kinase-Cancer-Predictions endpoint**
    * Alternatively, you can comment out the following lines from app.ts
    ```
    import {predictions} from "./data_sources/kinase-cancer-predictions/index"
    ...
    app.get("/predictions?*", (req: Request, res: Response) => predictions(req, res));
    ```
7. Install typescript if you haven't already
    ```aidl
    npm install -g typescript
    ```
8. Compile the typescript and run the app
    ```aidl
    tsc && node app
    ```
9. Verify it works.
    * Navigate to:
        ```aidl
        http://localhost:3001/ping
        ```
    * it should return some JSON
10. Hit your API from the Pharos Development deployment
    * Navigate to:
    ```aidl
    https://pharos-frontend-dev.appspot.com/toolbox
    ```
    * Choose a target, disease, or ligand from the search box
    * enter your API into the API Url field
    * add some query parameters
    * add some fields in curly braces (i.e. {name}) to pass data from Pharos to your API
    ```aidl
    http://localhost:3001/ping?name={name}&message=Hello world
    ```
    * see the preview of how the API results will look on a Pharos details page
      ![img_1.png](../pharos-community-data-api/img_1.png)

## Add your own endpoint
Here are the steps for creating your own endpoint. As an example, the endpoint accepts a 
SMILES for a ligand and returns the 

## Integrate your project into Pharos
