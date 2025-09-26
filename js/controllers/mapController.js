import * as MapService from "../services/mapService.js";

import { select } from "https://esm.sh/d3-selection";
import { geoPath, geoMercator } from "https://esm.sh/d3-geo";

export async function reloadMap(mapContainer, text) {
  //   try {
  const res = await MapService.getGeoData(text);
  const geoJson = res.data;

  console.log(geoJson)
  const width = mapContainer.offsetWidth;
  const height = mapContainer.offsetHeight;

  let projection = geoMercator();
  projection.fitSize([width, height], geoJson);

  let geoGenerator = geoPath().projection(projection);

  select("#map")
    .selectAll("path")
    .data(geoJson.features)
    .enter()
    .append("path")
    .attr("d", geoGenerator);
  //   } catch (err) {
  //         console.log(err)
  //   }
}
