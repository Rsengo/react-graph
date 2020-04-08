"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.getGroupNodes = exports.createGroupPolygon = void 0;

var _react = _interopRequireDefault(require("react"));

var _d = require("d3");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]")
        return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }
        return arr2;
    }
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
    // TODO: возвращать по-умолчанию если все координаты нод === 0
    var nodeCoords = nodes.map(function(d) {
        return [d.x, d.y];
    });
    var flattenCoords = nodeCoords.flat();
    var invalidNodes = flattenCoords.every(function(val) {
        return !val;
    });

    if (invalidNodes) {
        return {
            polygon: "",
            centroid: [0, 0],
        };
    }

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

var getGroupNodes = function getGroupNodes(nodes) {
    return Object.values(nodes).reduce(function(aggregator, node) {
        if (!node.groups || !node.groups.length) {
            return aggregator;
        }

        var groups = node.groups;
        groups.forEach(function(group) {
            if (!aggregator[group]) {
                aggregator[group] = [node];
            } else {
                aggregator[group] = [].concat(_toConsumableArray(aggregator[group]), [node]);
            }
        });
        return aggregator;
    }, {});
};

exports.getGroupNodes = getGroupNodes;
