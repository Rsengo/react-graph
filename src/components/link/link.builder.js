import CONST from "../graph/graph.const";

import { buildLinkPathDefinition } from "./link.helper";
import { getMarkerId } from "../marker/marker.helper";

/**
 * Build some Link properties based on given parameters.
 * @param  {Object} link - the link object for which we will generate properties.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Object.<string, Object>} links - same as {@link #graphrenderer|links in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object that aggregates all props for creating respective Link component instance.
 * @memberof Graph/builder
 */
function buildLinkProps(link, nodes, links, config, linkCallbacks, highlightedNode, highlightedLink, transform) {
    const { source, target } = link;
    const x1 = nodes?.[source]?.x || 0;
    const y1 = nodes?.[source]?.y || 0;
    const x2 = nodes?.[target]?.x || 0;
    const y2 = nodes?.[target]?.y || 0;
    const type = link.type || config.link.type;
    const d = buildLinkPathDefinition({ source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }, type);

    let mainNodeParticipates = false;

    switch (config.highlightDegree) {
        case 0:
            break;
        case 2:
            mainNodeParticipates = true;
            break;
        default:
            // 1st degree is the fallback behavior
            mainNodeParticipates = source === highlightedNode || target === highlightedNode;
            break;
    }

    const guiltyNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
    const guiltyLink =
        source === (highlightedLink && highlightedLink.source) &&
        target === (highlightedLink && highlightedLink.target);
    const highlight = guiltyNode || guiltyLink;

    let opacity = link.opacity || config.link.opacity;

    if (highlightedNode || (highlightedLink && highlightedLink.source)) {
        opacity = highlight ? config.link.opacity : config.highlightOpacity;
    }

    let stroke = link.color || config.link.color;

    if (highlight) {
        stroke = config.link.highlightColor === CONST.KEYWORDS.SAME ? config.link.color : config.link.highlightColor;
    }

    let strokeWidth = (link.strokeWidth || config.link.strokeWidth) * (1 / transform);

    if (config.link.semanticStrokeWidth) {
        const linkValue = links[source][target] || links[target][source] || 1;

        strokeWidth += (linkValue * strokeWidth) / 10;
    }

    const markerId = config.directed ? getMarkerId(highlight, transform, config) : null;

    const t = 1 / transform;

    let fontSize = null,
        fontColor = null,
        fontWeight = null,
        label = null;

    if (config.link.renderLabel) {
        if (typeof config.link.labelProperty === "function") {
            label = config.link.labelProperty(link);
        } else {
            label = link[config.link.labelProperty];
        }

        fontSize = link.fontSize || config.link.fontSize;
        fontColor = link.fontColor || config.link.fontColor;
        fontWeight = highlight ? config.link.highlightFontWeight : config.link.fontWeight;
    }

    return {
        className: CONST.LINK_CLASS_NAME,
        d,
        fontColor,
        fontSize: fontSize * t,
        fontWeight,
        label,
        markerId,
        mouseCursor: config.link.mouseCursor,
        opacity,
        source,
        stroke,
        strokeWidth,
        target,
        onClickLink: linkCallbacks.onClickLink,
        onMouseOutLink: linkCallbacks.onMouseOutLink,
        onMouseOverLink: linkCallbacks.onMouseOverLink,
        onRightClickLink: linkCallbacks.onRightClickLink,
    };
}

export { buildLinkProps };
