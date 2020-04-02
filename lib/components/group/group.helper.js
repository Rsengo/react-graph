"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.createGroupPolygon = void 0;

var _react = _interopRequireDefault(require("react"));

var _d = require("d3");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var _createGroupPolygonLine = (0, _d.line)()
    .x(function(d) {
        return d[0];
    })
    .y(function(d) {
        return d[1];
    })
    .curve(_d.curveCatmullRomClosed);

var createGroupPolygon = function createGroupPolygon(nodes) {
    var nodeCoords = nodes.map(function(d) {
        return [d.x, d.y];
    });
    var polygon = (0, _d.polygonHull)(nodeCoords);
    var centroid = (0, _d.polygonCentroid)(polygon);
    var unbiasedPolygonPoints = polygon.map(function(point) {
        return [point[0] - centroid[0], point[1] - centroid[1]];
    });

    var unbiasedPolygon = _createGroupPolygonLine(unbiasedPolygonPoints);

    return {
        polygon: unbiasedPolygon,
        centroid: centroid,
    };
};

exports.createGroupPolygon = createGroupPolygon;
