"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.getCenterAndZoomTransformation = getCenterAndZoomTransformation;
exports.initializeGraphState = initializeGraphState;
exports.updateNodeHighlightedValue = updateNodeHighlightedValue;

var _graph2 = _interopRequireDefault(require("./graph.const"));

var _graph3 = _interopRequireDefault(require("./graph.config"));

var _err = _interopRequireDefault(require("../../err"));

var _utils = require("../../utils");

var _collapse = require("./collapse.helper");

var _colorHelper = require("../../helpers/colorHelper");

var _link = require("../link/link.helper");

var _collapse2 = require("../group/collapse.hepler");

var _simulationHelper = require("../../helpers/simulationHelper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
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

var NODE_PROPS_WHITELIST = ["id", "highlighted", "x", "y", "index", "vy", "vx"];
var LINK_PROPS_WHITELIST = ["index", "source", "target", "isHidden"];
/**
 * Receives a matrix of the graph with the links source and target as concrete node instances and it transforms it
 * in a lightweight matrix containing only links with source and target being strings representative of some node id
 * and the respective link value (if non existent will default to 1).
 * @param  {Array.<Link>} graphLinks - an array of all graph links.
 * @param  {Object} config - the graph config.
 * @returns {Object.<string, Object>} an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @memberof Graph/helper
 */

function _initializeLinks(graphLinks, config) {
    return graphLinks.reduce(function(links, l) {
        var source = (0, _link.getId)(l.source);
        var target = (0, _link.getId)(l.target);

        if (!links[source]) {
            links[source] = {};
        }

        if (!links[target]) {
            links[target] = {};
        }

        var value = config.collapsible && l.isHidden ? 0 : l.value || 1;
        links[source][target] = value;

        if (!config.directed) {
            links[target][source] = value;
        }

        return links;
    }, {});
}
/**
 * Method that initialize graph nodes provided by rd3g consumer and adds additional default mandatory properties
 * that are optional for the user. Also it generates an index mapping, this maps nodes ids the their index in the array
 * of nodes. This is needed because d3 callbacks such as node click and link click return the index of the node.
 * @param  {Array.<Node>} graphNodes - the array of nodes provided by the rd3g consumer.
 * @returns {Object.<string, Object>} returns the nodes ready to be used within rd3g with additional properties such as x, y
 * and highlighted values.
 * @memberof Graph/helper
 */

function _initializeNodes(graphNodes) {
    var nodes = {};
    var n = graphNodes.length;

    for (var i = 0; i < n; i++) {
        var node = graphNodes[i];
        node.highlighted = false;

        if (!Object.prototype.hasOwnProperty.call(node, "x")) {
            node.x = 0;
        }

        if (!Object.prototype.hasOwnProperty.call(node, "y")) {
            node.y = 0;
        }

        nodes[node.id.toString()] = node;
    }

    return nodes;
}
/**
 * Maps an input link (with format `{ source: 'sourceId', target: 'targetId' }`) to a d3Link
 * (with format `{ source: { id: 'sourceId' }, target: { id: 'targetId' } }`). If d3Link with
 * given index exists already that same d3Link is returned.
 * @param {Object} link - input link.
 * @param {number} index - index of the input link.
 * @param {Array.<Object>} d3Links - all d3Links.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {Object} state - Graph component current state (same format as returned object on this function).
 * @returns {Object} a d3Link.
 * @memberof Graph/helper
 */

function _mergeDataLinkWithD3Link(link, index) {
    var d3Links = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var config = arguments.length > 3 ? arguments[3] : undefined;
    var state = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    // find the matching link if it exists
    var tmp = d3Links.find(function(l) {
        return l.source.id === link.source && l.target.id === link.target;
    });
    var d3Link = tmp && (0, _utils.pick)(tmp, LINK_PROPS_WHITELIST);
    var customProps = (0, _utils.antiPick)(link, ["source", "target"]);

    if (d3Link) {
        var toggledDirected =
            state.config &&
            Object.prototype.hasOwnProperty.call(state.config, "directed") &&
            config.directed !== state.config.directed;

        var refinedD3Link = _objectSpread(
            {
                index: index,
            },
            d3Link,
            {},
            customProps
        ); // every time we toggle directed config all links should be visible again

        if (toggledDirected) {
            return _objectSpread({}, refinedD3Link, {
                isHidden: false,
            });
        } // every time we disable collapsible (collapsible is false) all links should be visible again

        return config.collapsible
            ? refinedD3Link
            : _objectSpread({}, refinedD3Link, {
                  isHidden: false,
              });
    }

    var highlighted = false;
    var source = {
        id: link.source,
        highlighted: highlighted,
    };
    var target = {
        id: link.target,
        highlighted: highlighted,
    };
    return _objectSpread(
        {
            index: index,
            source: source,
            target: target,
        },
        customProps
    );
}
/**
 * Tags orphan nodes with a `_orphan` flag.
 * @param {Object.<string, Object>} nodes - nodes mapped by their id.
 * @param {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @returns {Object.<string, Object>} same input nodes structure with tagged orphans nodes where applicable.
 * @memberof Graph/helper
 */

function _tagOrphanNodes(nodes, linksMatrix) {
    return Object.keys(nodes).reduce(function(acc, nodeId) {
        var _computeNodeDegree = (0, _collapse.computeNodeDegree)(nodeId, linksMatrix),
            inDegree = _computeNodeDegree.inDegree,
            outDegree = _computeNodeDegree.outDegree;

        var node = nodes[nodeId];
        var taggedNode =
            inDegree === 0 && outDegree === 0
                ? _objectSpread({}, node, {
                      _orphan: true,
                  })
                : node;
        acc[nodeId] = taggedNode;
        return acc;
    }, {});
}

function _colorGroups(groups) {
    return groups.map(function(group) {
        return _objectSpread({}, group, {
            fillColor: group.fillColor || (0, _colorHelper.generateRainbowColor)(),
        });
    });
}
/**
 * Some integrity validations on links and nodes structure. If some validation fails the function will
 * throw an error.
 * @param  {Object} data - Same as {@link #initializeGraphState|data in initializeGraphState}.
 * @throws can throw the following error or warning msg:
 * INSUFFICIENT_DATA - msg if no nodes are provided
 * INVALID_LINKS - if links point to nonexistent nodes
 * INSUFFICIENT_LINKS - if no links are provided
 * @returns {undefined}
 * @memberof Graph/helper
 */

function _validateGraphData(data) {
    if (!data.nodes || !data.nodes.length) {
        (0, _utils.throwErr)("Graph", _err["default"].INSUFFICIENT_DATA);
    }

    if (!data.links || !data.links.length) {
        (0, _utils.logWarning)("Graph", _err["default"].INSUFFICIENT_LINKS);
        data.links = [];
    } //TODO валидация групп

    var n = data.links.length;

    var _loop = function _loop(i) {
        var l = data.links[i];

        if (
            !data.nodes.find(function(n) {
                return n.id === l.source;
            })
        ) {
            (0, _utils.throwErr)(
                "Graph",
                "".concat(_err["default"].INVALID_LINKS, ' - "').concat(l.source, '" is not a valid source node id')
            );
        }

        if (
            !data.nodes.find(function(n) {
                return n.id === l.target;
            })
        ) {
            (0, _utils.throwErr)(
                "Graph",
                "".concat(_err["default"].INVALID_LINKS, ' - "').concat(l.target, '" is not a valid target node id')
            );
        }

        if (l && l.value !== undefined && typeof l.value !== "number") {
            (0, _utils.throwErr)(
                "Graph",
                ""
                    .concat(_err["default"].INVALID_LINK_VALUE, ' - found in link with source "')
                    .concat(l.source, '" and target "')
                    .concat(l.target, '"')
            );
        }
    };

    for (var i = 0; i < n; i++) {
        _loop(i);
    }
}
/**
 * Returns the transformation to apply in order to center the graph on the
 * selected node.
 * @param {Object} d3Node - node to focus the graph view on.
 * @param {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {string|undefined} transform rule to apply.
 * @memberof Graph/helper
 */

function getCenterAndZoomTransformation(d3Node, config) {
    if (!d3Node) {
        return;
    }

    var width = config.width,
        height = config.height,
        focusZoom = config.focusZoom;
    return "\n        translate("
        .concat(width / 2, ", ")
        .concat(height / 2, ")\n        scale(")
        .concat(focusZoom, ")\n        translate(")
        .concat(-d3Node.x, ", ")
        .concat(-d3Node.y, ")\n    ");
}
/**
 * Encapsulates common procedures to initialize graph.
 * @param {Object} props - Graph component props, object that holds data, id and config.
 * @param {Object} props.data - Data object holds links (array of **Link**) and nodes (array of **Node**).
 * @param {string} props.id - the graph id.
 * @param {Object} props.config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {Object} state - Graph component current state (same format as returned object on this function).
 * @returns {Object} a fully (re)initialized graph state object.
 * @memberof Graph/helper
 */

function initializeGraphState(_ref, state) {
    var data = _ref.data,
        id = _ref.id,
        config = _ref.config;

    _validateGraphData(data);

    var graph = {};

    if (state && state.nodes) {
        graph = _objectSpread({}, graph, {
            nodes: data.nodes.map(function(n) {
                return state.nodes[n.id]
                    ? _objectSpread({}, n, {}, (0, _utils.pick)(state.nodes[n.id], NODE_PROPS_WHITELIST))
                    : _objectSpread({}, n);
            }),
            links: data.links.map(function(l, index) {
                return _mergeDataLinkWithD3Link(l, index, state && state.d3Links, config, state);
            }),
        });
    } else {
        graph = _objectSpread({}, graph, {
            nodes: data.nodes.map(function(n) {
                return _objectSpread({}, n);
            }),
            links: data.links.map(function(l) {
                return _objectSpread({}, l);
            }),
        });
    } // TODO: refactor block

    if (state && state.groups) {
        graph = _objectSpread({}, graph, {
            groups: data.groups
                ? data.groups.map(function(g) {
                      var stateGroup = state.groups.find(function(group) {
                          return group.id === g.id;
                      });
                      return _objectSpread({}, stateGroup, {}, g);
                  })
                : [],
        });
    } else {
        graph = _objectSpread({}, graph, {
            groups: data.groups
                ? data.groups.map(function(g) {
                      return _objectSpread({}, g);
                  })
                : [],
        });
    }

    var newConfig = _objectSpread({}, (0, _utils.merge)(_graph3["default"], config || {})),
        links = _initializeLinks(graph.links, newConfig),
        // matrix of graph connections
        nodes = _tagOrphanNodes(_initializeNodes(graph.nodes), links),
        groups = _colorGroups(graph.groups);

    var _graph = graph,
        d3Nodes = _graph.nodes,
        d3Links = _graph.links;
    var formatedId = id.replace(/ /g, "_");
    var simulation = (0, _simulationHelper.createForceSimulation)(
        newConfig.width,
        newConfig.height,
        newConfig.d3 && newConfig.d3.gravity
    );
    var minZoom = newConfig.minZoom,
        maxZoom = newConfig.maxZoom,
        focusZoom = newConfig.focusZoom;

    if (focusZoom > maxZoom) {
        newConfig.focusZoom = maxZoom;
    } else if (focusZoom < minZoom) {
        newConfig.focusZoom = minZoom;
    }

    var _getCollapsedData = (0, _collapse2.getCollapsedData)(nodes, d3Links, groups),
        collapsedNodes = _getCollapsedData.nodes,
        collapsedLinks = _getCollapsedData.links;

    return {
        id: formatedId,
        config: newConfig,
        links: links,
        d3Links: d3Links,
        nodes: nodes,
        d3Nodes: d3Nodes,
        highlightedNode: "",
        simulation: simulation,
        newGraphElements: false,
        configUpdated: false,
        transform: 1,
        draggedNode: null,
        groups: groups,
        groupsCollapsed: (state === null || state === void 0 ? void 0 : state.groupsCollapsed) || false,
        collapsedNodes: collapsedNodes,
        collapsedLinks: collapsedLinks,
    };
}
/**
 * This function updates the highlighted value for a given node and also updates highlight props.
 * @param {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param {Object.<string, Object>} links - an object containing a matrix of connections of the graph.
 * @param {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param {string} id - identifier of node to update.
 * @param {string} value - new highlight value for given node.
 * @returns {Object} returns an object containing the updated nodes
 * and the id of the highlighted node.
 * @memberof Graph/helper
 */

function updateNodeHighlightedValue(nodes, collapsedNodes, links, collapsedLinks, groupsCollapsed, config, id) {
    var value = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;
    var usedNodes = groupsCollapsed ? collapsedNodes : nodes;
    var usedLinks = groupsCollapsed ? collapsedLinks : links;
    var highlightedNode = value ? id : "";

    var node = _objectSpread({}, usedNodes[id], {
        highlighted: value,
    });

    var updatedNodes = _objectSpread({}, usedNodes, _defineProperty({}, id, node)); // when highlightDegree is 0 we want only to highlight selected node

    if (usedLinks[id] && config.highlightDegree !== 0) {
        updatedNodes = Object.keys(usedLinks[id]).reduce(function(acc, linkId) {
            var updatedNode = _objectSpread({}, updatedNodes[linkId], {
                highlighted: value,
            });

            acc[linkId] = updatedNode;
            return acc;
        }, updatedNodes);
    }

    return {
        nodes: groupsCollapsed ? nodes : updatedNodes,
        collapsedNodes: groupsCollapsed ? updatedNodes : collapsedNodes,
        highlightedNode: highlightedNode,
    };
}
