import React from "react";

import Node from "../node/Node";
import { isNodeVisible } from "../graph/collapse.helper";
import { buildNodeProps } from "./node.builder";

/**
 * Function that builds Node components.
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param  {Function[]} nodeCallbacks - array of callbacks for used defined event handler for node interactions.
 * @param  {Object} config - an object containing rd3g consumer defined configurations {@link #config config} for the graph.
 * @param  {string} highlightedNode - this value contains a string that represents the some currently highlighted node.
 * @param  {Object} highlightedLink - this object contains a source and target property for a link that is highlighted at some point in time.
 * @param  {string} highlightedLink.source - id of source node for highlighted link.
 * @param  {string} highlightedLink.target - id of target node for highlighted link.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @param  {Object.<string, Object>} linksMatrix - the matrix of connections of the graph
 * @returns {Array.<Object>} returns the generated array of node components
 * @memberof Graph/renderer
 */
function renderNodes(nodes, nodeCallbacks, config, highlightedNode, highlightedLink, transform, linksMatrix) {
    let outNodes = Object.keys(nodes);

    if (config.collapsible) {
        outNodes = outNodes.filter(nodeId => isNodeVisible(nodeId, nodes, linksMatrix));
    }

    return outNodes.map(nodeId => {
        const props = buildNodeProps(
            { ...nodes[nodeId], id: `${nodeId}` },
            config,
            nodeCallbacks,
            highlightedNode,
            highlightedLink,
            transform
        );

        return <Node key={nodeId} {...props} />;
    });
}

export { renderNodes };
