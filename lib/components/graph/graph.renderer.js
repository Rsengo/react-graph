"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderGraph = renderGraph;

var _utils = require("../../utils");

var _react = _interopRequireDefault(require("react"));

var _graph = _interopRequireDefault(require("./graph.const"));

var _marker = require("../marker/marker.const");

var _Marker = _interopRequireDefault(require("../marker/Marker"));

var _link = require("../link/link.renderer");

var _node = require("../node/node.renderer");

var _group = require("../group/group.renderer");

var _group2 = require("../group/group.helper");

var _collapse = require("../group/collapse.hepler");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
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
        cachedDefs = _react["default"].createElement(
            "defs",
            null,
            _react["default"].createElement(
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
            _react["default"].createElement(
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
            _react["default"].createElement(
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
            _react["default"].createElement(
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
            _react["default"].createElement(
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
            _react["default"].createElement(
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
    var collapsedNodes = null;
    var collapsedLinks = null;

    if (groupsCollapsed) {
        var collapsedData = (0, _collapse.getCollapsedData)(nodes, links, groups);
        collapsedNodes = collapsedData.nodes;
        collapsedLinks = collapsedData.links;
    }

    var usedNodes = groupsCollapsed ? collapsedNodes : nodes;
    var usedLinks = groupsCollapsed ? collapsedLinks : links;
    var usedGroups = groupsCollapsed ? null : (0, _group.renderGroups)(nodes, groups, config);
    return {
        nodes: (0, _node.renderNodes)(
            usedNodes,
            nodeCallbacks,
            config,
            highlightedNode,
            highlightedLink,
            transform,
            linksMatrix
        ),
        links: (0, _link.renderLinks)(
            usedNodes,
            usedLinks,
            linksMatrix,
            config,
            linkCallbacks,
            highlightedNode,
            highlightedLink,
            transform
        ),
        groups: usedGroups,
        defs: _memoizedRenderDefs(config),
    };
}
