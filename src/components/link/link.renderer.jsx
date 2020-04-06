import React from "react";

import CONST from "../graph/graph.const";

import Link from "../link/Link";
import { buildLinkProps } from "./link.builder";
import { getId } from "./link.helper";

/**
 * Build Link components given a list of links.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Array.<Object>} links - array of links {@link #Link|Link}.
 * @param  {Array.<Object>} linksMatrix - array of links {@link #Link|Link}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Array.<Object>} returns the generated array of Link components.
 * @memberof Graph/renderer
 */
function renderLinks(nodes, links, linksMatrix, config, linkCallbacks, highlightedNode, highlightedLink, transform) {
    let outLinks = links;

    if (config.collapsible) {
        outLinks = outLinks.filter(({ isHidden }) => !isHidden);
    }

    return outLinks.map(link => {
        const { source, target } = link;
        const sourceId = getId(source);
        const targetId = getId(target);
        const key = `${sourceId}${CONST.COORDS_SEPARATOR}${targetId}`;
        const props = buildLinkProps(
            { ...link, source: `${sourceId}`, target: `${targetId}` },
            nodes,
            linksMatrix,
            config,
            linkCallbacks,
            `${highlightedNode}`,
            highlightedLink,
            transform
        );

        return <Link key={key} id={key} {...props} />;
    });
}

export { renderLinks };
