"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.createPolygon = void 0;

var _d = require("d3");

var createPolygon = function createPolygon(coords) {
    var flattenCoords = coords.flat();
    var invalidCoords = flattenCoords.every(function(val) {
        return !val;
    });

    if (invalidCoords) {
        throw new Error("Invalid coords");
    }

    var polygon = (0, _d.polygonHull)(coords);
    var centroid = (0, _d.polygonCentroid)(polygon);
    return {
        polygon: polygon,
        centroid: centroid,
    };
};

exports.createPolygon = createPolygon;
