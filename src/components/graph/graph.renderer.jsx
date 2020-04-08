import uniqBy from "../../utils";

/**
 * @module Graph/renderer
 * @description
 * Offers a series of methods that isolate render logic for Graph component.
 */
import React from "react";

import CONST from "./graph.const";
import { MARKERS, MARKER_SMALL_SIZE, MARKER_MEDIUM_OFFSET, MARKER_LARGE_OFFSET } from "../marker/marker.const";

import Marker from "../marker/Marker";

import { renderLinks } from "../link/link.renderer";
import { renderNodes } from "../node/node.renderer";
import { renderGroups } from "../group/group.renderer";
import { getGroupNodes, createGroupPolygon } from "../group/group.helper";

/**
 * Builds graph defs (for now markers, but we could also have gradients for instance).
 * NOTE: defs are static svg graphical objects, thus we only need to render them once, the result
 * is cached on the 1st call and from there we simply return the cached jsx.
 * @returns {Function} memoized build definitions function.
 * @memberof Graph/renderer
 */
function _renderDefs() {
    let cachedDefs;

    return config => {
        if (cachedDefs) {
            return cachedDefs;
        }

        const small = MARKER_SMALL_SIZE;
        const medium = small + (MARKER_MEDIUM_OFFSET * config.maxZoom) / 3;
        const large = small + (MARKER_LARGE_OFFSET * config.maxZoom) / 3;

        const markerProps = {
            markerWidth: config.link.markerWidth,
            markerHeight: config.link.markerHeight,
        };

        cachedDefs = (
            <defs>
                <Marker id={MARKERS.MARKER_S} refX={small} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_SH} refX={small} fill={config.link.highlightColor} {...markerProps} />
                <Marker id={MARKERS.MARKER_M} refX={medium} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_MH} refX={medium} fill={config.link.highlightColor} {...markerProps} />
                <Marker id={MARKERS.MARKER_L} refX={large} fill={config.link.color} {...markerProps} />
                <Marker id={MARKERS.MARKER_LH} refX={large} fill={config.link.highlightColor} {...markerProps} />
            </defs>
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
const _memoizedRenderDefs = _renderDefs();

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
            nodes: renderNodes(nodes, nodeCallbacks, config, highlightedNode, highlightedLink, transform, linksMatrix),
            links: renderLinks(
                nodes,
                links,
                linksMatrix,
                config,
                linkCallbacks,
                highlightedNode,
                highlightedLink,
                transform
            ),
            groups: renderGroups(nodes, groups, config),
            defs: _memoizedRenderDefs(config),
        };
    }

    const nodesWithoutGroups = Object.values(nodes).filter(({ groups }) => !groups || !groups.length);
    const nodesWithGroups = Object.values(nodes).filter(({ groups }) => groups && groups.length);

    const groupNodes = getGroupNodes(nodesWithGroups);

    const collapsedNodes = Object.values(groups).map(({ id, fillColor }) => {
        const currentGroupNodes = groupNodes[id];
        const { centroid } = createGroupPolygon(currentGroupNodes);

        return {
            id,
            color: fillColor,
            x: centroid[0],
            y: centroid[1],
        };
    });

    const collapsedLinks = Object.values(links).map(link => {
        const { target, source } = link;

        const { id: sourceId } = source;
        const sourceNode = nodesWithGroups.find(({ id }) => id === sourceId);
        const sourceGroups = sourceNode?.groups || [sourceId];

        const { id: targetId } = target;
        const targetNode = nodesWithGroups.find(({ id }) => id === targetId);
        const targetGroups = targetNode?.groups || [targetId];

        const linksArray = [];

        sourceGroups.forEach(sourceGroup => {
            targetGroups.forEach(targetGroup => {
                linksArray.push({
                    ...link,
                    target: targetGroup,
                    source: sourceGroup,
                });
            });
        });

        return linksArray;
    });

    const collapsedLinksFlat = collapsedLinks.flat();
    const flattenCollapsedLinks = uniqBy(collapsedLinksFlat, ({ target, source }) => target + source);

    const resultNodes = [...nodesWithoutGroups, ...collapsedNodes].reduce((agg, curNode) => {
        return { ...agg, [curNode.id]: curNode };
    }, {});

    return {
        nodes: renderNodes(
            resultNodes,
            nodeCallbacks,
            config,
            highlightedNode,
            highlightedLink,
            transform,
            linksMatrix
        ),
        links: renderLinks(
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

export { renderGraph };
