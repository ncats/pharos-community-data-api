# This dockerfile builds and hosts the APIs in a docker container
# Also, this helps us know what problems a user will likely run into when building this repo for the first time so we can make a good tutorial in the README.md file

FROM node:16 as buildContainer

RUN git clone https://github.com/ncats/pharos-community-data-api
WORKDIR /pharos-community-data-api
ENV NODE_OPTIONS --max-old-space-size=4096
RUN npm install -g npm@latest
RUN npm install
RUN npm install -g typescript
RUN curl https://nlmpubs.nlm.nih.gov/projects/mesh/MESH_FILES/xmlmesh/desc2023.xml > desc2023.xml
WORKDIR /pharos-community-data-api/data_sources/kinase-cancer-predictions
RUN node build
WORKDIR /pharos-community-data-api
CMD ["tsc", "&&", "node", "app"]


