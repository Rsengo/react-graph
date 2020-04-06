"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.renderGroups = renderGroups;

var _react = _interopRequireDefault(require("react"));

var _Group = _interopRequireDefault(require("../group/Group"));

var _group = require("./group.builder");

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

function renderGroups(nodes, groups, config) {
    var nodeGroups = Object.values(nodes).reduce(function(aggregator, node) {
        if (!node.groups || !node.groups.length) {
            return aggregator;
        }

        var groups = node.groups;
        groups.forEach(function(group) {
            if (!aggregator[group]) {
                aggregator[group] = [node];
            } else {
                aggregator[group] = [].concat(_toConsumableArray(aggregator[group]), [node]);
            }
        });
        return aggregator;
    }, {});
    return groups.map(function(group) {
        var groupNodes = nodeGroups[group.id];
        var props = (0, _group.buildGroupProps)(group, groupNodes, config);
        return /*#__PURE__*/ _react["default"].createElement(
            _Group["default"],
            _extends(
                {
                    key: group.id,
                },
                props
            )
        );
    });
}
