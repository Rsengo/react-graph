"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.createPolygon = createPolygon;
exports.createBboxForPoint = createBboxForPoint;
exports.createBboxForLine = createBboxForLine;

var _d2 = require("d3");

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _slicedToArray(arr, i) {
    return (
        _arrayWithHoles(arr) ||
        _iterableToArrayLimit(arr, i) ||
        _unsupportedIterableToArray(arr, i) ||
        _nonIterableRest()
    );
}

function _nonIterableRest() {
    throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally {
            if (_d) throw _e;
        }
    }
    return _arr;
}

function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}

var OFFSET = 15;

function _getCoordinatesForPolygonHull(coords) {
    if (coords.length > 2) {
        return coords;
    }

    if (coords.length == 1) {
        var _coords$ = _slicedToArray(coords[0], 2),
            x = _coords$[0],
            y = _coords$[1];

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
    var _startCoordinate = _slicedToArray(startCoordinate, 2),
        x1 = _startCoordinate[0],
        y1 = _startCoordinate[1];

    var _endCoordinate = _slicedToArray(endCoordinate, 2),
        x2 = _endCoordinate[0],
        y2 = _endCoordinate[1];

    var xCenter = (x1 + x2) / 2;
    var yCenter = (y1 + y2) / 2;
    return [
        _toConsumableArray(startCoordinate),
        [xCenter + offset, yCenter + offset],
        _toConsumableArray(endCoordinate),
        [xCenter - offset, yCenter - offset],
    ];
}

function createPolygon(coords) {
    var flattenCoords = coords.flat();
    var invalidCoords = flattenCoords.every(function(val) {
        return !val;
    });

    if (invalidCoords) {
        throw new Error("Invalid coords");
    }

    var polygonCoordinates = _getCoordinatesForPolygonHull(coords);

    var polygon = (0, _d2.polygonHull)(polygonCoordinates);
    var centroid = (0, _d2.polygonCentroid)(polygon);
    return {
        polygon: polygon,
        centroid: centroid,
    };
}
