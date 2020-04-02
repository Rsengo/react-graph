import React from "react";

import { polygonHull, polygonCentroid, line, curveCatmullRomClosed } from "d3";

const _createGroupPolygonLine = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveCatmullRomClosed);

const createGroupPolygon = nodes => {
    // TODO: возвращать по-умолчанию если все координаты нод === 0

    var nodeCoords = nodes.map(d => [d.x, d.y]);

    const polygon = polygonHull(nodeCoords);
    const centroid = polygonCentroid(polygon);

    const unbiasedPolygonPoints = polygon.map(function(point) {
        return [point[0] - centroid[0], point[1] - centroid[1]];
    });

    const unbiasedPolygon = _createGroupPolygonLine(unbiasedPolygonPoints);

    return {
        polygon: unbiasedPolygon,
        centroid,
    };
};

export { createGroupPolygon };
