"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderNodes = renderNodes;

var _react = _interopRequireDefault(require("react"));

var _Node = _interopRequireDefault(require("../node/Node"));

var _collapse = require("../graph/collapse.helper");

var _node = require("./node.builder");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _extends() {
    _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
    return _extends.apply(this, arguments);
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
    var outNodes = Object.keys(nodes);

    if (config.collapsible) {
        outNodes = outNodes.filter(function(nodeId) {
            return (0, _collapse.isNodeVisible)(nodeId, nodes, linksMatrix);
        });
    }

    return outNodes.map(function(nodeId) {
        var props = (0, _node.buildNodeProps)(
            _objectSpread({}, nodes[nodeId], {
                id: "".concat(nodeId),
            }),
            config,
            nodeCallbacks,
            highlightedNode,
            highlightedLink,
            transform
        );
        return /*#__PURE__*/ _react["default"].createElement(
            _Node["default"],
            _extends(
                {
                    key: nodeId,
                },
                props
            )
        );
    });
}
