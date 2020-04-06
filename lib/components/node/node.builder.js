"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.buildNodeProps = buildNodeProps;

var _graph = _interopRequireDefault(require("../graph/graph.const"));

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
    var highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    var someLinkHighlighted = highlightedLink && highlightedLink.source && highlightedLink.target;
    var someNodeHighlighted = !!(highlightedNode || someLinkHighlighted);
    var opacity;

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

function buildNodeProps(node, config) {
    var nodeCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var highlightedNode = arguments.length > 3 ? arguments[3] : undefined;
    var highlightedLink = arguments.length > 4 ? arguments[4] : undefined;
    var transform = arguments.length > 5 ? arguments[5] : undefined;
    var highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);

    var opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);

    var fill = node.color || config.node.color;

    if (highlight && config.node.highlightColor !== _graph["default"].KEYWORDS.SAME) {
        fill = config.node.highlightColor;
    }

    var stroke = node.strokeColor || config.node.strokeColor;

    if (highlight && config.node.highlightStrokeColor !== _graph["default"].KEYWORDS.SAME) {
        stroke = config.node.highlightStrokeColor;
    }

    var label = node[config.node.labelProperty] || node.id;

    if (typeof config.node.labelProperty === "function") {
        label = config.node.labelProperty(node);
    }

    var labelPosition = node.labelPosition || config.node.labelPosition;
    var strokeWidth = node.strokeWidth || config.node.strokeWidth;

    if (highlight && config.node.highlightStrokeWidth !== _graph["default"].KEYWORDS.SAME) {
        strokeWidth = config.node.highlightStrokeWidth;
    }

    var t = 1 / transform;
    var nodeSize = node.size || config.node.size;
    var fontSize = highlight ? config.node.highlightFontSize : config.node.fontSize;
    var dx = fontSize * t + nodeSize / 100 + 1.5;
    var svg = node.svg || config.node.svg;
    var fontColor = node.fontColor || config.node.fontColor;
    return _objectSpread({}, node, {
        className: _graph["default"].NODE_CLASS_NAME,
        cursor: config.node.mouseCursor,
        cx: (node === null || node === void 0 ? void 0 : node.x) || "0",
        cy: (node === null || node === void 0 ? void 0 : node.y) || "0",
        dx: dx,
        fill: fill,
        fontColor: fontColor,
        fontSize: fontSize * t,
        fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
        id: node.id,
        label: label,
        labelPosition: labelPosition,
        opacity: opacity,
        overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
        renderLabel: node.renderLabel || config.node.renderLabel,
        size: nodeSize * t,
        stroke: stroke,
        strokeWidth: strokeWidth * t,
        svg: svg,
        type: node.symbolType || config.node.symbolType,
        viewGenerator: node.viewGenerator || config.node.viewGenerator,
        onClickNode: nodeCallbacks.onClickNode,
        onMouseOut: nodeCallbacks.onMouseOut,
        onMouseOverNode: nodeCallbacks.onMouseOverNode,
        onRightClickNode: nodeCallbacks.onRightClickNode,
    });
}
