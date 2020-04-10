"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.getCollapsedData = void 0;

var _group = require("./group.helper");

var _utils = require("../../utils");

var _link = require("../link/link.helper");

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
    throw new TypeError(
        "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
}

function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
    }
    return arr2;
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

var getCollapsedData = function getCollapsedData(nodes, links, groups) {
    var nodesWithoutGroups = Object.values(nodes).filter(function(_ref) {
        var nodeGroups = _ref.groups;
        return !nodeGroups || !nodeGroups.length;
    });
    var nodesWithGroups = Object.values(nodes).filter(function(_ref2) {
        var nodeGroups = _ref2.groups;
        return nodeGroups && nodeGroups.length;
    });
    var groupNodes = (0, _group.getGroupNodes)(nodesWithGroups);
    var collapsedNodes = Object.values(groups).map(function(_ref3) {
        var id = _ref3.id,
            fillColor = _ref3.fillColor;
        var currentGroupNodes = groupNodes[id];

        var _createGroupPolygon = (0, _group.createGroupPolygon)(currentGroupNodes),
            centroid = _createGroupPolygon.centroid;

        return {
            id: id,
            color: fillColor,
            x: centroid[0],
            y: centroid[1],
        };
    });
    var collapsedLinks = links.map(function(link) {
        var target = link.target,
            source = link.source;
        var sourceId = (0, _link.getId)(source);
        var sourceNode = nodesWithGroups.find(function(_ref4) {
            var id = _ref4.id;
            return id === sourceId;
        });
        var sourceGroups = (sourceNode === null || sourceNode === void 0 ? void 0 : sourceNode.groups) || [sourceId];
        var targetId = (0, _link.getId)(target);
        var targetNode = nodesWithGroups.find(function(_ref5) {
            var id = _ref5.id;
            return id === targetId;
        });
        var targetGroups = (targetNode === null || targetNode === void 0 ? void 0 : targetNode.groups) || [targetId];
        var linksArray = [];
        sourceGroups.forEach(function(sourceGroup) {
            targetGroups.forEach(function(targetGroup) {
                linksArray.push(
                    _objectSpread({}, link, {
                        target: targetGroup,
                        source: sourceGroup,
                    })
                );
            });
        });
        return linksArray;
    });
    var collapsedLinksFlat = collapsedLinks.flat();
    var flattenCollapsedLinks = (0, _utils.uniqBy)(collapsedLinksFlat, function(_ref6) {
        var target = _ref6.target,
            source = _ref6.source;
        return target + source;
    });
    var resultNodes = []
        .concat(_toConsumableArray(nodesWithoutGroups), _toConsumableArray(collapsedNodes))
        .reduce(function(agg, curNode) {
            return _objectSpread({}, agg, _defineProperty({}, curNode.id, curNode));
        }, {});
    return {
        nodes: resultNodes,
        links: flattenCollapsedLinks,
    };
};

exports.getCollapsedData = getCollapsedData;
