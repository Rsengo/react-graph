import React from "react";

import { polygonHull, polygonCentroid, line, curveCatmullRomClosed } from "d3";
import { createPolygon } from "../../helpers/geometryHelper";

const _createGroupPolygonLine = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveCatmullRomClosed);

const _createPolygonBiasedFromCentroid = (polygon, centroid) => {
    return polygon.map(function(point) {
        return [point[0] - centroid[0], point[1] - centroid[1]];
    });
};

const createGroupPolygon = nodes => {
    // TODO: возвращать по-умолчанию если все координаты нод === 0

    const nodeCoords = nodes.map(d => [d.x, d.y]);

    try {
        const { polygon, centroid } = createPolygon(nodeCoords);
        const biasedPolygonPoints = _createPolygonBiasedFromCentroid(polygon, centroid);
        const biasedPolygon = _createGroupPolygonLine(biasedPolygonPoints);

        return {
            polygon: biasedPolygon,
            centroid,
        };
    } catch {
        return {
            polygon: "",
            centroid: [0, 0],
        };
    }

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

const getGroupNodes = nodes => {
    return Object.values(nodes).reduce((aggregator, node) => {
        if (!node.groups || !node.groups.length) {
            return aggregator;
        }

        const { groups } = node;

        groups.forEach(group => {
            if (!aggregator[group]) {
                aggregator[group] = [node];
            } else {
                aggregator[group] = [...aggregator[group], node];
            }
        });

        return aggregator;
    }, {});
};

export { createGroupPolygon, getGroupNodes };
