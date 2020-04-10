"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderLinks = renderLinks;

var _react = _interopRequireDefault(require("react"));

var _graph = _interopRequireDefault(require("../graph/graph.const"));

var _Link = _interopRequireDefault(require("../link/Link"));

var _link = require("./link.builder");

var _link2 = require("./link.helper");

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
    var outLinks = links;

    if (config.collapsible) {
        outLinks = outLinks.filter(function(_ref) {
            var isHidden = _ref.isHidden;
            return !isHidden;
        });
    }

    return outLinks.map(function(link) {
        var source = link.source,
            target = link.target;
        var sourceId = (0, _link2.getId)(source);
        var targetId = (0, _link2.getId)(target);
        var key = ""
            .concat(sourceId)
            .concat(_graph["default"].COORDS_SEPARATOR)
            .concat(targetId);
        var props = (0, _link.buildLinkProps)(
            _objectSpread({}, link, {
                source: "".concat(sourceId),
                target: "".concat(targetId),
            }),
            nodes,
            linksMatrix,
            config,
            linkCallbacks,
            "".concat(highlightedNode),
            highlightedLink,
            transform
        );
        return /*#__PURE__*/ _react["default"].createElement(
            _Link["default"],
            _extends(
                {
                    key: key,
                    id: key,
                },
                props
            )
        );
    });
}
