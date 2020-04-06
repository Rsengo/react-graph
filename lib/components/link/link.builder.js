"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.buildLinkProps = buildLinkProps;

var _graph = _interopRequireDefault(require("../graph/graph.const"));

var _link = require("./link.helper");

var _marker = require("../marker/marker.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

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
    var _nodes$source, _nodes$source2, _nodes$target, _nodes$target2;

    var source = link.source,
        target = link.target;
    var x1 =
        (nodes === null || nodes === void 0
            ? void 0
            : (_nodes$source = nodes[source]) === null || _nodes$source === void 0
            ? void 0
            : _nodes$source.x) || 0;
    var y1 =
        (nodes === null || nodes === void 0
            ? void 0
            : (_nodes$source2 = nodes[source]) === null || _nodes$source2 === void 0
            ? void 0
            : _nodes$source2.y) || 0;
    var x2 =
        (nodes === null || nodes === void 0
            ? void 0
            : (_nodes$target = nodes[target]) === null || _nodes$target === void 0
            ? void 0
            : _nodes$target.x) || 0;
    var y2 =
        (nodes === null || nodes === void 0
            ? void 0
            : (_nodes$target2 = nodes[target]) === null || _nodes$target2 === void 0
            ? void 0
            : _nodes$target2.y) || 0;
    var type = link.type || config.link.type;
    var d = (0, _link.buildLinkPathDefinition)(
        {
            source: {
                x: x1,
                y: y1,
            },
            target: {
                x: x2,
                y: y2,
            },
        },
        type
    );
    var mainNodeParticipates = false;

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

    var guiltyNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
    var guiltyLink =
        source === (highlightedLink && highlightedLink.source) &&
        target === (highlightedLink && highlightedLink.target);
    var highlight = guiltyNode || guiltyLink;
    var opacity = link.opacity || config.link.opacity;

    if (highlightedNode || (highlightedLink && highlightedLink.source)) {
        opacity = highlight ? config.link.opacity : config.highlightOpacity;
    }

    var stroke = link.color || config.link.color;

    if (highlight) {
        stroke =
            config.link.highlightColor === _graph["default"].KEYWORDS.SAME
                ? config.link.color
                : config.link.highlightColor;
    }

    var strokeWidth = (link.strokeWidth || config.link.strokeWidth) * (1 / transform);

    if (config.link.semanticStrokeWidth) {
        var linkValue = links[source][target] || links[target][source] || 1;
        strokeWidth += (linkValue * strokeWidth) / 10;
    }

    var markerId = config.directed ? (0, _marker.getMarkerId)(highlight, transform, config) : null;
    var t = 1 / transform;
    var fontSize = null,
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
        className: _graph["default"].LINK_CLASS_NAME,
        d: d,
        fontColor: fontColor,
        fontSize: fontSize * t,
        fontWeight: fontWeight,
        label: label,
        markerId: markerId,
        mouseCursor: config.link.mouseCursor,
        opacity: opacity,
        source: source,
        stroke: stroke,
        strokeWidth: strokeWidth,
        target: target,
        onClickLink: linkCallbacks.onClickLink,
        onMouseOutLink: linkCallbacks.onMouseOutLink,
        onMouseOverLink: linkCallbacks.onMouseOverLink,
        onRightClickLink: linkCallbacks.onRightClickLink,
    };
}
