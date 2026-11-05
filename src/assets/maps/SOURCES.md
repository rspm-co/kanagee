# Maharashtra map sources

- State outline and district headquarters: [datta07/INDIAN-SHAPEFILES](https://github.com/datta07/INDIAN-SHAPEFILES/tree/master/STATES/MAHARASHTRA), MIT licence (see LICENSE.txt).
- Headquarters file: `MAHARASHTRA District Hq.geojson`; downloaded 5 November 2026. Contains 36 district headquarters, including Palghar and both Mumbai districts.
- Current English and Marathi district names: [Maharashtra Planning Department](https://plan.maharashtra.gov.in/36-%E0%A4%9C%E0%A4%BF%E0%A4%B2%E0%A5%8D%E0%A4%B9%E0%A4%BE/).

The generator maps historical names and spellings in the coordinates dataset to the current district names. The numbered pins represent district headquarters, not district centroids or stall locations. Coastal callouts have leader lines to their actual coordinates to keep nearby numbers distinct.

Regenerate the website data with `node scripts/prepare-map.mjs`. Generate the standalone vector map with `node scripts/export-district-map.mjs`.
