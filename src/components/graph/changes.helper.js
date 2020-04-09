import { isDeepEqual, isEmptyObject, merge, pick, antiPick, throwErr, logWarning } from "../../utils";

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
    const newConfig = nextProps.config || {};
    const configUpdated = newConfig && !isEmptyObject(newConfig) && !isDeepEqual(newConfig, currentState.config);
    const d3ConfigUpdated = newConfig && newConfig.d3 && !isDeepEqual(newConfig.d3, currentState.config.d3);

    return { configUpdated, d3ConfigUpdated };
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
    const nextNodes = nextProps.data.nodes.map(n => antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE));
    const nextLinks = nextProps.data.links;
    const stateD3Nodes = currentState.d3Nodes.map(n => antiPick(n, NODE_PROPERTIES_DISCARD_TO_COMPARE));
    const stateD3Links = currentState.d3Links.map(l => ({
        source: getId(l.source),
        target: getId(l.target),
    }));
    const graphElementsUpdated = !(isDeepEqual(nextNodes, stateD3Nodes) && isDeepEqual(nextLinks, stateD3Links));
    const newGraphElements =
        nextNodes.length !== stateD3Nodes.length ||
        nextLinks.length !== stateD3Links.length ||
        !isDeepEqual(nextNodes.map(_pickId), stateD3Nodes.map(_pickId)) ||
        !isDeepEqual(nextLinks.map(_pickSourceAndTarget), stateD3Links.map(_pickSourceAndTarget));

    return { graphElementsUpdated, newGraphElements };
}

export { checkForGraphConfigChanges, checkForGraphElementsChanges };
