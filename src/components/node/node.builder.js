import CONST from "../graph/graph.const";

/**
 * Get the correct node opacity in order to properly make decisions based on context such as currently highlighted node.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {number} the opacity value for the given node.
 * @memberof Graph/builder
 */
function _getNodeOpacity(node, highlightedNode, highlightedLink, config) {
    const highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    const someLinkHighlighted = highlightedLink && highlightedLink.source && highlightedLink.target;
    const someNodeHighlighted = !!(highlightedNode || someLinkHighlighted);

    let opacity;

    if (someNodeHighlighted && config.highlightDegree === 0) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else if (someNodeHighlighted) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else {
        opacity = node.opacity || config.node.opacity;
    }

    return opacity;
}

/**
 * Build some Node properties based on given parameters.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} nodeCallbacks - same as {@link #graphrenderer|nodeCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns object that contain Link props ready to be feeded to the Link component.
 * @memberof Graph/builder
 */
function buildNodeProps(node, config, nodeCallbacks = {}, highlightedNode, highlightedLink, transform) {
    const highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    const opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);

    let fill = node.color || config.node.color;

    if (highlight && config.node.highlightColor !== CONST.KEYWORDS.SAME) {
        fill = config.node.highlightColor;
    }

    let stroke = node.strokeColor || config.node.strokeColor;

    if (highlight && config.node.highlightStrokeColor !== CONST.KEYWORDS.SAME) {
        stroke = config.node.highlightStrokeColor;
    }

    let label = node[config.node.labelProperty] || node.id;

    if (typeof config.node.labelProperty === "function") {
        label = config.node.labelProperty(node);
    }

    let labelPosition = node.labelPosition || config.node.labelPosition;

    let strokeWidth = node.strokeWidth || config.node.strokeWidth;

    if (highlight && config.node.highlightStrokeWidth !== CONST.KEYWORDS.SAME) {
        strokeWidth = config.node.highlightStrokeWidth;
    }

    const t = 1 / transform;
    const nodeSize = node.size || config.node.size;
    const fontSize = highlight ? config.node.highlightFontSize : config.node.fontSize;
    const dx = fontSize * t + nodeSize / 100 + 1.5;
    const svg = node.svg || config.node.svg;
    const fontColor = node.fontColor || config.node.fontColor;

    return {
        ...node,
        className: CONST.NODE_CLASS_NAME,
        cursor: config.node.mouseCursor,
        cx: node?.x || "0",
        cy: node?.y || "0",
        dx,
        fill,
        fontColor,
        fontSize: fontSize * t,
        fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
        id: node.id,
        label,
        labelPosition,
        opacity,
        overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
        renderLabel: node.renderLabel || config.node.renderLabel,
        size: nodeSize * t,
        stroke,
        strokeWidth: strokeWidth * t,
        svg,
        type: node.symbolType || config.node.symbolType,
        viewGenerator: node.viewGenerator || config.node.viewGenerator,
        onClickNode: nodeCallbacks.onClickNode,
        onMouseOut: nodeCallbacks.onMouseOut,
        onMouseOverNode: nodeCallbacks.onMouseOverNode,
        onRightClickNode: nodeCallbacks.onRightClickNode,
    };
}

export { buildNodeProps };
