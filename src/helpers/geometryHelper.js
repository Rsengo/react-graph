import { polygonHull, polygonCentroid } from "d3";

const OFFSET = 15;

function _getCoordinatesForPolygonHull(coords) {
    if (coords.length > 2) {
        return coords;
    }

    if (coords.length == 1) {
        const [x, y] = coords[0];
        return createBboxForPoint(x, y, OFFSET);
    }

    if (coords.length == 2) {
        return createBboxForLine(coords[0], coords[1], OFFSET);
    }

    throw new Error("Invalid coords");
}

function createBboxForPoint(x, y, offset) {
    // TODO throw if invalid points or offset

    return [
        [x + offset, y],
        [x, y - offset],
        [x - offset, y],
        [x, y + offset],
    ];
}

function createBboxForLine(startCoordinate, endCoordinate, offset) {
    const [x1, y1] = startCoordinate;
    const [x2, y2] = endCoordinate;

    const xCenter = (x1 + x2) / 2;
    const yCenter = (y1 + y2) / 2;

    return [
        [...startCoordinate],
        [xCenter + offset, yCenter + offset],
        [...endCoordinate],
        [xCenter - offset, yCenter - offset],
    ];
}

function createPolygon(coords) {
    const flattenCoords = coords.flat();
    const invalidCoords = flattenCoords.every(val => !val);

    if (invalidCoords) {
        throw new Error("Invalid coords");
    }

    const polygonCoordinates = _getCoordinatesForPolygonHull(coords);
    const polygon = polygonHull(polygonCoordinates);
    const centroid = polygonCentroid(polygon);

    return {
        polygon,
        centroid,
    };
}

export { createPolygon, createBboxForPoint, createBboxForLine };
