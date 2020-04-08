"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderGraph = renderGraph;

var _lodash = _interopRequireDefault(require("lodash.uniqby"));

var _react = _interopRequireDefault(require("react"));

var _graph = _interopRequireDefault(require("./graph.const"));

var _marker = require("../marker/marker.const");

var _Marker = _interopRequireDefault(require("../marker/Marker"));

var _link = require("../link/link.renderer");

var _node = require("../node/node.renderer");

var _group = require("../group/group.renderer");

var _group2 = require("../group/group.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
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

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly)
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach(function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
        }
    }
    return target;
}

function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
        obj[key] = value;
    }
    return obj;
}

function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
}

/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 * @returns {Function} memoized build definitions function.
 * @memberof Graph/renderer
 */
function _renderDefs() {
    var cachedDefs;
    return function(config) {
        if (cachedDefs) {
            return cachedDefs;
        }

        var small = _marker.MARKER_SMALL_SIZE;
        var medium = small + (_marker.MARKER_MEDIUM_OFFSET * config.maxZoom) / 3;
        var large = small + (_marker.MARKER_LARGE_OFFSET * config.maxZoom) / 3;
        var markerProps = {
            markerWidth: config.link.markerWidth,
            markerHeight: config.link.markerHeight,
        };
        cachedDefs = /*#__PURE__*/ _react["default"].createElement(
            "defs",
            null,
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_S,
                        refX: small,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_SH,
                        refX: small,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_M,
                        refX: medium,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_MH,
                        refX: medium,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_L,
                        refX: large,
                        fill: config.link.color,
                    },
                    markerProps
                )
            ),
            /*#__PURE__*/ _react["default"].createElement(
                _Marker["default"],
                _extends(
                    {
                        id: _marker.MARKERS.MARKER_LH,
                        refX: large,
                        fill: config.link.highlightColor,
                    },
                    markerProps
                )
            )
        );
        return cachedDefs;
    };
}
/**
 * Memoized reference for _renderDefs.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @returns {Object} graph reusable objects [defs](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs).
 * @memberof Graph/renderer
 */

var _memoizedRenderDefs = _renderDefs();
/**
 * Method that actually is exported an consumed by Graph component in order to build all Nodes and Link
 * components.
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param  {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param  {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param  {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an Object that maps adjacent nodes ids (string) and their values (number).
 * ```javascript
 *  // links example
 *  {
 *     "Androsynth": {
 *         "Chenjesu": 1,
 *         "Ilwrath": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Guardian": 1
 *     },
 *     "Chenjesu": {
 *         "Androsynth": 1,
 *         "Mycon": 1,
 *         "Spathi": 1,
 *         "Umgah": 1,
 *         "VUX": 1,
 *         "Broodhmome": 1
 *     },
 *     ...
 *  }
 * ```
 * @param  {Function[]} linkCallbacks - array of callbacks for used defined event handler for link interactions.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param  {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param  {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param  {string} highlightedLink.source - id of source node for highlighted link.
 * @param  {string} highlightedLink.target - id of target node for highlighted link.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object containing the generated nodes and links that form the graph.
 * @memberof Graph/renderer
 */

function renderGraph(
    nodes,
    nodeCallbacks,
    links,
    linksMatrix,
    linkCallbacks,
    groups,
    config,
    highlightedNode,
    highlightedLink,
    transform,
    groupsCollapsed
) {
    if (!groupsCollapsed) {
        return {
            nodes: (0, _node.renderNodes)(
                nodes,
                nodeCallbacks,
                config,
                highlightedNode,
                highlightedLink,
                transform,
                linksMatrix
            ),
            links: (0, _link.renderLinks)(
                nodes,
                links,
                linksMatrix,
                config,
                linkCallbacks,
                highlightedNode,
                highlightedLink,
                transform
            ),
            groups: (0, _group.renderGroups)(nodes, groups, config),
            defs: _memoizedRenderDefs(config),
        };
    }

    var nodesWithoutGroups = Object.values(nodes).filter(function(_ref) {
        var groups = _ref.groups;
        return !groups || !groups.length;
    });
    var nodesWithGroups = Object.values(nodes).filter(function(_ref2) {
        var groups = _ref2.groups;
        return groups && groups.length;
    });
    var groupNodes = (0, _group2.getGroupNodes)(nodesWithGroups);
    var collapsedNodes = Object.values(groups).map(function(_ref3) {
        var id = _ref3.id,
            fillColor = _ref3.fillColor;
        var currentGroupNodes = groupNodes[id];

        var _createGroupPolygon = (0, _group2.createGroupPolygon)(currentGroupNodes),
            centroid = _createGroupPolygon.centroid;

        return {
            id: id,
            color: fillColor,
            x: centroid[0],
            y: centroid[1],
        };
    });
    var collapsedLinks = Object.values(links).map(function(link) {
        var target = link.target,
            source = link.source;
        var sourceId = source.id;
        var sourceNode = nodesWithGroups.find(function(_ref4) {
            var id = _ref4.id;
            return id === sourceId;
        });
        var sourceGroups = (sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.groups) || [sourceId];
        var targetId = target.id;
        var targetNode = nodesWithGroups.find(function(_ref5) {
            var id = _ref5.id;
            return id === targetId;
        });
        var targetGroups = (targetNode === null || targetNode === void 0 ? void 0 : targetNode.groups) || [targetId];
        var linksArray = [];
        sourceGroups.forEach(function(sourceGroup) {
            targetGroups.forEach(function(targetGroup) {
                linksArray.push(
                    _objectSpread({}, link, {
                        target: targetGroup,
                        source: sourceGroup,
                    })
                );
            });
        });
        return linksArray;
    });
    var collapsedLinksFlat = collapsedLinks.flat();
    var flattenCollapsedLinks = (0, _lodash["default"])(collapsedLinksFlat, function(_ref6) {
        var target = _ref6.target,
            source = _ref6.source;
        return target + source;
    });
    var resultNodes = []
        .concat(_toConsumableArray(nodesWithoutGroups), _toConsumableArray(collapsedNodes))
        .reduce(function(agg, curNode) {
            return _objectSpread({}, agg, _defineProperty({}, curNode.id, curNode));
        }, {});
    return {
        nodes: (0, _node.renderNodes)(
            resultNodes,
            nodeCallbacks,
            config,
            highlightedNode,
            highlightedLink,
            transform,
            linksMatrix
        ),
        links: (0, _link.renderLinks)(
            resultNodes,
            flattenCollapsedLinks,
            linksMatrix,
            config,
            linkCallbacks,
            highlightedNode,
            highlightedLink,
            transform
        ),
        groups: [],
        defs: _memoizedRenderDefs(config),
    };
}
