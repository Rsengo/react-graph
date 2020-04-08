import React from "react";

import { polygonHull, polygonCentroid, line, curveCatmullRomClosed } from "d3";

const _createGroupPolygonLine = line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(curveCatmullRomClosed);

const createGroupPolygon = nodes => {
    // TODO: возвращать по-умолчанию если все координаты нод === 0

    var nodeCoords = nodes.map(d => [d.x, d.y]);

    const flattenCoords = nodeCoords.flat();
    const invalidNodes = flattenCoords.every(val => !val);

    if (invalidNodes) {
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
