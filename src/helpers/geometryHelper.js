import { polygonHull, polygonCentroid } from "d3";

const createPolygon = coords => {
    const flattenCoords = coords.flat();
    const invalidCoords = flattenCoords.every(val => !val);

    if (invalidCoords) {
        throw new Error("Invalid coords");
    }

    const polygon = polygonHull(coords);
    const centroid = polygonCentroid(polygon);

    return {
        polygon,
        centroid,
    };
};

export { createPolygon };
