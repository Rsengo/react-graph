"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.buildLinkPathDefinition = buildLinkPathDefinition;
exports.getId = getId;

var _link = require("./link.const");

var _RADIUS_STRATEGIES;

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

/**
 * Computes radius value for a straight line.
 * @returns {number} radius for straight line.
 * @memberof Link/helper
 */
function straightLineRadius() {
    return 0;
}
/**
 * Computes radius for a smooth curve effect.
 * @param {number} x1 - x value for point 1
 * @param {number} y1 - y value for point 1
 * @param {number} x2 - y value for point 2
 * @param {number} y2 - y value for point 2
 * @returns{number} value of radius.
 * @memberof Link/helper
 */

function smoothCurveRadius(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Computes radius value for a full curve (semi circumference).
 * @returns {number} radius for full curve.
 * @memberof Link/helper
 */

function fullCurveRadius() {
    return 1;
}

var RADIUS_STRATEGIES =
    ((_RADIUS_STRATEGIES = {}),
    _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.STRAIGHT, straightLineRadius),
    _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.CURVE_SMOOTH, smoothCurveRadius),
    _defineProperty(_RADIUS_STRATEGIES, _link.LINE_TYPES.CURVE_FULL, fullCurveRadius),
    _RADIUS_STRATEGIES);
/**
 * Get a strategy to compute line radius.<br/>
 * *CURVE_SMOOTH* type inspired by {@link http://bl.ocks.org/mbostock/1153292|mbostock - Mobile Patent Suits}.
 * @param {string} [type=LINE_TYPES.STRAIGHT] type of curve to get radius strategy from.
 * @returns {Function} a function that calculates a radius
 * to match curve type expectation. Fallback is the straight line.
 * @memberof Link/helper
 */

function getRadiusStrategy(type) {
    return RADIUS_STRATEGIES[type] || RADIUS_STRATEGIES[_link.LINE_TYPES.STRAIGHT];
}
/**
 * This method returns the path definition for a given link base on the line type
 * and the link source and target.
 * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d|d attribute mdn}
 * @param {Object} link - the link to build the path definition
 * @param {Object} link.source - link source
 * @param {Object} link.target - link target
 * @param {string} type - the link line type
 * @returns {string} the path definition for the requested link
 * @memberof Link/helper
 */

function buildLinkPathDefinition(_ref) {
    var _ref$source = _ref.source,
        source = _ref$source === void 0 ? {} : _ref$source,
        _ref$target = _ref.target,
        target = _ref$target === void 0 ? {} : _ref$target;
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _link.LINE_TYPES.STRAIGHT;
    var sx = source.x,
        sy = source.y;
    var tx = target.x,
        ty = target.y;
    var validType = _link.LINE_TYPES[type] || _link.LINE_TYPES.STRAIGHT;
    var radius = getRadiusStrategy(validType)(sx, sy, tx, ty);
    return "M"
        .concat(sx, ",")
        .concat(sy, "A")
        .concat(radius, ",")
        .concat(radius, " 0 0,1 ")
        .concat(tx, ",")
        .concat(ty);
}
/**
 * This function extracts an id from a link.
 * **Why this function?**
 * According to [d3-force](https://github.com/d3/d3-force#link_links)
 * d3 links might be initialized with "source" and "target"
 * properties as numbers or strings, but after initialization they
 * are converted to an object. This small utility functions ensures
 * that weather in initialization or further into the lifetime of the graph
 * we always get the id.
 * @param {Object|string|number} sot source or target
 * of the link to extract id.
 * we want to extract an id.
 * @returns {string|number} the id of the link.
 * @memberof Graph/helper
 */

function getId(sot) {
    return sot.id !== undefined && sot.id !== null ? sot.id : sot;
}
