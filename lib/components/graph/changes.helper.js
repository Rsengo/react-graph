"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.checkForGraphConfigChanges = checkForGraphConfigChanges;
exports.checkForGraphElementsChanges = checkForGraphElementsChanges;

var _utils = require("../../utils");

var _link = require("../link/link.helper");

// list of properties that are of no interest when it comes to nodes and links comparison
var NODE_PROPERTIES_DISCARD_TO_COMPARE = ["x", "y", "vx", "vy", "index"];
/**
 * Picks the id.
 * @param {Object} o object to pick from.
 * @returns {Object} new object with id property only.
 * @memberof Graph/helper
 */

function _pickId(o) {
    return (0, _utils.pick)(o, ["id"]);
}
/**
 * Picks source and target.
 * @param {Object} o object to pick from.
 * @returns {Object} new object with source and target only.
 * @memberof Graph/helper
 */

function _pickSourceAndTarget(o) {
    return (0, _utils.pick)(o, ["source", "target"]);
}
/**
 * Logic to check for changes in graph config.
 * @param {Object} nextProps - nextProps that graph will receive.
 * @param {Object} currentState - the current state of the graph.
 * @returns {Object.<string, boolean>} returns object containing update check flags:
 * - configUpdated - global flag that indicates if any property was updated.
 * - d3ConfigUpdated - specific flag that indicates changes in d3 configurations.
 * @memberof Graph/helper
 */

function checkForGraphConfigChanges(nextProps, currentState) {
    var newConfig = nextProps.config || {};
    var configUpdated =
        newConfig && !(0, _utils.isEmptyObject)(newConfig) && !(0, _utils.isDeepEqual)(newConfig, currentState.config);
    var d3ConfigUpdated = newConfig && newConfig.d3 && !(0, _utils.isDeepEqual)(newConfig.d3, currentState.config.d3);
    return {
        configUpdated: configUpdated,
        d3ConfigUpdated: d3ConfigUpdated,
    };
}
/**
 * This function checks for graph elements (nodes and links) changes, in two different
 * levels of significance, updated elements (whether some property has changed in some
 * node or link) and new elements (whether some new elements or added/removed from the graph).
 * @param {Object} nextProps - nextProps that graph will receive.
 * @param {Object} currentState - the current state of the graph.
 * @returns {Object.<string, boolean>} returns object containing update check flags:
 * - newGraphElements - flag that indicates whether new graph elements were added.
 * - graphElementsUpdated - flag that indicates whether some graph elements have
 * updated (some property that is not in NODE_PROPERTIES_DISCARD_TO_COMPARE was added to
 * some node or link or was updated).
 * @memberof Graph/helper
 */

function checkForGraphElementsChanges(nextProps, currentState) {
    var nextNodes = nextProps.data.nodes.map(function(n) {
        return (0, _utils.antiPick)(n, NODE_PROPERTIES_DISCARD_TO_COMPARE);
    });
    var nextLinks = nextProps.data.links;
    var stateD3Nodes = currentState.d3Nodes.map(function(n) {
        return (0, _utils.antiPick)(n, NODE_PROPERTIES_DISCARD_TO_COMPARE);
    });
    var stateD3Links = currentState.d3Links.map(function(l) {
        return {
            source: (0, _link.getId)(l.source),
            target: (0, _link.getId)(l.target),
        };
    });
    var graphElementsUpdated = !(
        (0, _utils.isDeepEqual)(nextNodes, stateD3Nodes) && (0, _utils.isDeepEqual)(nextLinks, stateD3Links)
    );
    var newGraphElements =
        nextNodes.length !== stateD3Nodes.length ||
        nextLinks.length !== stateD3Links.length ||
        !(0, _utils.isDeepEqual)(nextNodes.map(_pickId), stateD3Nodes.map(_pickId)) ||
        !(0, _utils.isDeepEqual)(nextLinks.map(_pickSourceAndTarget), stateD3Links.map(_pickSourceAndTarget));
    return {
        graphElementsUpdated: graphElementsUpdated,
        newGraphElements: newGraphElements,
    };
}
