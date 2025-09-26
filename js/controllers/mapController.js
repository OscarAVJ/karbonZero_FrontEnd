import * as MapService from "../services/mapService.js";

import { select } from "https://esm.sh/d3-selection";
import { geoPath, geoEquirectangular } from "https://esm.sh/d3-geo";

export async function reloadMap(mapContainer, text, scaleRange) {
  //   try {
  const res = await MapService.getGeoData(text);
  const geoJson = res.data;

  document.querySelector("#map").innerHTML = "";

  const width = mapContainer.offsetWidth;
  const height = mapContainer.offsetHeight;

  const projection = geoEquirectangular();
  projection.center(geoJson.properties.center)
  projection.translate([width / 2, height / 2])

  projection.scale(geoJson.properties.scale)
  scaleRange.value = geoJson.properties.scale;

  const geoGenerator = geoPath().projection(projection);

  const u = select('#map')
    .selectAll('path')
    .data(geoJson.features);

  u.enter()
    .append('path')
    .attr('d', geoGenerator);


  //   } catch (err) {
  //         console.log(err)
  //   }
}
